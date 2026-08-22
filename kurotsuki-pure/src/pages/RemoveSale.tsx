import { useEffect, useState } from 'react';
import Reveal from '../components/Reveal';

interface Product {
  id: string;
  name: string;
  price: number;
  onSale: boolean;
  discountPercent: number | null;
  imgSrc: string;
}

export default function RemoveFromSalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOnSaleProducts();
  }, []);

  async function fetchOnSaleProducts() {
    setLoading(true);
    setLoadError('');
    try {
      const response = await fetch('http://localhost:3000/product/getProdOnSale', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to load products on sale');
      const data = await response.json();
      setProducts(data.products);
    } catch (err) {
      setLoadError('Could not load products on sale');
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(id: string, name: string) {
    if (!confirm(`Remove "${name}" from sale?`)) return;

    setRemovingId(id);
    setError('');

    try {
      const response = await fetch(`http://localhost:3000/product/RemoveFromSale/${id}`, {
        method: 'put',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to remove from sale');
      }

      // Product is no longer on sale, so it drops out of this list entirely
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : `Could not remove "${name}" from sale`);
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="page-wrap">
      <div className="page-hero">
        <Reveal>
          <div className="eyebrow">Owner Tools</div>
          <h1 className="display">Remove From Sale</h1>
          <p>Pull a product's discount and return it to full price.</p>
        </Reveal>
      </div>

      <section className="block" style={{ paddingTop: 40 }}>
        {error && <div className="form-error">{error}</div>}

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="empty-cell">Loading…</td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td colSpan={5} className="empty-cell">{loadError}</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-cell">No products are currently on sale.</td>
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
                    <td className="mono" style={{ color: 'var(--crimson)' }}>-{p.discountPercent}%</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        disabled={removingId === p.id}
                        onClick={() => handleRemove(p.id, p.name)}
                      >
                        {removingId === p.id ? 'Removing…' : 'Remove from Sale'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}