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
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser) as User;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
      credentials: "include"
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // lock body scroll while the sidebar is open on mobile
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        { method: "POST", credentials: "include" }
      );
      if (!response.ok) throw new Error("Logout failed");
      setUser(null);
      sessionStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isAdmin = user?.role === "admin";

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="site-nav">

      <NavLink to="/" className="logo" onClick={closeMenu}>
        <span className="display">RANDOM</span>
        <span className="jp">黒月</span>
      </NavLink>

      <button
        className="nav-toggle"
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* backdrop behind the sliding sidebar, click to close */}
      <div
        className={`nav-overlay ${menuOpen ? 'open' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>

        <div className="sidebar-header mobile-only">
          <span className="sidebar-title jp">黒月</span>
          <button className="sidebar-close" aria-label="Close menu" onClick={closeMenu}>
            ✕
          </button>
        </div>

        <NavLink to="/products" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
          Products
        </NavLink>

        <NavLink to="/collections" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
          Collections
        </NavLink>

        <NavLink to="/sales" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
          Sales
        </NavLink>

        <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
          About
        </NavLink>

        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
          Home
        </NavLink>

        {isAdmin && (
          <NavLink to="/Orders" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
            Orders
          </NavLink>
        )}

        <div className="nav-right mobile-only">
          {user ? (
            <button onClick={() => { handleLogout(); closeMenu(); }}>
              Logout
            </button>
          ) : (
            <Link to="/login" onClick={closeMenu}>
              Login
            </Link>
          )}
        </div>

      </div>

      <div className="nav-right desktop-only">
        {user ? (
          <button onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to="/login">
            Login
          </Link>
        )}
      </div>

      <div className="nav-right">
        <button className="nav-cart-btn" onClick={openCart}>
          CART ({count})
        </button>
      </div>

    </nav>
  );
}