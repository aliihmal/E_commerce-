import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
    const storedUser = sessionStorage.getItem("user");

    if (!storedUser) {
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(storedUser);

        if (user.role !== "admin") {
            return <Navigate to="/" replace />;
        }

        return <Outlet />;

    } catch (error) {
        console.error("Error reading user:", error);

        return <Navigate to="/login" replace />;
    }
}