function ProductGrid({ products, formatCurrency, onAddToCart }) {
  return (
    <section className="product-grid">
      {products.map((product) => (
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
              <button type="button" onClick={() => onAddToCart(product.id)}>
                Add to Cart
              </button>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

export default ProductGrid;
