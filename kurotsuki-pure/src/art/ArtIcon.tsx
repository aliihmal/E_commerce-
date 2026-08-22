const icons: Record<string, JSX.Element> = {
  claw: (
    <path
      d="M30 20 L70 20 L60 45 L75 80 L50 65 L25 80 L40 45 Z"
      fill="none"
      stroke="var(--lavender)"
      strokeWidth="2"
    />
  ),
  domain: (
    <g fill="none" stroke="var(--crimson)" strokeWidth="1.5">
      <circle cx="50" cy="35" r="6" fill="var(--crimson)" stroke="none" />
      <circle cx="35" cy="55" r="6" fill="var(--crimson)" stroke="none" />
      <circle cx="65" cy="55" r="6" fill="var(--crimson)" stroke="none" />
      <circle cx="50" cy="70" r="6" fill="var(--crimson)" stroke="none" />
      <path d="M50 35 L35 55 L50 70 L65 55 Z" stroke="var(--grey)" />
    </g>
  ),
  web: (
    <g stroke="var(--bone)" strokeWidth="1" fill="none">
      <line x1="50" y1="15" x2="50" y2="55" />
      <circle cx="50" cy="65" r="7" strokeWidth="1.5" />
      <path d="M42 60 L58 60 M45 70 L38 78 M55 70 L62 78" />
    </g>
  ),
  bolt: (
    <g stroke="var(--bone)" strokeWidth="2" fill="none">
      <path d="M30 30 Q50 15 70 30" />
      <circle cx="35" cy="45" r="3" fill="var(--bone)" stroke="none" />
      <circle cx="65" cy="45" r="3" fill="var(--bone)" stroke="none" />
      <path d="M25 70 Q50 90 75 70" />
    </g>
  ),
  moon: (
    <g>
      <circle cx="50" cy="50" r="34" fill="var(--bone)" opacity="0.95" />
      <circle cx="62" cy="42" r="30" fill="var(--bg)" />
    </g>
  ),
  flame: (
    <path
      d="M50 15 C35 35 30 50 40 65 C40 55 46 50 50 45 C54 55 62 58 60 72 C75 62 72 40 50 15 Z"
      fill="none"
      stroke="var(--crimson)"
      strokeWidth="2"
    />
  ),
  eye: (
    <g stroke="var(--lavender)" strokeWidth="1.5" fill="none">
      <path d="M15 50 Q50 20 85 50 Q50 80 15 50 Z" />
      <circle cx="50" cy="50" r="12" fill="var(--lavender)" stroke="none" />
    </g>
  ),
};

export const ART_KEYS = Object.keys(icons);

export default function ArtIcon({ artKey = 'moon' }: { artKey?: string }) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {icons[artKey] || icons.moon}
    </svg>
  );
}
