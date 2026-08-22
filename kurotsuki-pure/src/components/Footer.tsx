import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer" id="footer">
      <div>
        <div className="brand display">
          KUROTSUKI
          <span className="jp">黒月 — Black Moon</span>
        </div>
      </div>
      <div>
        <h5>Shop</h5>
        <ul>
          <li><Link to="/products">All Products</Link></li>
          <li><Link to="/collections">Collections</Link></li>
          <li><Link to="/sales">Sales</Link></li>
        </ul>
      </div>
      <div>
        <h5>Info</h5>
        <ul>
          <li><Link to="/about">About</Link></li>
        </ul>
      </div>
      <div>
        <h5>Follow</h5>
        <ul>
          <li><a href="#">Instagram</a></li>
          <li><a href="#">TikTok</a></li>
          <li><a href="#">Email List</a></li>
        </ul>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} KUROTSUKI. Fan-inspired designs, independently made.</span>
        <span>Baabda, Lebanon</span>
      </div>
    </footer>
  );
}
