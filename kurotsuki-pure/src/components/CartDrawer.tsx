import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

interface CartItem {
    id: string;
    user_id: string;
    product_id: string;
    size: string;
    quantity: number;
}

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

interface ProductResponse {
    message: string;
    product: Product;
}

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
    const [orderSent, setOrderSent] = useState(false);

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
            console.error(
                "Error reading user from sessionStorage:",
                error
            );
            return null;
        }
    }

    async function handleCheckout() {
        try {
            const userId = getUserId();

            if (!userId) {
                console.error("No logged-in user");
                return;
            }

            if (items.length === 0) {
                return;
            }

            const ids = items.map((item) => item.id);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/order/${userId}`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ids,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to create order");
            }

            const data = await response.json();

            console.log("Order created:", data);

            await refreshCount();

            setOrderSent(true);
            closeCart();
        } catch (error) {
            console.error("Checkout error:", error);
        }
    }

    async function fetchCart() {
        try {
            setLoading(true);

            const userId = getUserId();

            if (!userId) {
                setItems([]);
                return;
            }

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/cart/getByUser/${userId}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to retrieve cart");
            }

            const cart: CartItem[] = await response.json();

            const result = await Promise.all(
                cart.map(async (cartItem) => {
                    const id = cartItem.product_id;

                    if (id.startsWith("product")) {
                        const productResponse = await fetch(
                            `${import.meta.env.VITE_API_URL}/product/get/${id}`,
                            {
                                method: "GET",
                                credentials: "include",
                            }
                        );

                        if (!productResponse.ok) {
                            throw new Error(
                                `Failed to retrieve product ${id}`
                            );
                        }

                        const data: ProductResponse =
                            await productResponse.json();

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
                            imgSrc: product.imgSrc,
                        };
                    }

                    if (id.startsWith("collection")) {
                        const collectionResponse = await fetch(
                            `${import.meta.env.VITE_API_URL}/collection/getById/${id}`,
                            {
                                method: "GET",
                                credentials: "include",
                            }
                        );

                        if (!collectionResponse.ok) {
                            throw new Error(
                                `Failed to retrieve collection ${id}`
                            );
                        }

                        const data = await collectionResponse.json();
                        const collection = data.collection;

                        return {
                            id: cartItem.id,
                            productId: id,
                            size: cartItem.size,
                            quantity: cartItem.quantity,
                            name: collection.name,
                            unitPrice: collection.price,
                            imgSrc: collection.imgSrc,
                        };
                    }

                    throw new Error(
                        `Unknown cart item type: ${id}`
                    );
                })
            );

            setItems(result);
        } catch (error) {
            console.error("Error while retrieving cart:", error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        fetchCart();
    }, [isOpen]);

    const total = items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
    );

    async function increaseQuantity(item: DisplayCartItem) {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/cart/update/${item.id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        quantity: item.quantity + 1,
                    }),
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

    async function decreaseQuantity(item: DisplayCartItem) {
        if (item.quantity <= 1) {
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/cart/update/${item.id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        quantity: item.quantity - 1,
                    }),
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

    async function removeItem(id: string) {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/cart/deletecart/${id}`,
                {
                    method: "DELETE",
                    credentials: "include",
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
        <>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            className="cart-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeCart}
                        />

                        <motion.div
                            className="cart-drawer"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{
                                duration: 0.35,
                                ease: [0.2, 0.7, 0.3, 1],
                            }}
                        >
                            <div className="cart-header">
                                <span
                                    className="display"
                                    style={{ fontSize: "1.4rem" }}
                                >
                                    Your Cart
                                </span>

                                <button onClick={closeCart}>
                                    ✕
                                </button>
                            </div>

                            <div className="cart-items">
                                {loading && (
                                    <div className="empty-state">
                                        Loading your cart...
                                    </div>
                                )}

                                {!loading && items.length === 0 && (
                                    <div className="empty-state">
                                        Your cart is empty.
                                        <br />
                                        Go find something worth wearing.
                                    </div>
                                )}

                                {!loading &&
                                    items.map((item) => (
                                        <div
                                            className="cart-row"
                                            key={item.id}
                                        >
                                            <div className="art">
                                                {item.imgSrc ? (
                                                    <img
                                                        src={item.imgSrc}
                                                        alt={item.name}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                ) : (
                                                    <div>No image</div>
                                                )}
                                            </div>

                                            <div className="meta">
                                                <div className="name">
                                                    {item.name}
                                                </div>

                                                <div className="size">
                                                    Size {item.size}
                                                </div>

                                                <div className="qty-control">
                                                    <button
                                                        onClick={() =>
                                                            decreaseQuantity(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        −
                                                    </button>

                                                    <span className="mono">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            increaseQuantity(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        +
                                                    </button>

                                                    <button
                                                        style={{
                                                            marginLeft: "auto",
                                                            color: "var(--crimson)",
                                                            fontSize: "0.72rem",
                                                        }}
                                                        onClick={() =>
                                                            removeItem(item.id)
                                                        }
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mono">
                                                $
                                                {(
                                                    item.unitPrice *
                                                    item.quantity
                                                ).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            {items.length > 0 && (
                                <div className="cart-footer">
                                    <div className="total-row">
                                        <span>Total</span>

                                        <span className="mono">
                                            ${total.toFixed(2)}
                                        </span>
                                    </div>

                                    <button
                                        className="btn btn-primary"
                                        style={{ width: "100%" }}
                                        onClick={handleCheckout}
                                    >
                                        Checkout
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {orderSent && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0, 0, 0, 0.55)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            background: "var(--background)",
                            padding: "2rem",
                            borderRadius: "12px",
                            textAlign: "center",
                            width: "min(90%, 400px)",
                            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        <h2>Order Sent!</h2>

                        <p>
                            Your order has been sent to the business owner.
                            <br />
                            You will be contacted soon.
                        </p>

                        <button
                            className="btn btn-primary"
                            onClick={() => setOrderSent(false)}
                        >
                            OK
                        </button>
                    </motion.div>
                </div>
            )}
        </>
    );
}