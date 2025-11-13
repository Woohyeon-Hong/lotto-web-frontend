import { Wallet, ListChecks, Award, History } from 'lucide-react';

type Page = 'home' | 'purchase' | 'purchase-result' | 'purchase-history' | 'winning' | 'statistics';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

export function Home({ onNavigate }: HomeProps) {
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#FAFAFA',
      paddingBottom: '80px'
    }}>
      {/* 히어로 섹션 */}
      <div style={{
        background: 'linear-gradient(135deg, #00D9C0 0%, #00C0AA 100%)',
        padding: '48px 20px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '16px'
        }}>
          🎰
        </div>
        <h1 style={{ 
          color: 'white', 
          marginBottom: '12px',
          fontSize: '1.75rem',
          lineHeight: '1.4'
        }}>
          로또 시뮬레이터
        </h1>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.95)',
          lineHeight: '1.6',
          fontSize: '0.9375rem'
        }}>
          금액을 입력하면 자동으로 로또를 발행하고,<br />
          당첨 번호를 입력해 결과를 확인할 수 있습니다.
        </p>
      </div>

      {/* 메인 컨텐츠 */}
      <div style={{ padding: '20px' }}>
        {/* 시작하기 버�� */}
        <button
          onClick={() => onNavigate('purchase')}
          style={{
            width: '100%',
            padding: '18px',
            backgroundColor: 'white',
            color: '#00D9C0',
            border: '2px solid #00D9C0',
            borderRadius: '16px',
            fontSize: '1.0625rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            marginBottom: '32px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #00D9C0 0%, #00C0AA 100%)';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.borderColor = '#00D9C0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = '#00D9C0';
            e.currentTarget.style.borderColor = '#00D9C0';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.98)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          로또 구매하기
          <span>→</span>
        </button>

        {/* 이용 안내 */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            textAlign: 'center',
            marginBottom: '8px',
            color: '#191919'
          }}>이용 안내</h2>
          <p style={{
            textAlign: 'center',
            color: '#767676',
            fontSize: '0.875rem',
            marginBottom: '24px'
          }}>
            간단한 4단계로 로또 시뮬레이션을 경험해보세요
          </p>

          {/* 4단계 그리드 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            <StepCard
              number="1"
              numberBgColor="#00D9C0"
              icon={<Wallet style={{ width: '24px', height: '24px' }} />}
              iconBgColor="rgba(0, 217, 192, 0.1)"
              iconColor="#00D9C0"
              title="금액 입력"
              description="원하는 금액을 입력해 로또를 구매합니다."
            />
            <StepCard
              number="2"
              numberBgColor="#8B5CF6"
              icon={<ListChecks style={{ width: '24px', height: '24px' }} />}
              iconBgColor="rgba(139, 92, 246, 0.1)"
              iconColor="#8B5CF6"
              title="번호 확인"
              description="자동으로 발행된 로또 번호를 확인합니다."
            />
            <StepCard
              number="3"
              numberBgColor="#FFB800"
              icon={<Award style={{ width: '24px', height: '24px' }} />}
              iconBgColor="rgba(255, 184, 0, 0.1)"
              iconColor="#FFB800"
              title="당첨 확인"
              description="당첨 번호를 입력해 결과를 확인합니다."
            />
            <StepCard
              number="4"
              numberBgColor="#FF6B6B"
              icon={<History style={{ width: '24px', height: '24px' }} />}
              iconBgColor="rgba(255, 107, 107, 0.1)"
              iconColor="#FF6B6B"
              title="내역 조회"
              description="최근 발행 내역을 확인할 수 있습니다."
            />
          </div>
        </div>

        {/* 로또 시뮬레이터 안내 */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}>
          <p style={{
            color: '#999',
            fontSize: '0.8125rem',
            lineHeight: '1.5',
            margin: 0
          }}>
            이 서비스는 로또 구매 및 당첨 확인을 시뮬레이션하는 웹 애플리케이션입니다.<br />
            실제 로또 구매 및 당첨 지급과는 무관합니다.
          </p>
        </div>
      </div>
    </div>
  );
}

interface StepCardProps {
  number: string;
  numberBgColor: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  title: string;
  description: string;
}

function StepCard({ number, numberBgColor, icon, iconBgColor, iconColor, title, description }: StepCardProps) {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      position: 'relative'
    }}>
      {/* 숫자 뱃지 */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: numberBgColor,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1rem',
        fontWeight: '600'
      }}>
        {number}
      </div>

      {/* 아이콘 */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        backgroundColor: iconBgColor,
        color: iconColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {icon}
      </div>

      {/* 내용 */}
      <div style={{ marginTop: '56px' }}>
        <h3 style={{ marginBottom: '8px', fontSize: '1rem' }}>{title}</h3>
        <p style={{
          fontSize: '0.8125rem',
          color: '#767676',
          lineHeight: '1.5',
          margin: 0
        }}>
          {description}
        </p>
      </div>
    </div>
  );
}