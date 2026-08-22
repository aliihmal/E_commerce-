import { Link } from 'react-router-dom';
import ArtIcon from '../art/ArtIcon';
import type { Product } from '../pages/ProductsPage';
import { StaggerItem } from './Reveal';

export default function ProductCard({ product, index }: { product: Product; index?: number }) {
  return (
    <StaggerItem className="card">
      {typeof index === 'number' && <span className="card-num mono">{String(index + 1).padStart(2, '0')}</span>}
      {product.onSale && <span className="sale-tag">-{product.discountPercent}%</span>}
      <Link to={`/products/${product.id}`} style={{ display: 'contents' }}>
        <div className="card-visual">
          <img id='productimgesss' src={product.imgSrc}/>
        </div>
        <div className="card-info">
          
          <div className="card-price mono">
            {product.onSale && <span className="was">${product.price}</span>}
            ${product.salePrice ?? product.price}
          </div>
        </div>
      </Link>
    </StaggerItem>
  );
}
