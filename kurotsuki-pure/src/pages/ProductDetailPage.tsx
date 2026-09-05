import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import { useCart } from "../context/CartContext";
import { Product } from "./ProductsPage";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [size, setSize] = useState<string>("");
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { refreshCount } = useCart();

  const sizeArray = ["S", "M", "L", "XL", "XXL"];

  // ============================================================
  // Fetch product
  // ============================================================
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const apiUrl = import.meta.env.VITE_API_URL;

        console.log("API URL:", apiUrl);
        console.log("Product ID:", id);

        const response = await fetch(
          `${apiUrl}/product/get/${id}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Product response status:", response.status);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch product. Status: ${response.status}`
          );
        }

        const data = await response.json();

        console.log("Product response:", data);

        setProduct(data.product);
      } catch (error) {
        console.error("Error fetching product:", error);

        setError("Unable to load this product.");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ============================================================
  // Get logged-in user
  // ============================================================
  const getLoggedInUser = () => {
    try {
      // First try sessionStorage
      let storedUser = sessionStorage.getItem("user");

      // If sessionStorage is empty, try localStorage
      if (!storedUser) {
        storedUser = localStorage.getItem("user");
      }

      console.log("Stored user:", storedUser);

      if (!storedUser) {
        return null;
      }

      const user = JSON.parse(storedUser);

      console.log("Parsed user:", user);

      if (!user || !user.id) {
        console.error("User ID not found:", user);
        return null;
      }

      return user;
    } catch (error) {
      console.error("Error reading user:", error);
      return null;
    }
  };

  // ============================================================
  // Add product to cart
  // ============================================================
  const handleAddToCart = async () => {
    // ----------------------------------------------------------
    // Check size
    // ----------------------------------------------------------
    if (!size) {
      alert("Please select a size.");
      return;
    }

    // ----------------------------------------------------------
    // Check product
    // ----------------------------------------------------------
    if (!product) {
      alert("Product information is unavailable.");
      return;
    }

    // ----------------------------------------------------------
    // Prevent multiple requests
    // ----------------------------------------------------------
    if (adding) {
      return;
    }

    try {
      setAdding(true);

      console.log("=================================");
      console.log("ADDING PRODUCT TO CART");
      console.log("=================================");

      // --------------------------------------------------------
      // Get logged-in user
      // --------------------------------------------------------
      const user = getLoggedInUser();

      if (!user) {
        alert("Please log in before adding a product to your cart.");

        console.error("No logged-in user found.");

        return;
      }

      console.log("User ID:", user.id);
      console.log("Product ID:", product.id);
      console.log("Size:", size);

      // --------------------------------------------------------
      // API URL
      // --------------------------------------------------------
      const apiUrl = import.meta.env.VITE_API_URL;

      if (!apiUrl) {
        console.error("VITE_API_URL is not defined.");
        alert("Server configuration error.");
        return;
      }

      const cartUrl = `${apiUrl}/cart/add/${user.id}`;

      console.log("Cart URL:", cartUrl);

      // --------------------------------------------------------
      // Send request
      // --------------------------------------------------------
      const response = await fetch(cartUrl, {
        method: "POST",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          productId: product.id,
          size: size,
          quantity: 1,
        }),
      });

      console.log("Cart response status:", response.status);

      // --------------------------------------------------------
      // Try to read response
      // --------------------------------------------------------
      let data: any = null;

      try {
        data = await response.json();
      } catch {
        console.warn("Response did not contain JSON.");
      }

      console.log("Cart response data:", data);

      // --------------------------------------------------------
      // Handle authentication error
      // --------------------------------------------------------
      if (response.status === 401) {
        console.error("Authentication failed.");

        alert(
          "Your login session has expired. Please log in again."
        );

        return;
      }

      // --------------------------------------------------------
      // Handle forbidden
      // --------------------------------------------------------
      if (response.status === 403) {
        console.error("Access forbidden.");

        alert(
          "You don't have permission to add this product to the cart."
        );

        return;
      }

      // --------------------------------------------------------
      // Handle other errors
      // --------------------------------------------------------
      if (!response.ok) {
        const message =
          data?.message ||
          data?.error ||
          "Failed to add product to cart.";

        throw new Error(message);
      }

      // --------------------------------------------------------
      // Successfully added
      // --------------------------------------------------------
      console.log("Product successfully added to cart.");

      // Update cart counter
      try {
        await refreshCount();
        console.log("Cart count refreshed.");
      } catch (error) {
        console.error(
          "Product was added, but cart count could not refresh:",
          error
        );
      }

      alert("Product added to cart!");

      // Optional: reset size after adding
      setSize("");
    } catch (error) {
      console.error("=================================");
      console.error("ERROR ADDING PRODUCT TO CART");
      console.error("=================================");
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Something went wrong while adding the product.");
      }
    } finally {
      setAdding(false);
    }
  };

  // ============================================================
  // Loading
  // ============================================================
  if (loading) {
    return (
      <div className="page-wrap">
        <div className="page-hero">
          <h1 className="display">Loading...</h1>
          <p>Please wait while we load the product.</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // Product not found
  // ============================================================
  if (!product) {
    return (
      <div className="page-wrap">
        <div className="page-hero">
          <h1 className="display">Not Found</h1>

          <p>
            {error ||
              "This product doesn't exist or has been retired."}
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

  // ============================================================
  // Product page
  // ============================================================
  return (
    <div className="page-wrap">
      <section
        className="block"
        style={{ paddingTop: 60 }}
      >
        <Reveal>
          <div className="product-detail">

            {/* ==================================================
                PRODUCT IMAGE
            ================================================== */}
            <div className="product-visual-big">
              <img
                src={product.imgSrc}
                alt={product.name}
              />
            </div>

            {/* ==================================================
                PRODUCT INFORMATION
            ================================================== */}
            <div className="product-info">

              {/* Sale */}
              {product.onSale && (
                <span
                  className="sale-tag"
                  style={{
                    position: "static",
                    display: "inline-block",
                    marginBottom: 16,
                  }}
                >
                  -{product.discountPercent}% SALE
                </span>
              )}

              {/* Product name */}
              <h1 className="display">
                {product.name}
              </h1>

              {/* Price */}
              <div className="price-line mono">
                {product.onSale && (
                  <span className="was">
                    ${product.price}
                  </span>
                )}

                ${product.salePrice ?? product.price}
              </div>

              {/* Description */}
              {product.description && (
                <p className="desc">
                  {product.description}
                </p>
              )}

              {/* Size */}
              <label>Size</label>

              <div className="size-picker">
                {sizeArray.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`size-chip ${
                      size === s ? "active" : ""
                    }`}
                    onClick={() => setSize(s)}
                    disabled={adding}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Stock information */}
              {product.stock > 0 && (
                <p
                  style={{
                    marginTop: 12,
                    marginBottom: 16,
                  }}
                >
                  {product.stock} available
                </p>
              )}

              {product.stock <= 0 && (
                <p
                  style={{
                    marginTop: 12,
                    marginBottom: 16,
                  }}
                >
                  Out of stock
                </p>
              )}

              {/* Add to cart */}
              <button
                type="button"
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
