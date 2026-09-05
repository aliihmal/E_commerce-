import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';

type User = {
  userId?: string;
  id?: string;
  name?: string;
  email?: string;
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

  /*
   * Check authentication with the backend.
   *
   * The backend uses the JWT stored in the cookie:
   *
   * browser
   *    ↓
   * /auth/me
   *    ↓
   * authenticate middleware
   *    ↓
   * token cookie verified
   *    ↓
   * user returned
   */
  useEffect(() => {
    const checkAuthentication = async () => {
      setLoading(true);

      try {
        console.log('🔵 Checking authentication...');

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/me`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        console.log('🟡 /auth/me status:', response.status);

        if (!response.ok) {
          console.log('🔴 User is NOT authenticated');

          setUser(null);
          return;
        }

        const data = await response.json();

        console.log('🟢 /auth/me response:', data);
        console.log('🟢 Authenticated user:', data.user);

        setUser(data.user);

      } catch (error) {
        console.error('🔴 Authentication check failed:', error);

        setUser(null);

      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [location.pathname]);

  /*
   * Prevent scrolling when the mobile sidebar is open.
   */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  /*
   * Logout
   */
  const handleLogout = async () => {
    try {
      console.log('🔵 Logging out...');

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      console.log('🟡 Logout status:', response.status);

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      console.log('🟢 Logout successful');

      // Remove user from React state
      setUser(null);

      // Remove stored user if LoginPage stored it
      sessionStorage.removeItem('user');

      // Close mobile menu
      setMenuOpen(false);

      // Redirect to login
      navigate('/login');

    } catch (error) {
      console.error('🔴 Logout error:', error);
    }
  };

  const isAdmin = user?.role === 'admin';

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="site-nav">

      {/* =========================
          LOGO
      ========================== */}
      <NavLink
        to="/"
        className="logo"
        onClick={closeMenu}
      >
        <span className="display">RANDOM</span>
        <span className="jp">黒月</span>
      </NavLink>


      {/* =========================
          MOBILE MENU BUTTON
      ========================== */}
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


      {/* =========================
          MOBILE OVERLAY
      ========================== */}
      <div
        className={`nav-overlay ${menuOpen ? 'open' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />


      {/* =========================
          NAVIGATION LINKS
      ========================== */}
      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>

        {/* Mobile sidebar header */}
        <div className="sidebar-header mobile-only">
          <span className="sidebar-title jp">
            黒月
          </span>

          <button
            className="sidebar-close"
            aria-label="Close menu"
            onClick={closeMenu}
          >
            ✕
          </button>
        </div>


        {/* Products */}
        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive ? 'active' : ''
          }
          onClick={closeMenu}
        >
          Products
        </NavLink>


        {/* Collections */}
        <NavLink
          to="/collections"
          className={({ isActive }) =>
            isActive ? 'active' : ''
          }
          onClick={closeMenu}
        >
          Collections
        </NavLink>


        {/* Sales */}
        <NavLink
          to="/sales"
          className={({ isActive }) =>
            isActive ? 'active' : ''
          }
          onClick={closeMenu}
        >
          Sales
        </NavLink>


        {/* About */}
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? 'active' : ''
          }
          onClick={closeMenu}
        >
          About
        </NavLink>


        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'active' : ''
          }
          onClick={closeMenu}
        >
          Home
        </NavLink>


        {/* =========================
            ADMIN ONLY
        ========================== */}
        {isAdmin && (
          <NavLink
            to="/Orders"
            className={({ isActive }) =>
              isActive ? 'active' : ''
            }
            onClick={closeMenu}
          >
            Orders
          </NavLink>
        )}


        {/* =========================
            MOBILE LOGIN / LOGOUT
        ========================== */}
        <div className="nav-right mobile-only">

          {!loading && (
            user ? (
              <button
                onClick={handleLogout}
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


      {/* =========================
          DESKTOP LOGIN / LOGOUT
      ========================== */}
      <div className="nav-right desktop-only">

        {!loading && (
          user ? (
            <button
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
            >
              Login
            </Link>
          )
        )}

      </div>


      {/* =========================
          CART
      ========================== */}
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
