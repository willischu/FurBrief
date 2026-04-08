export default function CatSvg({ size = 100 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <circle cx="50" cy="54" r="44" fill="#FAE0B8" stroke="#ECC888" strokeWidth="2" />
      <polygon points="11,22 23,3 35,22" fill="#FAE0B8" stroke="#ECC888" strokeWidth="2" />
      <polygon points="15,21 23,9 32,21" fill="#ECC888" />
      <polygon points="65,22 77,3 89,22" fill="#FAE0B8" stroke="#ECC888" strokeWidth="2" />
      <polygon points="68,21 77,9 86,21" fill="#ECC888" />
      <path d="M22 18 Q26 22 24 28" fill="none" stroke="#E0A858" strokeWidth="1.5" opacity="0.4" />
      <path d="M28 15 Q30 20 28 26" fill="none" stroke="#E0A858" strokeWidth="1.5" opacity="0.4" />
      <path d="M72 18 Q76 22 74 28" fill="none" stroke="#E0A858" strokeWidth="1.5" opacity="0.4" />
      <path d="M78 15 Q80 20 78 26" fill="none" stroke="#E0A858" strokeWidth="1.5" opacity="0.4" />
      <ellipse cx="33" cy="50" rx="9" ry="10" fill="#3A2010" />
      <ellipse cx="33" cy="50" rx="5" ry="7" fill="#C47810" />
      <ellipse cx="33" cy="50" rx="2.5" ry="5" fill="#1A0C04" />
      <circle cx="36" cy="45" r="3" fill="white" />
      <circle cx="37.5" cy="43.5" r="1.3" fill="white" />
      <ellipse cx="67" cy="50" rx="9" ry="10" fill="#3A2010" />
      <ellipse cx="67" cy="50" rx="5" ry="7" fill="#C47810" />
      <ellipse cx="67" cy="50" rx="2.5" ry="5" fill="#1A0C04" />
      <circle cx="70" cy="45" r="3" fill="white" />
      <circle cx="71.5" cy="43.5" r="1.3" fill="white" />
      <ellipse cx="18" cy="63" rx="12" ry="7.5" fill="#FFB3CF" opacity="0.45" />
      <ellipse cx="82" cy="63" rx="12" ry="7.5" fill="#FFB3CF" opacity="0.45" />
      <ellipse cx="50" cy="62" rx="5" ry="3.5" fill="#E8A070" />
      <path d="M44 67 Q50 74 56 67" fill="none" stroke="#C4714F" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="1" y1="58" x2="27" y2="61" stroke="#C49050" strokeWidth="1" opacity="0.35" />
      <line x1="1" y1="64" x2="27" y2="64" stroke="#C49050" strokeWidth="1" opacity="0.35" />
      <line x1="73" y1="61" x2="99" y2="58" stroke="#C49050" strokeWidth="1" opacity="0.35" />
      <line x1="73" y1="64" x2="99" y2="64" stroke="#C49050" strokeWidth="1" opacity="0.35" />
    </svg>
  );
}
