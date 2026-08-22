import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import ProductCard from '../components/ProductCard';
import Reveal, { StaggerGrid } from '../components/Reveal';
import { PRODUCTS } from '../data/dummyData';

export default function HomePage() {
  const featured = PRODUCTS.slice(0, 4);

  return (
    <>
      <Hero />
      <Marquee />

      <section className="block" id="drops">
        <Reveal>
          <div className="section-head">
            <h2 className="display">Current Drop</h2>
            <div className="tag">
              <span className="jp">今週の柄</span>This week's prints
            </div>
          </div>
        </Reveal>


        <Reveal delay={0.1}>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/products" className="btn btn-outline">View All Products</Link>
          </div>
        </Reveal>
      </section>

      <section className="split" id="lore">
        <div className="block">
          <div className="split-grid">
            <Reveal className="split-moon">
              <svg viewBox="0 0 300 300" width="100%" style={{ maxWidth: 320 }}>
                <circle cx="150" cy="150" r="150" fill="#171320" />
                <circle cx="150" cy="150" r="95" fill="#f2f0ec" />
                <circle cx="150" cy="150" r="95" fill="none" stroke="#a99bd9" strokeWidth="1" opacity="0.4" />
                <path
                  d="M150 60 L156 100 L148 130 L158 165 L146 195"
                  stroke="#0a0a0d"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </Reveal>
            <Reveal delay={0.15}>
              <div>
                <h3>Every print carries a reference.</h3>
                <p>
                  We don't design in a vacuum — every graphic starts with a scene, a line, a fight worth
                  remembering. The linework stays close to the source; the fit and fabric are built for
                  wearing every day, not just the con floor.
                </p>
                <ul>
                  <li><span className="jp">壱</span> Line-art traced by hand, not filtered from a screenshot</li>
                  <li><span className="jp">弐</span> Puff-print and embroidery options on select drops</li>
                  <li><span className="jp">参</span> Small batches — once a run sells out, it's gone</li>
                </ul>
                <div style={{ marginTop: 28 }}>
                  <Link to="/about" className="btn btn-outline btn-sm">Read Our Story</Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
