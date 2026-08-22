import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { count, openCart } = useCart();
  const navigate = useNavigate();

  type User = {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
  };

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser) as User;
    } catch {
        return null;
    }
});
  const [loading, setLoading] = useState(true);

  // Check if the user is logged in
  useEffect(() => {
    fetch("http://localhost:3000/auth/me", {
      credentials: "include"
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Not authenticated");
        }

        return res.json();
      })
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Logout
const handleLogout = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/auth/logout",
      {
        method: "POST",
        credentials: "include"
      }
    );

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    // Remove user from React state
    setUser(null);

    // Remove user from localStorage
    sessionStorage.removeItem("user");

    // Go to login page
    navigate("/login");

  } catch (error) {
    console.error("Logout error:", error);
  }
};

  return (
    <nav className="site-nav">

      <NavLink to="/" className="logo">
        <span className="display">KUROTSUKI</span>
        <span className="jp">黒月</span>
      </NavLink>

      <div className="nav-links">

        <NavLink
          to="/products"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Products
        </NavLink>

        <NavLink
          to="/collections"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Collections
        </NavLink>

        <NavLink
          to="/sales"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Sales
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          About
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Home
        </NavLink>

      </div>

      <div className="nav-right">

        
            <button onClick={handleLogout}>
              Logout
            </button>
        
            <Link to="/login">
              Login
            </Link>
       

      </div>

      <div className="nav-right">
        <button className="nav-cart-btn" onClick={openCart}>
          CART ({count})
        </button>
      </div>

    </nav>
  );
}