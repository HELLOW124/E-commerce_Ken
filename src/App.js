import './App.css';
import { useMemo, useState } from 'react';
import PRODUCTS from './products.json';

const CATEGORIES = ['All', ...new Set(PRODUCTS.map((item) => item.category))];

const formatCurrency = (amount) =>
  `Php ${new Intl.NumberFormat('en-PH', {
    maximumFractionDigits: 0,
  }).format(amount)}`;

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
