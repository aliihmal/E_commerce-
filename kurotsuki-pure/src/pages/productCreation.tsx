import { useState } from 'react';
import Reveal from '../components/Reveal';

export default function CreateProductPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      setImageFile(null);
      setImgPreview('');
      return;
    }

    setImageFile(file);
    setImgPreview(URL.createObjectURL(file));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!imageFile) {
      setError('Please select a product image before submitting.');
      return;
    }

    setSubmitting(true);

    const formData = new FormData();

    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('image', imageFile);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/product/`,
        {
          method: 'POST',
          credentials: 'include',
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create product');
      }

      // Reset form
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setImageFile(null);
      setImgPreview('');

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Could not create product — try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-wrap">
      <div className="page-hero">
        <Reveal>
          <div className="eyebrow">Owner Tools</div>
          <h1 className="display">Add Product</h1>
          <p>Name it, price it, and upload the art.</p>
        </Reveal>
      </div>

      <section
        className="block"
        style={{
          paddingTop: 40,
          maxWidth: 560,
          marginInline: 'auto',
        }}
      >
        <Reveal>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Product Name */}
            <div className="form-field">
              <label>Product Name</label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Hot Zenin Tee"
                required
              />
            </div>

            {/* Description */}
            <div className="form-field">
              <label>Description</label>

              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this piece, and why does it exist?"
                required
              />
            </div>

            {/* Price */}
            <div className="form-field">
              <label>Price</label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

         

            {/* Image */}
            <div className="form-field">
              <label>Product Image</label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />

              {imgPreview && (
                <div style={{ marginTop: 14 }}>
                  <img
                    src={imgPreview}
                    alt="Product preview"
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 2,
                    }}
                  />
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              className="btn btn-primary"
              type="submit"
              style={{
                width: '100%',
                marginTop: 12,
              }}
              disabled={submitting}
            >
              {submitting ? 'Creating…' : 'Create Product'}
            </button>

          </form>

        </Reveal>
      </section>
    </div>
  );
}