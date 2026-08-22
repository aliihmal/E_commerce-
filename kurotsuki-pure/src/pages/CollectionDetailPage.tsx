import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Reveal, { StaggerGrid } from '../components/Reveal';
import { useEffect, useState } from 'react';
import { Product } from './ProductsPage';
import { Collection } from './CollectionsPage';

export default function CollectionDetailPage() {

  const { id } = useParams();

  const [thecollection, setTheCollection] =
    useState<Collection | null>(null);

  const [productOfCollection, setProductOfCollection] =
    useState<Product[]>([]);

  const [size, setSize] = useState('');

  const [addingToCart, setAddingToCart] =
    useState(false);

  const [cartMessage, setCartMessage] =
    useState('');

  // =========================
  // Fetch Collection
  // =========================

  useEffect(() => {

    const fetchCollection = async () => {

      if (!id) {
        return;
      }

      try {

        const response = await fetch(
          `http://localhost:3000/collection/getById/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch collection");
        }

        const data = await response.json();

        console.log(
          "The collection is:",
          data.collection
        );

        setTheCollection(data.collection);

      } catch (error) {

        console.error(
          "Error fetching collection:",
          error
        );

      }

    };

    fetchCollection();

  }, [id]);


  // =========================
  // Fetch Products
  // =========================

  useEffect(() => {

    const fetchProducts = async () => {

      if (!id) {
        return;
      }

      try {

        const response = await fetch(
          `http://localhost:3000/product/getByCollectionId/${id}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch products"
          );
        }

        const data = await response.json();

        setProductOfCollection(data.products);

      } catch (error) {

        console.error(
          "Error fetching products:",
          error
        );

      }

    };

    fetchProducts();

  }, [id]);


  // =========================
  // Add Collection To Cart
  // =========================

  const handleAddToCart = async () => {

    if (!id) {
      setCartMessage(
        "Collection ID is missing."
      );
      return;
    }

    if (!size) {
      setCartMessage(
        "Please select a size."
      );
      return;
    }

    // Get logged-in user
    const storedUser =
      sessionStorage.getItem("user");

    if (!storedUser) {
      setCartMessage(
        "You must be logged in to add items to the cart."
      );
      return;
    }

    try {

      const user = JSON.parse(storedUser);

      const userId = user.id;

      if (!userId) {
        setCartMessage(
          "User ID is missing."
        );
        return;
      }

      setAddingToCart(true);
      setCartMessage("");

      // =========================
      // Send request
      // =========================

      const response = await fetch(
        `http://localhost:3000/cart/add/${userId}`,
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            productId: id,
            size: size,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to add item to cart"
        );

      }

      console.log(
        "Added to cart:",
        data
      );

      setCartMessage(
        "Collection added to cart successfully!"
      );

    } catch (error) {

      console.error(
        "Error adding to cart:",
        error
      );

      if (error instanceof Error) {

        setCartMessage(
          error.message
        );

      } else {

        setCartMessage(
          "Could not add item to cart."
        );

      }

    } finally {

      setAddingToCart(false);

    }

  };


  // =========================
  // JSX
  // =========================

  return (

    <div className="page-wrap">

      {/* =========================
          Collection Header
          ========================= */}

      <div className="page-hero">

        <Reveal>

          {/* Collection Image */}

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 20
            }}
          >

            <div
              style={{
                width: 90,
                height: 90
              }}
            >

              <img
                src={thecollection?.imgSrc}
                alt={thecollection?.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />

            </div>

          </div>


          {/* Collection Name */}

          <h1 className="display">
            {thecollection?.name}
          </h1>


          {/* Collection Description */}

          {thecollection?.description && (
            <p>
              {thecollection.description}
            </p>
          )}


          {/* =========================
              Size Selection
              ========================= */}

          <div
            style={{
              marginTop: 20
            }}
          >

            <label
              htmlFor="size"
              style={{
                display: 'block',
                marginBottom: 8,
                fontSize: '0.9rem'
              }}
            >
              Select Size
            </label>

            <select
              id="size"
              value={size}
              onChange={(e) =>
                setSize(e.target.value)
              }
              style={{
                padding: '10px 14px',
                minWidth: 180
              }}
            >

              <option value="">
                Choose a size
              </option>

              <option value="S">
                Small (S)
              </option>

              <option value="M">
                Medium (M)
              </option>

              <option value="L">
                Large (L)
              </option>

              <option value="XL">
                Extra Large (XL)
              </option>

              <option value="XXL">
                XXL
              </option>

            </select>

          </div>


          {/* =========================
              Add To Cart Button
              ========================= */}

          <button
            className="btn btn-primary"
            onClick={handleAddToCart}
            disabled={addingToCart}
            style={{
              marginTop: 20,
              padding: '8px 18px',
              fontSize: '1.1rem',
              letterSpacing: '0.1em',
            }}
          >

            {addingToCart
              ? "Adding..."
              : "Add Collection to Cart"}

          </button>


          {/* =========================
              Cart Message
              ========================= */}

          {cartMessage && (
            <div
              style={{
                marginTop: 12,
                fontSize: '0.9rem'
              }}
            >
              {cartMessage}
            </div>
          )}

        </Reveal>

      </div>


      {/* =========================
          Products In Collection
          ========================= */}

      <section
        className="block"
        style={{
          paddingTop: 60
        }}
      >

        {productOfCollection.length === 0 ? (

          <div className="empty-state">
            No products in this collection yet.
          </div>

        ) : (

          <StaggerGrid className="grid-4">

            {productOfCollection.map(
              (p, i) => (

                <ProductCard
                  key={p.id}
                  product={p}
                  index={i}
                />

              )
            )}

          </StaggerGrid>

        )}

      </section>

    </div>

  );
}