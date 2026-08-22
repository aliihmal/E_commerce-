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

export default function SetProductOnSalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [productId, setProductId] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
        setLoadError('Could not load products');
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const selectedProduct = products.find((p) => p.id === productId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!productId) {
      setError('Select a product first.');
      return;
    }
    if (!discountPercent || Number(discountPercent) <= 0) {
      setError('Enter a discount percent greater than 0.');
      return;
    }

    setSubmitting(true);

    const payload = {
      productId,
      discountPercent: Number(discountPercent),
    };

    try {
      const response = await fetch('http://localhost:3000/product/setProductOnSale', {
        method: 'put',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to set product on sale');

      setSuccess(`"${selectedProduct?.name}" is now on sale at ${discountPercent}% off.`);
      setProductId('');
      setDiscountPercent('');
    } catch (err) {
      setError('Could not set this product on sale — try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-wrap">
      <div className="page-hero">
        <Reveal>
          <div className="eyebrow">Owner Tools</div>
          <h1 className="display">Set Product On Sale</h1>
          <p>Pick a product and set the discount.</p>
        </Reveal>
      </div>

      <section className="block" style={{ paddingTop: 40, maxWidth: 560, marginInline: 'auto' }}>
        <Reveal>
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Product</label>

              {loadingProducts ? (
                <div style={{ fontSize: '0.85rem', color: 'var(--grey)' }}>Loading products…</div>
              ) : loadError ? (
                <div className="empty-state">{loadError}</div>
              ) : (
                <select value={productId} onChange={(e) => setProductId(e.target.value)} required>
                  <option value="">Choose a product…</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ${p.price}
                      {p.onSale ? ` (currently -${p.discountPercent}%)` : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {selectedProduct && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 14px',
                  border: '1px solid var(--line)',
                  borderRadius: 2,
                  marginBottom: 20,
                }}
              >
                {selectedProduct.imgSrc && (
                  <img
                    src={selectedProduct.imgSrc}
                    alt={selectedProduct.name}
                    style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 2 }}
                  />
                )}
                <div>
                  <div style={{ fontSize: '0.9rem' }}>{selectedProduct.name}</div>
                  <div className="mono" style={{ fontSize: '0.78rem', color: 'var(--grey)' }}>
                    ${selectedProduct.price}
                  </div>
                </div>
              </div>
            )}

            <div className="form-field">
              <label>Discount Percent</label>
              <input
                type="number"
                min="1"
                max="90"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                placeholder="e.g. 20"
                required
              />
            </div>

            <button
              className="btn btn-primary"
              type="submit"
              style={{ width: '100%' }}
              disabled={submitting || loadingProducts}
            >
              {submitting ? 'Saving…' : 'Set On Sale'}
            </button>
          </form>
        </Reveal>
      </section>
    </div>
  );
}