import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  imgSrc?: string;
}

export default function DeleteProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/product/getAllProduct', {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to load products');
        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        setError('Could not load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  async function handleDelete(id: string, name: string) {
  if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

  setDeletingId(id);
  try {
    const response = await fetch(`http://localhost:3000/product/deleteProd/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Delete failed');

    setProducts((prev) => prev.filter((p) => p.id !== id));
  } catch (err) {
    setError(`Could not delete "${name}"`);
  } finally {
    setDeletingId(null);
  }
}

  return (
    <div>
      <div className="owner-header">
        <h1 className="display">Delete Product</h1>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="empty-cell">Loading…</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-cell">No products found.</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id}>
                  <td style={{ width: 60 }}>
                    {p.imgSrc && (
                      <img
                        src={p.imgSrc}
                        alt={p.name}
                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 2 }}
                      />
                    )}
                  </td>
                  <td>{p.name}</td>
                  <td className="mono">${p.price}</td>
                  <td className="mono">{p.stock}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      disabled={deletingId === p.id}
                      onClick={() => handleDelete(p.id, p.name)}
                    >
                      {deletingId === p.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}