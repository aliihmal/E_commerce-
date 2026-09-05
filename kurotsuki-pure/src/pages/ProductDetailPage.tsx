import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { useCart } from '../context/CartContext';
import { Product } from './ProductsPage';

export default function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [size, setSize] = useState<string>("");
  const [adding, setAdding] = useState(false);

  const { refreshCount } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/product/get/${id}`,
          {
            credentials: "include"
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();

        setProduct(data.product);

      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const sizeArray = ["S", "M", "L", "XL", "XXL"];

  // ==========================================
  // Add product to cart
  // ==========================================
  const handleAddToCart = async () => {
    if (!size) {
      return;
    }

    if (!product) {
      return;
    }

    try {
      setAdding(true);

      // Get logged-in user from sessionStorage
      const storedUser = sessionStorage.getItem("user");

      if (!storedUser) {
        console.error("No logged-in user");
        return;
      }

      const user = JSON.parse(storedUser);

      if (!user.id) {
        console.error("User ID not found");
        return;
      }

      // ==========================================
      // Add product to backend cart
      // ==========================================
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/cart/add/${user.id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            productId: product.id,
            size: size,
            quantity: 1
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add product to cart");
      }

      const data = await response.json();

      console.log("Product added to cart:", data);

      // Update cart counter
      await refreshCount();

      console.log("Product successfully added to cart");

    } catch (error) {
      console.error(
        "Error adding product to cart:",
        error
      );

    } finally {
      setAdding(false);
    }
  };

  if (!product) {
    return (
      <div className="page-wrap">
        <div className="page-hero">
          <h1 className="display">Not Found</h1>

          <p>
            This product doesn't exist or has been retired.
          </p>

          <div style={{ marginTop: 24 }}>
            <Link
              to="/products"
              className="btn btn-outline"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap">

      <section
        className="block"
        style={{ paddingTop: 60 }}
      >

        <Reveal>

          <div className="product-detail">

            <div className="product-visual-big">
              <img
                src={product.imgSrc}
                alt={product.name}
              />
            </div>

            <div className="product-info">

              {product.onSale && (
                <span
                  className="sale-tag"
                  style={{
                    position: 'static',
                    display: 'inline-block',
                    marginBottom: 16
                  }}
                >
                  -{product.discountPercent}% SALE
                </span>
              )}

              <h1 className="display">
                {product.name}
              </h1>

              <div className="price-line mono">

                {product.onSale && (
                  <span className="was">
                    ${product.price}
                  </span>
                )}

                ${product.salePrice ?? product.price}

              </div>

              {product.description && (
                <p className="desc">
                  {product.description}
                </p>
              )}

              <label>Size</label>

              <div className="size-picker">

                {sizeArray.map((s) => (
                  <button
                    key={s}
                    className={`size-chip ${
                      size === s ? 'active' : ''
                    }`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}

              </div>

              <button
                className="btn btn-primary"
                disabled={
                  !size ||
                  product.stock <= 0 ||
                  adding
                }
                onClick={handleAddToCart}
              >
                {adding
                  ? "Adding..."
                  : product.stock > 0
                    ? "Add to Cart"
                    : "Out of Stock"}
              </button>

             

            </div>

          </div>

        </Reveal>

      </section>

    </div>
  );
}