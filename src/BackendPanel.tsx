import { useEffect, useMemo, useState } from 'react';
import { api, getSavedUser, saveUser, type ApiOrder, type ApiUser, type CartItem, type Product } from './api/client';

const money = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export default function BackendPanel() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [user, setUser] = useState<ApiUser | null>(() => getSavedUser());
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  useEffect(() => {
    api.health()
      .then(() => setStatus('online'))
      .catch(() => setStatus('offline'));
    api.products().then(({ items }) => setProducts(items)).catch(() => setStatus('offline'));
  }, []);

  useEffect(() => {
    if (!user) return;
    api.cart(user.id).then(({ cart: items }) => setCart(items)).catch((reason) => setError(reason.message));
    api.orders(user.id).then(({ orders: items }) => setOrders(items)).catch(() => undefined);
  }, [user?.id]);

  const reloadData = async () => {
    if (!user) return;
    const [cartResponse, orderResponse] = await Promise.all([api.cart(user.id), api.orders(user.id)]);
    setCart(cartResponse.cart);
    setOrders(orderResponse.orders);
  };

  const addProduct = async (product: Product) => {
    if (!user) {
      setError('Sign in to add items to your server-side cart.');
      return;
    }
    setError('');
    try {
      const result = await api.addToCart(user.id, product.id);
      setCart(result.cart);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not add product.');
    }
  };

  const signIn = async () => {
    setBusy(true);
    setError('');
    try {
      const result = await api.login('senthil@example.com', '123456');
      saveUser(result.user);
      setUser(result.user);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Sign in failed.');
    } finally {
      setBusy(false);
    }
  };

  const changeQuantity = async (item: CartItem, quantity: number) => {
    if (!user) return;
    try {
      const result = await api.updateCart(user.id, item.productId, Math.max(0, quantity));
      setCart(result.cart);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not update cart.');
    }
  };

  const checkout = async () => {
    if (!user || cart.length === 0) return;
    setBusy(true);
    setError('');
    try {
      const result = await api.placeOrder({
        userId: user.id,
        items: cart,
        address: { district: user.district || 'Nagapattinam' },
        paymentMethod: 'Cash on Delivery',
      });
      setCart([]);
      setOrders((previous) => [result.order, ...previous]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Checkout failed.');
    } finally {
      setBusy(false);
    }
  };

  const visibleProducts = products.filter((product) =>
    `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-4 right-4 z-[100] flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-3 text-sm font-bold text-white shadow-xl hover:bg-emerald-600"
        aria-expanded={open}
      >
        <span className={`h-2.5 w-2.5 rounded-full ${status === 'online' ? 'bg-green-300' : status === 'offline' ? 'bg-red-300' : 'bg-amber-300'}`} />
        Backend {status === 'online' ? 'Online' : status === 'offline' ? 'Offline' : 'Checking'}
        {cart.length > 0 && <span className="rounded-full bg-white px-2 py-0.5 text-xs text-emerald-900">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>}
      </button>
      {open && (
        <aside className="fixed inset-y-0 right-0 z-[99] flex w-full max-w-md flex-col border-l border-emerald-900/20 bg-white text-slate-900 shadow-2xl">
          <header className="flex items-center justify-between bg-[#0c1f17] px-5 py-4 text-white">
            <div>
              <h2 className="text-lg font-extrabold">Live Grocery Store</h2>
              <p className="text-xs text-emerald-200">Connected to VeriGrocery API</p>
            </div>
            <button type="button" className="rounded-lg px-3 py-1 text-xl hover:bg-white/10" onClick={() => setOpen(false)} aria-label="Close store">×</button>
          </header>
          <div className="flex items-center justify-between border-b px-5 py-3 text-sm">
            {user ? <span>Signed in as <b>{user.name}</b></span> : <span>Demo account required for cart and checkout</span>}
            {!user && <button type="button" disabled={busy || status !== 'online'} onClick={signIn} className="rounded-lg bg-emerald-700 px-3 py-2 font-semibold text-white disabled:opacity-50">{busy ? 'Signing in…' : 'Demo sign in'}</button>}
            {user && <button type="button" onClick={() => { saveUser(null); setUser(null); setCart([]); }} className="text-emerald-800 underline">Sign out</button>}
          </div>
          {error && <div role="alert" className="mx-4 mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</div>}
          <div className="overflow-y-auto p-4">
            <div className="mb-4">
              <label htmlFor="backend-product-search" className="sr-only">Search groceries</label>
              <input id="backend-product-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products…" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600" />
            </div>
            <section aria-label="Products" className="space-y-3">
              {visibleProducts.map((product) => (
                <article key={product.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                  <img src={product.image || '/assets/image-placeholder.svg'} alt="" className="h-16 w-16 rounded-lg bg-emerald-50 object-cover" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold">{product.name}</h3>
                    <p className="text-xs text-slate-500">{product.brand} · {product.category}</p>
                    <p className="mt-1 font-bold text-emerald-800">{money(product.price)}</p>
                  </div>
                  <button type="button" onClick={() => addProduct(product)} className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-600">Add</button>
                </article>
              ))}
              {visibleProducts.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No products match your search.</p>}
            </section>
            <section className="mt-6 border-t pt-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-extrabold">Your cart</h3>
                <span className="text-sm text-slate-500">{cart.reduce((sum, item) => sum + item.quantity, 0)} items</span>
              </div>
              {cart.length === 0 ? <p className="text-sm text-slate-500">Cart is empty. Sign in, then add a product.</p> : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3 text-sm">
                      <div className="min-w-0 flex-1"><p className="truncate font-semibold">{item.name}</p><p className="text-slate-500">{money(item.price)} each</p></div>
                      <button type="button" aria-label={`Decrease ${item.name}`} onClick={() => changeQuantity(item, item.quantity - 1)} className="h-8 w-8 rounded border">−</button>
                      <span className="w-5 text-center">{item.quantity}</span>
                      <button type="button" aria-label={`Increase ${item.name}`} onClick={() => changeQuantity(item, item.quantity + 1)} className="h-8 w-8 rounded border">+</button>
                    </div>
                  ))}
                  <div className="flex justify-between border-t pt-3 font-bold"><span>Subtotal</span><span>{money(total)}</span></div>
                  <button type="button" disabled={busy || !user} onClick={checkout} className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-bold text-white hover:bg-emerald-600 disabled:opacity-50">{busy ? 'Placing order…' : 'Place order · Cash on Delivery'}</button>
                </div>
              )}
            </section>
            <section className="mt-6 border-t pt-5">
              <h3 className="mb-3 font-extrabold">Recent orders</h3>
              {orders.length === 0 ? <p className="text-sm text-slate-500">No orders yet.</p> : orders.slice(0, 5).map((order) => (
                <div key={order.id} className="mb-2 flex justify-between rounded-lg bg-slate-50 p-3 text-sm"><span><b>{order.id}</b><br /><span className="text-xs text-slate-500">{order.status}</span></span><b>{money(order.total)}</b></div>
              ))}
            </section>
          </div>
          {status === 'offline' && <p className="border-t bg-amber-50 p-3 text-center text-xs text-amber-900">Backend unavailable. Start it with <code>npm run start</code> (port 4000).</p>}
        </aside>
      )}
    </>
  );
}
