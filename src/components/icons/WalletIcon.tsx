export function WalletIcon() {
    return (
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'inline-block' }}
      >
        <circle cx="16" cy="16" r="16" fill="#00D9C0" opacity="0.1" />
        {/* 동전 1 */}
        <circle cx="13" cy="14" r="5" stroke="#00D9C0" strokeWidth="1.5" fill="none" />
        <text 
          x="13" 
          y="14" 
          textAnchor="middle" 
          dominantBaseline="central" 
          fill="#00D9C0" 
          fontSize="8" 
          fontWeight="700"
        >
          ₩
        </text>
        {/* 동전 2 */}
        <circle cx="19" cy="18" r="5" stroke="#00D9C0" strokeWidth="1.5" fill="white" />
        <text 
          x="19" 
          y="18" 
          textAnchor="middle" 
          dominantBaseline="central" 
          fill="#00D9C0" 
          fontSize="8" 
          fontWeight="700"
        >
          ₩
        </text>
      </svg>
    );
  }