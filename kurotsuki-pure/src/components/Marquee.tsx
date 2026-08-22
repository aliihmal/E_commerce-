const items = [
  { text: 'NEW DROP: ZENIN CLAN', jp: '壱・弐・参' },
  { text: 'LIMITED RUN — 200 UNITS', jp: '限定' },
  { text: 'FREE SHIPPING OVER $75', jp: '送料無料' },
];

export default function Marquee() {
  const track = [...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {track.map((item, i) => (
          <span key={i} className={i % 2 === 1 ? '' : ''}>
            {item.text}
            <span className="jp"> {item.jp}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
