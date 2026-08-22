import { useState } from "react";
import { Link } from "react-router-dom";
import { StaggerItem } from "./Reveal";
import { useCart } from "../context/CartContext";

type Product = {
    id: string;
    name: string;
    price: number;
    salePrice: number | null;
    imgSrc: string;
    onSale: boolean;
    discountPercent?: number;
    sizes?: string[];
    reference?: string;
};

export default function SaleCard({
    product
}: {
    product: Product;
}) {

    const sizes = product.sizes ?? ["S", "M", "L", "XL"];

    const [size, setSize] = useState(
        sizes[0] || "M"
    );

    return (
        <StaggerItem className="card">

            {/* Sale percentage */}
            <span className="sale-tag">
                -{product.discountPercent ?? 0}%
            </span>

            {/* Product image */}
            <Link
                to={`/products/${product.id}`}
                style={{ display: "contents" }}
            >
                <div className="card-visual">
                    {product.imgSrc ? (
                        <img
                            src={product.imgSrc}
                            alt={product.name}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            }}
                        />
                    ) : (
                        <div>No image</div>
                    )}
                </div>
            </Link>

            {/* Product information */}
            <div className="card-info">
                <div>
                    <div className="card-name">
                        {product.name}
                    </div>

                    {product.reference && (
                        <div className="card-ref">
                            ref. {product.reference}
                        </div>
                    )}
                </div>

                {/* Prices */}
                <div className="card-price mono">
                    <span className="was">
                        ${product.price}
                    </span>

                    $
                    {product.salePrice}
                </div>
            </div>

            {/* Size picker */}
            <div className="size-picker">
                {sizes.map((s) => (
                    <button
                        key={s}
                        className={`size-chip ${
                            size === s ? "active" : ""
                        }`}
                        onClick={() => setSize(s)}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Add to cart */}
            <button
                className="btn btn-primary btn-sm"
                
            >
                Add to Cart
            </button>

        </StaggerItem>
    );
}