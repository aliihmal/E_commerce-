import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const climberY = useTransform(scrollY, [0, 600], [300, 210]);

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="hero-sky" style={{ position: 'relative' }}>
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        >
          <defs>
            <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f2f0ec" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#a99bd9" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#a99bd9" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="720" cy="260" r="240" fill="url(#moonGlow)" />
          <g opacity="0.55" fill="#0a0a0d">
            <ellipse cx="0" cy="620" rx="420" ry="140" />
            <ellipse cx="380" cy="700" rx="520" ry="160" />
            <ellipse cx="1000" cy="680" rx="520" ry="150" />
            <ellipse cx="1440" cy="640" rx="420" ry="140" />
          </g>
        </svg>

        <img
          src="/realLogo.png"
          alt="Kurotsuki logo"
          style={{
            position: 'absolute',
            left: '50%',
            top: '28.9%',
            transform: 'translate(-50%, -50%)',
            width: 210,
            height: 'auto',
            background:"white",
            borderRadius:100,
          }}
        />

        <motion.div
          style={{
            position: 'absolute',
            left: '48.3%',
            top: '33%',
            y: useTransform(climberY, (v) => v - 300),
          }}
        >
          <svg width="20" height="60" viewBox="0 0 20 60" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 0 L4 14 L-2 26 L6 40 L-2 55"
              stroke="#0a0a0d"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="0" cy="-8" r="6" fill="#0a0a0d" />
          </svg>
        </motion.div>
      </div>

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.2, 0.7, 0.3, 1] }}
      >
        <div className="eyebrow">Anime-inspired streetwear</div>
        <h1 className="display">KUROTSUKI</h1>
        <p className="sub">
          Line-art built from the moments that mattered. Screen-printed on heavyweight cotton, one arc at a time.
        </p>
      </motion.div>
      <div className="scroll-cue">
        <span>Scroll</span>
        <span className="bar" />
      </div>
    </section>
  );
}