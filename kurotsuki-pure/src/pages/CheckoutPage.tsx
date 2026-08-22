import { useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', location: '' });
  const [placed, setPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // No backend here — this just simulates placing an order in the UI.
    setOrderNumber(`KTS-${Math.floor(100000 + Math.random() * 900000)}`);
    setPlaced(true);
    clear();
  }

  if (placed) {
    return (
      <div className="page-wrap">
        <div className="page-hero">
          <Reveal>
            <div className="eyebrow">Order Received</div>
            <h1 className="display">Thank You</h1>
            <p>
              Order <span className="mono">{orderNumber}</span> has been placed. This is a demo checkout —
              no order was actually sent anywhere.
            </p>
            <div style={{ marginTop: 24 }}>
              <Link to="/products" className="btn btn-outline">Continue Shopping</Link>
            </div>
          </Reveal>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-wrap">
        <div className="page-hero">
          <h1 className="display">Checkout</h1>
          <p>Your cart is empty — add something first.</p>
          <div style={{ marginTop: 24 }}>
            <Link to="/products" className="btn btn-outline">Browse Products</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <section className="block" style={{ paddingTop: 60 }}>
        <Reveal>
          <div className="section-head">
            <h2 className="display">Checkout</h2>
            <div className="tag"><span className="jp">確認</span>Confirm your order</div>
          </div>
        </Reveal>

        <div className="checkout-grid">
          <Reveal>
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label>Full Name</label>
                <input value={form.fullName} onChange={(e) => update('fullName', e.target.value)} required />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>Phone Number</label>
                  <input value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
                </div>
                <div className="form-field">
                  <label>Location</label>
                  <input value={form.location} onChange={(e) => update('location', e.target.value)} required />
                </div>
              </div>
              <p style={{ color: 'var(--grey)', fontSize: '0.82rem', marginBottom: 20 }}>
                This is a static front-end demo — no order is actually submitted anywhere.
              </p>
              <button className="btn btn-primary" style={{ width: '100%' }} type="submit">
                Place Order
              </button>
            </form>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="summary-box">
              <h4 style={{ marginBottom: 16 }}>Order Summary</h4>
              {items.map((item) => (
                <div className="summary-row" key={item.id}>
                  <span>{item.name} ({item.size}) × {item.quantity}</span>
                  <span className="mono">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="summary-row" style={{ fontWeight: 600, fontSize: '1.05rem' }}>
                <span>Total</span>
                <span className="mono">${total.toFixed(2)}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
