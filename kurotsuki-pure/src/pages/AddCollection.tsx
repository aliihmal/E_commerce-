import { useEffect, useState } from "react";
import { Product } from "./ProductsPage";

export default function AddCollectionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/product/getAllProduct`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  function toggleProduct(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((existing) => existing !== id)
        : [...prev, id]
    );
  }

  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) {
      setImageFile(null);
      setImagePreview("");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (!imageFile) {
      setError("Please select a collection image.");
      return;
    }

    if (selectedIds.length === 0) {
      setError("Please select at least one product.");
      return;
    }

    setSubmitting(true);

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", imageFile);

    // Send the selected product IDs
    selectedIds.forEach((id) => {
      formData.append("productids", id);
    });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/collection`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create collection"
        );
      }

      console.log("Collection created:", data);

      // Reset form
      setName("");
      setDescription("");
      setPrice("");
      setImageFile(null);
      setImagePreview("");
      setSelectedIds([]);

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Could not create collection.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-wrap">
      <div className="page-hero">
        <div className="eyebrow">Owner Tools</div>

        <h1 className="display">Add Collection</h1>

        <p>
          Name it, describe it, then pick which products belong in it.
        </p>
      </div>

      <section className="block add-collection-section">

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <form
          className="add-collection-form"
          onSubmit={handleSubmit}
        >

          {/* Collection Name */}
          <div className="form-field">
            <label>Collection Name</label>

            <input
              type="text"
              placeholder="e.g. Zenin Clan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="form-field">
            <label>Description</label>

            <textarea
              rows={4}
              placeholder="What ties these pieces together?"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              required
            />
          </div>

          {/* Collection Image */}
          <div className="form-field">
            <label>Collection Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />

            {imagePreview && (
              <div style={{ marginTop: 14 }}>
                <img
                  src={imagePreview}
                  alt="Collection preview"
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 2,
                  }}
                />
              </div>
            )}
          </div>

          {/* Price */}
          <div className="form-field">
            <label>Price</label>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              required
            />
          </div>

          {/* Products */}
          <div className="form-field">
            <label>Products</label>

            <div className="product-select-list">
              {products.map((product) => (
                <label
                  key={product.id}
                  className="product-select-row"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(
                      String(product.id)
                    )}
                    onChange={() =>
                      toggleProduct(String(product.id))
                    }
                  />

                  <img
                    src={product.imgSrc}
                    className="product-select-image"
                    alt={product.name}
                  />

                  <span className="product-select-name">
                    {product.name}
                  </span>

                  <span className="product-select-price">
                    ${product.price}
                  </span>
                </label>
              ))}
            </div>

            <div className="product-select-count">
              {selectedIds.length} product
              {selectedIds.length === 1 ? "" : "s"} selected
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting
              ? "Creating..."
              : "Create Collection"}
          </button>

        </form>
      </section>
    </div>
  );
}