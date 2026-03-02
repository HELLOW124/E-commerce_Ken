function TopBar({ cartCount, onOpenCart }) {
  return (
    <header className="topbar">
      <div className="brand">KenMarket</div>
      <nav className="navlinks">
        <a href="#shop">Shop</a>
        <a href="#collections">Collections</a>
        <a href="#benefits">Benefits</a>
      </nav>
      <button className="cart-button" onClick={onOpenCart} type="button">
        Cart ({cartCount})
      </button>
    </header>
  );
}

export default TopBar;
