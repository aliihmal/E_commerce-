import Reveal from '../components/Reveal';

export default function AboutPage() {
  return (
    <div className="page-wrap">
      <div className="page-hero">
        <Reveal>
          <div className="eyebrow">黒月 — Black Moon</div>
          <h1 className="display">About RANDOM</h1>
          <p>Anime-inspired streetwear, screen-printed in small batches, built to be worn every day.</p>
        </Reveal>
      </div>

      <section className="split">
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
                  RANDOM started as a way to give the scenes that stuck with us a second life — not as a
                  filtered screenshot on a cheap tee, but as proper linework, redrawn by hand and printed on
                  fabric that lasts. We don't chase every license or every season. We pick the arcs that mean
                  something and build small runs around them.
                </p>
                <ul>
                  <li><span className="jp">壱</span> Line-art traced by hand, not filtered from a screenshot</li>
                  <li><span className="jp">弐</span> Puff-print and embroidery options on select drops</li>
                  <li><span className="jp">参</span> Small batches — once a run sells out, it's gone</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="block" id="detail">
        <Reveal>
          <div className="section-head">
            <h2 className="display">The Build</h2>
            <div className="tag">
              <span className="jp">素材</span>Materials
            </div>
          </div>
        </Reveal>
        <div className="detail-grid">
          <Reveal delay={0.05}>
            <div className="detail-card">
              <div className="n mono">01 — WEIGHT</div>
              <h4>Heavyweight cotton</h4>
              <p>240gsm tees, 380gsm fleece hoodies. Enough structure to hold a print crisp through a hundred washes.</p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="detail-card">
              <div className="n mono">02 — PRINT</div>
              <h4>Screen &amp; puff-print</h4>
              <p>Water-based inks on tees, raised puff-print on select hoodie graphics for texture you can feel.</p>
            </div>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="detail-card">
              <div className="n mono">03 — FIT</div>
              <h4>Relaxed, boxy cut</h4>
              <p>Dropped shoulder, true-to-size body. Sized up half a size if you like it oversized.</p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
