export function LottoLogo() {
    return (
      <svg 
        width="80" 
        height="80" 
        viewBox="0 0 80 80" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'inline-block' }}
      >
        {/* 흰색 원형 배경 */}
        <circle cx="40" cy="40" r="38" fill="white" />
        
        {/* 로또 공 3개를 간단하게 표현 */}
        <circle cx="25" cy="40" r="8" fill="#00D9C0" />
        <circle cx="40" cy="40" r="8" fill="#FFB800" />
        <circle cx="55" cy="40" r="8" fill="#FF6B6B" />
      </svg>
    );
  }