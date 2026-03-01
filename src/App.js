import './App.css';
import { useMemo, useState } from 'react';

const PRODUCTS = [
  {
    id: 1,
    name: 'AeroPulse Running Shoes',
    category: 'Shoes',
    price: 129,
    rating: 4.8,
    description: 'Ultra-light mesh runners for all-day comfort and training support.',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Nomad Urban Backpack',
    category: 'Accessories',
    price: 89,
    rating: 4.7,
    description: 'Minimal everyday backpack with laptop sleeve and waterproof finish.',
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Terra Ceramic Mug Set',
    category: 'Home',
    price: 42,
    rating: 4.6,
    description: 'Hand-finished ceramic mugs for coffee, tea, and cozy mornings.',
    image:
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    name: 'Luma Desk Lamp',
    category: 'Home',
    price: 74,
    rating: 4.5,
    description: 'Dimmable LED desk lamp with warm and cool temperature modes.',
    image:
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    name: 'Stride Performance Hoodie',
    category: 'Apparel',
    price: 68,
    rating: 4.9,
    description: 'Soft, breathable hoodie designed for workouts and city commutes.',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    name: 'Orbit Smart Watch',
    category: 'Electronics',
    price: 199,
    rating: 4.4,
    description: 'Track fitness, sleep, and notifications with a 7-day battery life.',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  },
];

const CATEGORIES = ['All', ...new Set(PRODUCTS.map((item) => item.category))];

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);

function App() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    let next = PRODUCTS.filter((item) => {
      const categoryMatch = category === 'All' || item.category === category;
      const searchMatch =
        !normalizedSearch ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.description.toLowerCase().includes(normalizedSearch);
      return categoryMatch && searchMatch;
    });

    if (sort === 'low-high') next = [...next].sort((a, b) => a.price - b.price);
    if (sort === 'high-low') next = [...next].sort((a, b) => b.price - a.price);
    if (sort === 'top-rated') next = [...next].sort((a, b) => b.rating - a.rating);

    return next;
  }, [category, search, sort]);

  const cartItems = useMemo(
    () =>
      PRODUCTS.filter((product) => cart[product.id]).map((product) => ({
        ...product,
        quantity: cart[product.id],
      })),
    [cart]
  );

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cartCount > 0 ? 12 : 0;
  const total = subtotal + shipping;

  const addToCart = (id) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) => {
      const nextQuantity = (prev[id] || 0) + delta;
      if (nextQuantity <= 0) {
        const { [id]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: nextQuantity };
    });
  };

  return (
    <div className="storefront">
      <header className="topbar">
        <div className="brand">KenMarket</div>
        <nav className="navlinks">
          <a href="#shop">Shop</a>
          <a href="#collections">Collections</a>
          <a href="#benefits">Benefits</a>
        </nav>
        <button className="cart-button" onClick={() => setIsCartOpen(true)} type="button">
          Cart ({cartCount})
        </button>
      </header>

      <section className="hero" id="collections">
        <div>
          <p className="eyebrow">New Season Drop</p>
          <h1>Modern Essentials for Work, Home, and Everyday Motion</h1>
          <p>
            Shop curated products with premium quality, fast shipping, and clean design
            made for daily life.
          </p>
          <a href="#shop" className="cta">
            Start Shopping
          </a>
        </div>
      </section>

      <main className="content" id="shop">
        <section className="toolbar">
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="chips">
            {CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                className={item === category ? 'chip active' : 'chip'}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="top-rated">Top Rated</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </section>

        <section className="product-grid">
          {visibleProducts.map((product) => (
            <article key={product.id} className="product-card">
              <img src={product.image} alt={product.name} loading="lazy" />
              <div className="card-body">
                <div className="meta">
                  <span>{product.category}</span>
                  <span>{product.rating} stars</span>
                </div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="card-footer">
                  <strong>{formatCurrency(product.price)}</strong>
                  <button type="button" onClick={() => addToCart(product.id)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="benefits" id="benefits">
          <div>
            <h3>48-hour Delivery</h3>
            <p>Fast, trackable shipping across major cities and regions.</p>
          </div>
          <div>
            <h3>Secure Payments</h3>
            <p>Protected checkout with trusted providers and encryption.</p>
          </div>
          <div>
            <h3>14-Day Returns</h3>
            <p>Easy returns with clear policy and responsive support.</p>
          </div>
        </section>
      </main>

      <aside className={isCartOpen ? 'cart open' : 'cart'} aria-label="Shopping cart">
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button type="button" onClick={() => setIsCartOpen(false)}>
            Close
          </button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <p className="empty-state">Your cart is empty. Add products to continue.</p>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <div>
                  <h4>{item.name}</h4>
                  <p>
                    {formatCurrency(item.price)} x {item.quantity}
                  </p>
                </div>
                <div className="qty-controls">
                  <button type="button" onClick={() => updateQuantity(item.id, -1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.id, 1)}>
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-summary">
          <div>
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div>
            <span>Shipping</span>
            <span>{formatCurrency(shipping)}</span>
          </div>
          <div className="total">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <button className="checkout" type="button" disabled={!cartItems.length}>
            Proceed to Checkout
          </button>
        </div>
      </aside>

      {isCartOpen && <button className="backdrop" type="button" onClick={() => setIsCartOpen(false)} />}
    </div>
  );
}

export default App;
