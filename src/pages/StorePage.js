import { useMemo, useState } from 'react';
import '../App.css';
import PRODUCTS from '../products.json';
import TopBar from '../components/store/TopBar';
import HeroSection from '../components/store/HeroSection';
import ProductToolbar from '../components/store/ProductToolbar';
import ProductGrid from '../components/store/ProductGrid';
import BenefitsSection from '../components/store/BenefitsSection';
import CartDrawer from '../components/store/CartDrawer';
import { formatPhp } from '../utils/currency';

const CATEGORIES = ['All', ...new Set(PRODUCTS.map((item) => item.category))];

function StorePage() {
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
      <TopBar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />
      <HeroSection />

      <main className="content" id="shop">
        <ProductToolbar
          search={search}
          onSearchChange={setSearch}
          categories={CATEGORIES}
          category={category}
          onCategoryChange={setCategory}
          sort={sort}
          onSortChange={setSort}
        />
        <ProductGrid
          products={visibleProducts}
          formatCurrency={formatPhp}
          onAddToCart={addToCart}
        />
        <BenefitsSection />
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        formatCurrency={formatPhp}
        subtotal={subtotal}
        shipping={shipping}
        total={total}
        onUpdateQuantity={updateQuantity}
      />
    </div>
  );
}

export default StorePage;
