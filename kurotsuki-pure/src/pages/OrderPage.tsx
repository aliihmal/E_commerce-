import { Fragment, useEffect, useState } from 'react';
import Reveal from '../components/Reveal';

// =========================
// Raw shapes from the API
// =========================

interface OrderApi {
  id: string;
  userId: string;
  status?: string;
  createdAt?: string;
}

interface CartItemApi {
  id: string;
  order_id: string;
  product_id: string;
  size: string;
  quantity: number;
}

interface ProductApi {
  id: string;
  name: string;
  price: number;
  salePrice: number | null;
  onSale: boolean;
  imgSrc: string;
}

interface ProductResponse {
  message: string;
  product: ProductApi;
}

interface UserApi {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
}

interface UserResponse {
  message: string;
  user: UserApi;
}

// =========================
// Shape used for rendering
// =========================

interface DisplayOrderItem {
  id: string;
  productId: string;
  size: string;
  quantity: number;
  name: string;
  unitPrice: number;
  imgSrc: string;
}

interface DisplayOrder {
  id: string;
  userId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerLocation?: string;
  status?: string;
  createdAt?: string;
  items: DisplayOrderItem[];
  total: number;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<DisplayOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    setError('');

    try {
      const ordersResponse = await fetch(`${import.meta.env.VITE_API_URL}/order/getAll`, {
        credentials: 'include',
      });

      if (!ordersResponse.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await ordersResponse.json();
      const orderList: OrderApi[] = data.orders;

      const result = await Promise.all(
        orderList.map(async (order) => {
          const userResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/user/getById/${order.userId}`,
            { credentials: 'include' }
          );

          if (!userResponse.ok) {
            throw new Error(`Failed to fetch user ${order.userId}`);
          }

          const userData: UserResponse = await userResponse.json();
          const user = userData.user;

          const cartResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/cartOrder/getByOrderId/${order.id}`,
            { credentials: 'include' }
          );

          if (!cartResponse.ok) {
            throw new Error(`Failed to fetch cart items for order ${order.id}`);
          }

          const cartData = await cartResponse.json();
          console.log(cartData.message);
          const cartItems: CartItemApi[] = cartData.carts;

          const items = await Promise.all(
            cartItems.map(async (cartItem) => {
              const productResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/product/get/${cartItem.product_id}`,
                { credentials: 'include' }
              );

              if (!productResponse.ok) {
                throw new Error(`Failed to fetch product ${cartItem.product_id}`);
              }

              const productData: ProductResponse = await productResponse.json();
              const product = productData.product;

              const unitPrice =
                product.onSale && product.salePrice !== null
                  ? product.salePrice
                  : product.price;

              return {
                id: cartItem.id,
                productId: cartItem.product_id,
                size: cartItem.size,
                quantity: cartItem.quantity,
                name: product.name,
                unitPrice,
                imgSrc: product.imgSrc,
              };
            })
          );

          const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

          return {
            id: order.id,
            userId: order.userId,
            customerName: user.name,
            customerEmail: user.email,
            customerPhone: user.phone,
            customerLocation: user.location,
            status: order.status,
            createdAt: order.createdAt,
            items,
            total,
          };
        })
      );

      setOrders(result);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Could not load orders.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteOrder(id: string) {
    if (!confirm(`Delete order #${id}? This cannot be undone.`)) return;

    setDeletingId(id);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/order/deleteOrder/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || data.error || 'Failed to delete order');
      }

      setOrders((prev) => prev.filter((o) => o.id !== id));
      if (expanded === id) setExpanded(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Could not delete order #${id}`);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="page-wrap">
      <div className="page-hero">
        <Reveal>
          <div className="eyebrow">Owner Tools</div>
          <h1 className="display">Orders</h1>
          <p>Every order placed, with its items and customer details.</p>
        </Reveal>
      </div>

      <section className="block" style={{ paddingTop: 40 }}>
        {error && <div className="form-error">{error}</div>}

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="empty-cell">Loading orders…</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-cell">No orders yet.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <Fragment key={order.id}>
                    <tr>
                      <td className="mono">#{order.id}</td>
                      <td>{order.customerName || '—'}</td>
                      <td>
                        <div>{order.customerEmail}</div>
                        <div style={{ color: 'var(--grey)', fontSize: '0.78rem' }}>
                          {order.customerPhone}
                        </div>
                        <div style={{ color: 'var(--grey)', fontSize: '0.78rem' }}>
                          {order.customerLocation}
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${order.status || 'pending'}`}>
                          {order.status || 'pending'}
                        </span>
                      </td>
                      <td className="mono">${order.total.toFixed(2)}</td>
                      <td>
                        <div className="action-row">
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() =>
                              setExpanded(expanded === order.id ? null : order.id)
                            }
                          >
                            {expanded === order.id ? 'Hide' : 'Items'}
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            disabled={deletingId === order.id}
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            {deletingId === order.id ? 'Deleting…' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expanded === order.id && (
                      <tr>
                        <td colSpan={6} style={{ background: 'var(--panel-2)' }}>
                          {order.items.length === 0 ? (
                            <div style={{ color: 'var(--grey)', padding: '8px 0' }}>
                              No items found for this order.
                            </div>
                          ) : (
                            order.items.map((item) => (
                              <div
                                key={item.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 14,
                                  padding: '10px 0',
                                }}
                              >
                                {item.imgSrc && (
                                  <img
                                    src={item.imgSrc}
                                    alt={item.name}
                                    style={{
                                      width: 40,
                                      height: 40,
                                      objectFit: 'cover',
                                      borderRadius: 2,
                                    }}
                                  />
                                )}
                                <span style={{ flex: 1 }}>
                                  {item.name} — Size {item.size} × {item.quantity}
                                </span>
                                <span className="mono">
                                  ${(item.unitPrice * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}