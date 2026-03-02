function ProductToolbar({
  search,
  onSearchChange,
  categories,
  category,
  onCategoryChange,
  sort,
  onSortChange,
}) {
  return (
    <section className="toolbar">
      <input
        type="search"
        placeholder="Search products..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <div className="chips">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            className={item === category ? 'chip active' : 'chip'}
            onClick={() => onCategoryChange(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <select value={sort} onChange={(event) => onSortChange(event.target.value)}>
        <option value="featured">Featured</option>
        <option value="top-rated">Top Rated</option>
        <option value="low-high">Price: Low to High</option>
        <option value="high-low">Price: High to Low</option>
      </select>
    </section>
  );
}

export default ProductToolbar;
