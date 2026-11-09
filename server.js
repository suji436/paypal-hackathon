import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT || 4000);
const DATA_DIR = path.join(__dirname, 'data');
const STORAGE_PATH = path.join(DATA_DIR, 'store.json');

app.use(express.json({ limit: '2mb' }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

const defaultStore = {
  users: [
    {
      id: 'u-demo-001',
      name: 'Senthil Nathan',
      email: 'senthil@example.com',
      password: '123456',
      role: 'customer',
      district: 'Nagapattinam',
      cart: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'u-demo-002',
      name: 'K. Sundaram',
      email: 'sundaram@example.com',
      password: '123456',
      role: 'merchant',
      district: 'Nagapattinam',
      cart: [],
      createdAt: new Date().toISOString(),
    },
  ],
  products: [
    { id: 'p-001', name: 'Aachi Sambar Powder 500g', brand: 'Aachi Masala Foods', category: 'Spices', price: 95, originalPrice: 110, unit: '500g', stock: 42, rating: 4.8, district: 'Nagapattinam', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=700&q=80' },
    { id: 'p-002', name: 'Ponni Boiled Rice 25kg', brand: 'Delta Farmers Mill', category: 'Rice', price: 1350, originalPrice: 1450, unit: '25kg', stock: 18, rating: 4.9, district: 'Thanjavur', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=700&q=80' },
    { id: 'p-003', name: 'Idhayam Sesame Oil 1L', brand: 'V.V.V. & Sons', category: 'Oils', price: 350, originalPrice: 380, unit: '1L', stock: 34, rating: 4.7, district: 'Mayiladuthurai', image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=700&q=80' },
    { id: 'p-004', name: 'Fresh Red Onion 1kg', brand: 'Cauvery Valley Farms', category: 'Vegetables', price: 52, originalPrice: 68, unit: '1kg', stock: 60, rating: 4.6, district: 'Nagapattinam', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=80' },
    { id: 'p-005', name: 'Tamil Nadu Mango 2kg', brand: 'Mango Valley Co-op', category: 'Fruits', price: 180, originalPrice: 210, unit: '2kg', stock: 25, rating: 4.8, district: 'Tirunelveli', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=700&q=80' },
    { id: 'p-006', name: 'A2 Cow Milk 1L', brand: 'Kaviri Dairy', category: 'Dairy', price: 68, originalPrice: 80, unit: '1L', stock: 52, rating: 4.7, district: 'Thanjavur', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=700&q=80' },
    { id: 'p-007', name: 'Coconut Oil 500ml', brand: 'Meenakshi Naturals', category: 'Oils', price: 220, originalPrice: 250, unit: '500ml', stock: 31, rating: 4.5, district: 'Kanyakumari', image: 'https://images.unsplash.com/photo-1604908563705-49949b9d7d9f?auto=format&fit=crop&w=700&q=80' },
    { id: 'p-008', name: 'Premium Brinjal 500g', brand: 'Green Harvest', category: 'Vegetables', price: 42, originalPrice: 55, unit: '500g', stock: 48, rating: 4.4, district: 'Cuddalore', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=700&q=80' },
    { id: 'p-009', name: 'Turmeric Powder 250g', brand: 'Sri Venkateswara', category: 'Spices', price: 110, originalPrice: 128, unit: '250g', stock: 38, rating: 4.6, district: 'Erode', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80' },
    { id: 'p-010', name: 'Groundnut Chikki 200g', brand: 'Kandha Foods', category: 'Snacks', price: 70, originalPrice: 90, unit: '200g', stock: 44, rating: 4.8, district: 'Madurai', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80' },
    { id: 'p-011', name: 'Organic Red Gram 1kg', brand: 'Cauvery Delta Agri', category: 'Grains', price: 140, originalPrice: 165, unit: '1kg', stock: 26, rating: 4.9, district: 'Tiruvarur', image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=700&q=80' },
    { id: 'p-012', name: 'Fresh Banana Bunch', brand: 'Pillai Farms', category: 'Fruits', price: 88, originalPrice: 100, unit: '1 bunch', stock: 33, rating: 4.5, district: 'Coimbatore', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=700&q=80' },
  ],
  orders: [],
};

async function ensureStorage() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(STORAGE_PATH);
  } catch {
    await fs.writeFile(STORAGE_PATH, JSON.stringify(defaultStore, null, 2));
  }
}

async function readStore() {
  await ensureStorage();
  const raw = await fs.readFile(STORAGE_PATH, 'utf8');
  return JSON.parse(raw || '{}');
}

async function writeStore(data) {
  await ensureStorage();
  await fs.writeFile(STORAGE_PATH, JSON.stringify(data, null, 2));
}

function safeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    district: user.district,
    cart: user.cart || [],
    createdAt: user.createdAt,
  };
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'VeriGrocery backend', timestamp: new Date().toISOString() });
});

app.get('/api/products', async (req, res) => {
  try {
    const { category, search } = req.query;
    const store = await readStore();
    let products = [...(store.products || [])];

    if (category) {
      products = products.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
    }

    if (search) {
      const q = String(search).toLowerCase();
      products = products.filter((p) => [p.name, p.brand, p.category].some((value) => String(value).toLowerCase().includes(q)));
    }

    res.json({ items: products, total: products.length });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch products', error: String(error) });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const store = await readStore();
    const product = (store.products || []).find((item) => item.id === req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch product', error: String(error) });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const store = await readStore();
    const user = (store.users || []).find((item) => item.email.toLowerCase() === String(email).toLowerCase() && item.password === String(password));

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      user: safeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: String(error) });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, district = 'Nagapattinam', role = 'customer' } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const store = await readStore();
    const exists = (store.users || []).some((user) => user.email.toLowerCase() === String(email).toLowerCase());
    if (exists) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name,
      email,
      password,
      role,
      district,
      cart: [],
      createdAt: new Date().toISOString(),
    };

    store.users = [...(store.users || []), newUser];
    await writeStore(store);

    res.status(201).json({
      message: 'Registration successful',
      user: safeUser(newUser),
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: String(error) });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const store = await readStore();
    const user = (store.users || []).find((item) => item.id === req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch user', error: String(error) });
  }
});

app.get('/api/cart/:userId', async (req, res) => {
  try {
    const store = await readStore();
    const user = (store.users || []).find((item) => item.id === req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ cart: user.cart || [] });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch cart', error: String(error) });
  }
});

app.post('/api/cart/:userId/add', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body || {};
    if (!productId) return res.status(400).json({ message: 'productId is required' });

    const store = await readStore();
    const user = (store.users || []).find((item) => item.id === req.params.userId);
    const product = (store.products || []).find((item) => item.id === productId);

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const existingIndex = (user.cart || []).findIndex((item) => item.productId === productId);
    if (existingIndex >= 0) {
      user.cart[existingIndex].quantity += Number(quantity) || 1;
    } else {
      user.cart.push({ productId, quantity: Number(quantity) || 1, price: product.price, name: product.name, brand: product.brand });
    }

    await writeStore(store);
    res.status(201).json({ message: 'Product added to cart', cart: user.cart || [] });
  } catch (error) {
    res.status(500).json({ message: 'Unable to add to cart', error: String(error) });
  }
});

app.put('/api/cart/:userId/update', async (req, res) => {
  try {
    const { productId, quantity } = req.body || {};
    if (!productId || Number(quantity) < 0) {
      return res.status(400).json({ message: 'Valid productId and quantity are required' });
    }

    const store = await readStore();
    const user = (store.users || []).find((item) => item.id === req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const idx = (user.cart || []).findIndex((item) => item.productId === productId);
    if (idx === -1) return res.status(404).json({ message: 'Item not in cart' });

    if (Number(quantity) === 0) {
      user.cart.splice(idx, 1);
    } else {
      user.cart[idx].quantity = Number(quantity);
    }

    await writeStore(store);
    res.json({ message: 'Cart updated', cart: user.cart || [] });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update cart', error: String(error) });
  }
});

app.delete('/api/cart/:userId/remove/:productId', async (req, res) => {
  try {
    const store = await readStore();
    const user = (store.users || []).find((item) => item.id === req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.cart = (user.cart || []).filter((item) => item.productId !== req.params.productId);
    await writeStore(store);
    res.json({ message: 'Item removed from cart', cart: user.cart || [] });
  } catch (error) {
    res.status(500).json({ message: 'Unable to remove item', error: String(error) });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { userId, items, address = {}, paymentMethod = 'Cash on Delivery' } = req.body || {};
    if (!userId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Valid userId and items are required' });
    }

    const store = await readStore();
    const user = (store.users || []).find((item) => item.id === userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const orderItems = items.map((item) => {
      const product = (store.products || []).find((entry) => entry.id === item.productId);
      return {
        productId: item.productId,
        name: product?.name || item.name,
        quantity: Number(item.quantity) || 1,
        price: Number(product?.price || item.price || 0),
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 500 ? 0 : 30;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + deliveryFee + tax;

    const order = {
      id: `VG-${Date.now()}`,
      userId,
      userName: user.name,
      items: orderItems,
      address,
      paymentMethod,
      subtotal,
      deliveryFee,
      tax,
      total,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    };

    store.orders = [order, ...(store.orders || [])];
    user.cart = [];
    await writeStore(store);

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Unable to place order', error: String(error) });
  }
});

app.get('/api/orders/:userId', async (req, res) => {
  try {
    const store = await readStore();
    const userOrders = (store.orders || []).filter((order) => order.userId === req.params.userId);
    res.json({ orders: userOrders });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch orders', error: String(error) });
  }
});

app.get('/api/dashboard/:userId', async (req, res) => {
  try {
    const store = await readStore();
    const user = (store.users || []).find((item) => item.id === req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const orders = (store.orders || []).filter((order) => order.userId === req.params.userId);
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const cartCount = (user.cart || []).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

    res.json({
      user: safeUser(user),
      summary: {
        totalOrders: orders.length,
        totalSpent,
        cartCount,
        savedProducts: (user.cart || []).length,
      },
      recentOrders: orders.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load dashboard', error: String(error) });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', path: req.originalUrl });
});

ensureStorage().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VeriGrocery backend listening on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to initialize backend storage:', error);
  process.exit(1);
});

export default app;
