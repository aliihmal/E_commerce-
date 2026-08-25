import { useEffect, useState } from "react";
import SaleCard from "../components/SaleCard";
import Reveal, { StaggerGrid } from "../components/Reveal";

type Product = {
    id: string;
    name: string;
    price: number;
    salePrice: number | null;
    imgSrc: string;
    onSale: boolean;
    collectionId?: string;
    description?: string;
    discountPercent?: number;
    stock?: number;
};

export default function SalesPage() {
    const [sales, setSales] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSaleProducts() {
            try {
                setLoading(true);

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/product/getProdOnSale`,
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to retrieve products on sale");
                }

                const data = await response.json();

                console.log("SALE PRODUCTS:", data);

                // If your API returns { products: [...] }
                setSales(data.products);

            } catch (error) {
                console.error(
                    "Error while retrieving sale products:",
                    error
                );

                setSales([]);
            } finally {
                setLoading(false);
            }
        }

        fetchSaleProducts();
    }, []);

    return (
        <div className="page-wrap">
            <div className="page-hero">
                <Reveal>
                    <div className="eyebrow">Limited Time</div>

                    <h1 className="display">On Sale</h1>

                    <p>
                        Marked-down prints from past drops. Once the size
                        runs out, it's gone for good.
                    </p>
                </Reveal>
            </div>

            <section
                className="block"
                style={{ paddingTop: 60 }}
            >
                {loading ? (
                    <div className="empty-state">
                        Loading sale products...
                    </div>
                ) : sales.length === 0 ? (
                    <div className="empty-state">
                        Nothing on sale right now — check back soon.
                    </div>
                ) : (
                    <StaggerGrid className="grid-4">
                        {sales.map((p) => (
                            <SaleCard
                                key={p.id}
                                product={p}
                            />
                        ))}
                    </StaggerGrid>
                )}
            </section>
        </div>
    );
}