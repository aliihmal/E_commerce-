import {
    createContext,
    useContext,
    useState,
    type ReactNode
} from "react";

interface CartContextValue {
    count: number;
    isOpen: boolean;

    openCart: () => void;
    closeCart: () => void;

    refreshCount: () => Promise<void>;
}

const CartContext =
    createContext<CartContextValue | undefined>(undefined);

export function CartProvider({
    children
}: {
    children: ReactNode;
}) {

    const [isOpen, setIsOpen] = useState(false);

    const [count, setCount] = useState(0);


    /*
     * Get logged-in user ID
     */
    function getUserId(): string | null {

        const storedUser =
            localStorage.getItem("user");

        if (!storedUser || storedUser === "undefined") {
            return null;
        }

        try {

            const user = JSON.parse(storedUser);

            return user.id ?? null;

        } catch (error) {

            console.error(
                "Error reading user from localStorage:",
                error
            );

            return null;
        }
    }


    /*
     * Retrieve cart count from backend
     */
    async function refreshCount(): Promise<void> {

        try {

            const userId = getUserId();

            if (!userId) {
                setCount(0);
                return;
            }

            const response = await fetch(
                `http://localhost:3000/cart/getByUser/${userId}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to retrieve cart"
                );
            }

            const cart = await response.json();

            /*
             * Calculate total quantity
             */
            const total = cart.reduce(
                (
                    sum: number,
                    item: {
                        quantity: number
                    }
                ) => {
                    return sum + item.quantity;
                },
                0
            );

            setCount(total);

        } catch (error) {

            console.error(
                "Error retrieving cart count:",
                error
            );

            setCount(0);
        }
    }


    /*
     * Open cart
     */
    async function openCart() {

        await refreshCount();

        setIsOpen(true);
    }


    /*
     * Close cart
     */
    function closeCart() {

        setIsOpen(false);
    }


    return (

        <CartContext.Provider
            value={{
                count,
                isOpen,

                openCart,
                closeCart,

                refreshCount
            }}
        >

            {children}

        </CartContext.Provider>
    );
}


export function useCart() {

    const ctx =
        useContext(CartContext);

    if (!ctx) {
        throw new Error(
            "useCart must be used within CartProvider"
        );
    }

    return ctx;
}