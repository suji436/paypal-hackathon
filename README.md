# VeriGrocery AI

A React + Vite demo for VeriGrocery's 51 customer, merchant, wholesale, and admin screens. The repository also includes an Express demo API backed by a local JSON file.

> **Demo only:** the included API is not production-ready. It uses demo accounts and local JSON storage, and its routes do not implement real authentication or authorization. Do not use it for real customer data, credentials, or payments.

## Run locally

Requires Node.js 22 or newer and npm.

```bash
npm ci
cp .env.example .env
```

Open two terminals from the project directory:

```bash
npm run dev:server
```

```bash
npm run dev
```

Open <http://localhost:3000>. The frontend reads `VITE_API_BASE_URL` from `.env`; the example points it at the local API on port 4000. Check the API at <http://localhost:4000/api/health>.

Demo customer sign-in:

- Email: `senthil@example.com`
- Password: `123456`

## Validation

```bash
npm test       # API smoke test (starts and stops a local demo server)
npm run lint   # TypeScript check
npm run build  # Production frontend build
```

`npm run clean` removes only the generated `dist/` directory; it does not remove source files.

## Deploy

- **Frontend:** the GitHub Actions workflow builds and deploys `main` to GitHub Pages. Configure the repository's Pages settings to use GitHub Actions.
- **Demo API:** `render.yaml` describes a Render web service. Deploying requires connecting the repository to an account on the hosting provider. After deployment, set `VITE_API_BASE_URL` to the API's public URL in the frontend build environment and rebuild the frontend.

The API's JSON file is not durable production storage on ephemeral hosting. Use a managed database and implement authentication, authorization, password hashing, input/rate limiting, and restricted CORS before exposing any real data.
