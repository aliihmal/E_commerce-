import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';

type User = {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: string;
};

export default function Navbar() {
  const { count, openCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // Check if the user is logged in
  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);

      // First check sessionStorage
      const storedUser = sessionStorage.getItem('user');

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          sessionStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null);
      }

      // Then verify the authentication with the backend
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/me`,
          {
            credentials: 'include',
          }
        );

        if (!response.ok) {
          // Backend says user is not authenticated
          setUser(null);
          sessionStorage.removeItem('user');
          return;
        }

        const data = await response.json();

        // Update user from backend
        setUser(data.user);

        // Keep sessionStorage synchronized
        sessionStorage.setItem('user', JSON.stringify(data.user));

      } catch (error) {
        console.error('Authentication check failed:', error);

        // If backend cannot be reached, keep the sessionStorage user
        // if one exists.
        const stored = sessionStorage.getItem('user');

        if (!stored) {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [location.pathname]);

  // Lock body scroll while sidebar is open on mobile
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
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Remove the user from React state
      setUser(null);

      // Remove the stored user
      sessionStorage.removeItem('user');

      // Go to login page
      navigate('/login');

    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAdmin = user?.role === 'admin';

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="site-nav">

      {/* LOGO */}
      <NavLink to="/" className="logo" onClick={closeMenu}>
        <span className="display">RANDOM</span>
        <span className="jp">黒月</span>
      </NavLink>

      {/* MOBILE MENU BUTTON */}
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

      {/* OVERLAY */}
      <div
        className={`nav-overlay ${menuOpen ? 'open' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* NAV LINKS */}
      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>

        <div className="sidebar-header mobile-only">
          <span className="sidebar-title jp">黒月</span>

          <button
            className="sidebar-close"
            aria-label="Close menu"
            onClick={closeMenu}
          >
            ✕
          </button>
        </div>

        <NavLink
          to="/products"
          className={({ isActive }) => (isActive ? 'active' : '')}
          onClick={closeMenu}
        >
          Products
        </NavLink>

        <NavLink
          to="/collections"
          className={({ isActive }) => (isActive ? 'active' : '')}
          onClick={closeMenu}
        >
          Collections
        </NavLink>

        <NavLink
          to="/sales"
          className={({ isActive }) => (isActive ? 'active' : '')}
          onClick={closeMenu}
        >
          Sales
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? 'active' : '')}
          onClick={closeMenu}
        >
          About
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'active' : '')}
          onClick={closeMenu}
        >
          Home
        </NavLink>

        {/* ADMIN ONLY */}
        {isAdmin && (
          <NavLink
            to="/Orders"
            className={({ isActive }) => (isActive ? 'active' : '')}
            onClick={closeMenu}
          >
            Orders
          </NavLink>
        )}

        {/* MOBILE LOGIN / LOGOUT */}
        <div className="nav-right mobile-only">
          {!loading && (
            user ? (
              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
              >
                Login
              </Link>
            )
          )}
        </div>

      </div>

      {/* DESKTOP LOGIN / LOGOUT */}
      <div className="nav-right desktop-only">
        {!loading && (
          user ? (
            <button onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login">
              Login
            </Link>
          )
        )}
      </div>

      {/* CART */}
      <div className="nav-right">
        <button
          className="nav-cart-btn"
          onClick={openCart}
        >
          CART ({count})
        </button>
      </div>

    </nav>
  );
}
