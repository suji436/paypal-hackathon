import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const repoRoot = fileURLToPath(new URL('../', import.meta.url));

async function getAvailablePort() {
  const probe = createServer();
  await new Promise((resolve, reject) => {
    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', resolve);
  });
  const { port } = probe.address();
  await new Promise((resolve, reject) => probe.close((error) => error ? reject(error) : resolve()));
  return port;
}

async function waitForServer(url, child, getLogs) {
  const deadline = Date.now() + 10_000;
  let lastError;

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`API process exited early. ${getLogs()}`);
    }

    try {
      const response = await fetch(url);
      if (response.ok) return;
      lastError = new Error(`Health endpoint returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await delay(150);
  }

  throw new Error(`API did not start in time: ${lastError}. ${getLogs()}`);
}

test('demo API serves health, catalog, sign-in, cart, orders, and dashboard', async () => {
  const port = await getAvailablePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const child = spawn(process.execPath, ['server.js'], {
    cwd: repoRoot,
    env: { ...process.env, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let logs = '';
  child.stdout.setEncoding('utf8').on('data', (chunk) => { logs += chunk; });
  child.stderr.setEncoding('utf8').on('data', (chunk) => { logs += chunk; });
  const getLogs = () => logs.trim();

  try {
    await waitForServer(`${baseUrl}/api/health`, child, getLogs);

    const healthResponse = await fetch(`${baseUrl}/api/health`);
    const health = await healthResponse.json();
    assert.equal(health.status, 'ok');

    const catalogResponse = await fetch(`${baseUrl}/api/products?category=Spices&search=Sambar`);
    assert.equal(catalogResponse.status, 200);
    const catalog = await catalogResponse.json();
    assert.ok(catalog.items.some((product) => product.id === 'p-001'));
    assert.equal(catalog.total, catalog.items.length);

    const productResponse = await fetch(`${baseUrl}/api/products/p-001`);
    assert.equal(productResponse.status, 200);
    assert.equal((await productResponse.json()).name, 'Aachi Sambar Powder 500g');

    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'senthil@example.com', password: '123456' }),
    });
    assert.equal(loginResponse.status, 200);
    const login = await loginResponse.json();
    assert.equal(login.user.email, 'senthil@example.com');
    assert.equal(Object.hasOwn(login.user, 'password'), false);

    const userId = encodeURIComponent(login.user.id);
    for (const resource of ['cart', 'orders', 'dashboard']) {
      const response = await fetch(`${baseUrl}/api/${resource}/${userId}`);
      assert.equal(response.status, 200, `${resource} endpoint should respond successfully`);
    }

    const missingProduct = await fetch(`${baseUrl}/api/products/not-a-real-product`);
    assert.equal(missingProduct.status, 404);
  } finally {
    if (child.exitCode === null) {
      child.kill('SIGTERM');
      await Promise.race([
        new Promise((resolve) => child.once('exit', resolve)),
        delay(2_000).then(() => {
          if (child.exitCode === null) child.kill('SIGKILL');
        }),
      ]);
    }
  }
});
