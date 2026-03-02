function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  formatCurrency,
  subtotal,
  shipping,
  total,
  onUpdateQuantity,
}) {
  return (
    <>
      <aside className={isOpen ? 'cart open' : 'cart'} aria-label="Shopping cart">
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button type="button" onClick={onClose}>
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
                  <button type="button" onClick={() => onUpdateQuantity(item.id, -1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => onUpdateQuantity(item.id, 1)}>
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

      {isOpen && <button className="backdrop" type="button" onClick={onClose} />}
    </>
  );
}

export default CartDrawer;
