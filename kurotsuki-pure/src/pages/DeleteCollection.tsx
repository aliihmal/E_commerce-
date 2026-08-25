import { useEffect, useState } from 'react';

interface Collection {
  id: string;
  name: string;
  description: string;
  price: number;
  imgSrc: string;
}

export default function DeleteCollectionPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/collection/GetAll`, {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to load collections');
        const data = await response.json();
        setCollections(data.collections);
      } catch (err) {
        setError('Could not load collections');
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    setDeletingId(id);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/collection/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Delete failed');

      setCollections((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(`Could not delete "${name}"`);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="owner-header">
        <h1 className="display">Delete Collection</h1>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="empty-cell">Loading…</td>
              </tr>
            ) : collections.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-cell">No collections found.</td>
              </tr>
            ) : (
              collections.map((c) => (
                <tr key={c.id}>
                  <td style={{ width: 60 }}>
                    {c.imgSrc && (
                      <img
                        src={c.imgSrc}
                        alt={c.name}
                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 2 }}
                      />
                    )}
                  </td>
                  <td>{c.name}</td>
                  <td style={{ color: 'var(--grey)', maxWidth: 260 }}>{c.description}</td>
                  <td className="mono">${c.price}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      disabled={deletingId === c.id}
                      onClick={() => handleDelete(c.id, c.name)}
                    >
                      {deletingId === c.id ? 'Deleting…' : 'Delete'}
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