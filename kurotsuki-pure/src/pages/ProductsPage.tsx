import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Reveal, { StaggerGrid } from '../components/Reveal';
import { COLLECTIONS } from '../data/dummyData';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  discountPercent: number;
  onSale: boolean;
  stock: number;
  collectionId: string | null;
  imgSrc: string;
};

export default function ProductsPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [myProduct, setMyProduct] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/product/getAllProduct`,
          {
            credentials: 'include',
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
          console.log("API RESPONSE:", data);
  console.log("PRODUCTS:", data.products);
        setMyProduct(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");

    if (!storedUser) {
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      setIsAdmin(user.role === "admin");
    } catch (error) {
      console.error("Error reading user from session:", error);
    }
    console.log(storedUser);
  }, []);

  const [params, setParams] = useSearchParams();
  const activeCollection = params.get('collection') || '';

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/product/deleteProd/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setMyProduct((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="page-wrap">
      <div className="page-hero">
        <Reveal>
          <div className="eyebrow">Full Catalog</div>
          <h1 className="display">All Products</h1>
          <p>Every tee and hoodie currently in rotation. Filter by collection to narrow the arc.</p>
          
          {isAdmin && (
            <div>
            <div style={{ marginTop: 24 }}>
              <Link to="/Deleteprod" className="btn btn-danger btn-sm">
                Manage / Delete Products
              </Link>
            </div>
            <div style={{ marginTop: 24 }}>
              <Link to="/creatprod" className="btn btn-danger btn-sm">
                Manage / Add product
              </Link>
            </div>

            <div style={{ marginTop: 24 }}>
              <Link to="/AddSale" className="btn btn-danger btn-sm">
                Manage / set product on sale
              </Link>
            </div>

            <div style={{ marginTop: 24 }}>
              <Link to="/RemoveSale" className="btn btn-danger btn-sm">
                Manage / remove product from sale
              </Link>
            </div>
            </div>
          )}
        </Reveal>
      </div>

      <section className="block" style={{ paddingTop: 60 }}>
        <div className="size-picker" style={{ marginBottom: 40, justifyContent: 'center' }}>
          <button
            className={`size-chip ${activeCollection === '' ? 'active' : ''}`}
            onClick={() => setParams({})}
          >
            All
          </button>
          {COLLECTIONS.map((c) => (
            <button
              key={c.id}
              className={`size-chip ${activeCollection === c.slug ? 'active' : ''}`}
              onClick={() => setParams({ collection: c.slug })}
            >
              {c.name}
            </button>
          ))}
        </div>

        {myProduct.length === 0 ? (
          <div className="empty-state">No products found in this collection yet.</div>
        ) : (
          <StaggerGrid className="grid-4">
            {myProduct.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </StaggerGrid>
        )}
      </section>
    </div>
  );
}