import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

// ===============================
// Cart item returned by backend
// ===============================
interface CartItem {
    id: string;
    user_id: string;
    product_id: string;
    size: string;
    quantity: number;
}

// ===============================
// Product returned inside
// the product API response
// ===============================
interface Product {
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
}

// ===============================
// Product API response
// ===============================
interface ProductResponse {
    message: string;
    product: Product;
}

// ===============================
// Item that the CartDrawer displays
// ===============================
interface DisplayCartItem {
    id: string;
    productId: string;
    size: string;
    quantity: number;
    name: string;
    unitPrice: number;
    imgSrc: string;
}

export default function CartDrawer() {
    const { isOpen, closeCart, refreshCount } = useCart();
    const [items, setItems] = useState<DisplayCartItem[]>([]);
    const [loading, setLoading] = useState(false);

    // =====================================
    // Get logged-in user from localStorage
    // =====================================
    function getUserId(): string | null {
        const storedUser = sessionStorage.getItem("user");

        if (!storedUser || storedUser === "undefined") {
            console.log("No logged-in user");
            return null;
        }

        try {
            const user = JSON.parse(storedUser);
            return user.id ?? null;
        } catch (error) {
            console.error("Error reading user from sessionStorage:", error);
            return null;
        }
    }

    // =====================================
    // Fetch cart
    // =====================================
   async function fetchCart() {
    try {
        setLoading(true);

        const userId = getUserId();

        if (!userId) {
            setItems([]);
            return;
        }

        console.log("Fetching cart for user:", userId);

        // =====================================
        // Get user's cart
        // =====================================
        const response = await fetch(
            `http://localhost:3000/cart/getByUser/${userId}`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!response.ok) {
            throw new Error("Failed to retrieve cart");
        }

        const cart: CartItem[] = await response.json();

        console.log(
            "CART FROM BACKEND:",
            JSON.stringify(cart, null, 2)
        );

        // =====================================
        // Get product/collection information
        // for each cart item
        // =====================================
        const result = await Promise.all(
            cart.map(async (cartItem) => {
                const id = cartItem.product_id;

                console.log("Fetching cart item:", id);

                // =====================================
                // If ID starts with "product"
                // =====================================
                if (id.startsWith("product")) {
                    const productResponse = await fetch(
                        `http://localhost:3000/product/get/${id}`,
                        {
                            method: "GET",
                            credentials: "include"
                        }
                    );

                    if (!productResponse.ok) {
                        throw new Error(
                            `Failed to retrieve product ${id}`
                        );
                    }

                    const data: ProductResponse =
                        await productResponse.json();

                    console.log("PRODUCT RESPONSE:", data);

                    const product = data.product;

                    return {
                        id: cartItem.id,
                        productId: id,
                        size: cartItem.size,
                        quantity: cartItem.quantity,

                        name: product.name,

                        unitPrice:
                            product.onSale &&
                            product.salePrice !== null
                                ? product.salePrice
                                : product.price,

                        imgSrc: product.imgSrc
                    };
                }

                // =====================================
                // If ID starts with "collection"
                // =====================================
                if (id.startsWith("collection")) {
                    const collectionResponse = await fetch(
                        `http://localhost:3000/collection/getById/${id}`,
                        {
                            method: "GET",
                            credentials: "include"
                        }
                    );

                    if (!collectionResponse.ok) {
                        throw new Error(
                            `Failed to retrieve collection ${id}`
                        );
                    }

                    const data = await collectionResponse.json();

                    console.log("COLLECTION RESPONSE:", data);

                    const collection = data.collection;

                    return {
                        id: cartItem.id,
                        productId: id,
                        size: cartItem.size,
                        quantity: cartItem.quantity,

                        name: collection.name,

                        unitPrice: collection.price,

                        imgSrc: collection.imgSrc
                    };
                }

                // =====================================
                // Unknown ID type
                // =====================================
                throw new Error(
                    `Unknown cart item type: ${id}`
                );
            })
        );

        console.log("FINAL CART ITEMS:", result);

        setItems(result);

    } catch (error) {
        console.error("Error while retrieving cart:", error);
        setItems([]);
    } finally {
        setLoading(false);
    }
}

    // =====================================
    // Fetch cart when drawer opens
    // =====================================
    useEffect(() => {
        if (!isOpen) {
            return;
        }
        fetchCart();
    }, [isOpen]);

    // =====================================
    // Calculate total
    // =====================================
    const total = items.reduce(
        (sum, item) => {
            return sum + item.unitPrice * item.quantity;
        },
        0
    );

    // =====================================
    // Increase quantity
    // =====================================
    async function increaseQuantity(item: DisplayCartItem) {
        try {
            const response = await fetch(
                `http://localhost:3000/cart/update/${item.id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        quantity: item.quantity + 1
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update quantity");
            }

            await fetchCart();
            await refreshCount();
        } catch (error) {
            console.error("Error increasing quantity:", error);
        }
    }

    // =====================================
    // Decrease quantity
    // =====================================
    async function decreaseQuantity(item: DisplayCartItem) {
        if (item.quantity <= 1) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3000/cart/update/${item.id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        quantity: item.quantity - 1
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update quantity");
            }

            await fetchCart();
            await refreshCount();
        } catch (error) {
            console.error("Error decreasing quantity:", error);
        }
    }

    // =====================================
    // Remove item
    // =====================================
    async function removeItem(id: string) {
        try {
            const response = await fetch(
                `http://localhost:3000/cart/deletecart/${id}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to remove item");
            }

            await fetchCart();
            await refreshCount();
        } catch (error) {
            console.error("Error removing cart item:", error);
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* ================================= */}
                    {/* Overlay */}
                    {/* ================================= */}
                    <motion.div
                        className="cart-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                    />

                    {/* ================================= */}
                    {/* Drawer */}
                    {/* ================================= */}
                    <motion.div
                        className="cart-drawer"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{
                            duration: 0.35,
                            ease: [0.2, 0.7, 0.3, 1]
                        }}
                    >
                        {/* ================================= */}
                        {/* Header */}
                        {/* ================================= */}
                        <div className="cart-header">
                            <span
                                className="display"
                                style={{ fontSize: "1.4rem" }}
                            >
                                Your Cart
                            </span>
                            <button onClick={closeCart}>✕</button>
                        </div>

                        {/* ================================= */}
                        {/* Cart Items */}
                        {/* ================================= */}
                        <div className="cart-items">
                            {/* Loading */}
                            {loading && (
                                <div className="empty-state">
                                    Loading your cart...
                                </div>
                            )}

                            {/* Empty */}
                            {!loading && items.length === 0 && (
                                <div className="empty-state">
                                    Your cart is empty.
                                    <br />
                                    Go find something worth wearing.
                                </div>
                            )}

                            {/* Items */}
                            {!loading &&
                                items.map((item) => (
                                    <div
                                        className="cart-row"
                                        key={item.id}
                                    >
                                        {/* ================================= */}
                                        {/* Image */}
                                        {/* ================================= */}
                                        <div className="art">
                                            {item.imgSrc ? (
                                                <img
                                                    src={item.imgSrc}
                                                    alt={item.name}
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

                                        {/* ================================= */}
                                        {/* Product info */}
                                        {/* ================================= */}
                                        <div className="meta">
                                            {/* Name */}
                                            <div className="name">
                                                {item.name}
                                            </div>

                                            {/* Size */}
                                            <div className="size">
                                                Size {item.size}
                                            </div>

                                            {/* Quantity controls */}
                                            <div className="qty-control">
                                                {/* Minus */}
                                                <button
                                                    onClick={() =>
                                                        decreaseQuantity(item)
                                                    }
                                                >
                                                    −
                                                </button>

                                                {/* Quantity */}
                                                <span className="mono">
                                                    {item.quantity}
                                                </span>

                                                {/* Plus */}
                                                <button
                                                    onClick={() =>
                                                        increaseQuantity(item)
                                                    }
                                                >
                                                    +
                                                </button>

                                                {/* Remove */}
                                                <button
                                                    style={{
                                                        marginLeft: "auto",
                                                        color: "var(--crimson)",
                                                        fontSize: "0.72rem"
                                                    }}
                                                    onClick={() =>
                                                        removeItem(item.id)
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>

                                        {/* ================================= */}
                                        {/* Price */}
                                        {/* ================================= */}
                                        <div className="mono">
                                            $
                                            {(
                                                item.unitPrice * item.quantity
                                            ).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                        </div>

                        {/* ================================= */}
                        {/* Footer */}
                        {/* ================================= */}
                        {items.length > 0 && (
                            <div className="cart-footer">
                                <div className="total-row">
                                    <span>Total</span>
                                    <span className="mono">
                                        ${total.toFixed(2)}
                                    </span>
                                </div>

                                <Link
                                    to="/checkout"
                                    className="btn btn-primary"
                                    style={{ width: "100%" }}
                                    onClick={closeCart}
                                >
                                    Checkout
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}