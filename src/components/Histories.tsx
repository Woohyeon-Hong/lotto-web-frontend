import { FileText, Calendar, ChevronDown, ChevronUp, Ticket } from 'lucide-react';
import { useState } from 'react';

type Page = 'home' | 'purchase' | 'purchase-result' | 'purchase-history' | 'winning' | 'statistics';

interface HistoriesProps {
  onNavigate: (page: Page) => void;
}

// Mock 데이터
interface LottoTicket {
  id: number;
  numbers: number[];
  purchaseDate: string;
  amount: number;
  ticketCount: number;
}

const mockHistories: LottoTicket[] = [
  {
    id: 1,
    numbers: 12345,
    purchaseDate: '2025-11-13 14:30',
    amount: 5000,
    ticketCount: 5
  },
  {
    id: 2,
    numbers: 12344,
    purchaseDate: '2025-11-12 10:15',
    amount: 10000,
    ticketCount: 10
  },
  {
    id: 3,
    numbers: 12343,
    purchaseDate: '2025-11-11 16:45',
    amount: 3000,
    ticketCount: 3
  }
];

// 로또 번호 색상
const getBallColor = (number: number): string => {
  if (number <= 10) return '#FFB800'; // 노란색
  if (number <= 20) return '#00D9C0'; // 민트색
  if (number <= 30) return '#FF6B6B'; // 빨간색
  if (number <= 40) return '#999999'; // 회색
  return '#8B5CF6'; // 보라색
};

export function Histories({ onNavigate }: HistoriesProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#FAFAFA',
      paddingBottom: '80px'
    }}>
      {/* 헤더 */}
      <header style={{
        background: 'linear-gradient(135deg, #00D9C0 0%, #00C0AA 100%)',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
        <h1 style={{ color: 'white', marginBottom: '8px' }}>발행 내역</h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
          구매한 로또 내역을 확인하세요
        </p>
      </header>

      <div style={{ padding: '20px' }}>
        {/* 통계 요약 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <SummaryCard
            label="총 구매 금액"
            value={`${mockHistories.reduce((sum, h) => sum + h.amount, 0).toLocaleString()}원`}
            icon="💰"
          />
          <SummaryCard
            label="총 발행 장수"
            value={`${mockHistories.reduce((sum, h) => sum + h.ticketCount, 0)}장`}
            icon="🎟️"
          />
        </div>

        {/* 내역이 없을 때 */}
        {mockHistories.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            padding: '48px 24px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <h3 style={{ marginBottom: '8px', color: '#191919' }}>발행 내역이 없습니다</h3>
            <p style={{ color: '#767676', fontSize: '0.875rem', marginBottom: '24px' }}>
              로또를 구매하면 여기에 표시됩니다
            </p>
            <button
              onClick={() => onNavigate('purchase')}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #00D9C0 0%, #00C0AA 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              로또 구매하기
            </button>
          </div>
        ) : (
          <>
            {/* 내역 제목 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <h2 style={{ fontSize: '1.125rem', color: '#191919' }}>구매 내역</h2>
              <span style={{ fontSize: '0.875rem', color: '#767676' }}>
                총 {mockHistories.length}건
              </span>
            </div>

            {/* 내역 리스트 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {mockHistories.map((history) => (
                <HistoryCard
                  key={history.id}
                  history={history}
                  isExpanded={expandedId === history.id}
                  onToggle={() => toggleExpand(history.id)}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
  icon: string;
}

function SummaryCard({ label, value, icon }: SummaryCardProps) {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '0.8125rem', color: '#767676', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontWeight: '700', fontSize: '1.125rem', color: '#191919' }}>
        {value}
      </div>
    </div>
  );
}

interface HistoryCardProps {
  history: LottoTicket;
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate: (page: Page) => void;
}

function HistoryCard({ history, isExpanded, onToggle, onNavigate }: HistoryCardProps) {
  // Mock: 실제로는 서버에서 각 회차별 번호를 가져와야 함
  const mockLottoNumbers = Array.from({ length: history.ticketCount }, (_, i) => ({
    gameId: history.numbers + i,
    numbers: generateRandomNumbers(),
    bonusNumber: Math.floor(Math.random() * 45) + 1
  }));

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden'
    }}>
      {/* 헤더 */}
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '20px',
          border: 'none',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar style={{ width: '16px', height: '16px', color: '#767676' }} />
            <span style={{ fontSize: '0.875rem', color: '#767676' }}>
              {history.purchaseDate}
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp style={{ width: '20px', height: '20px', color: '#767676' }} />
          ) : (
            <ChevronDown style={{ width: '20px', height: '20px', color: '#767676' }} />
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Ticket style={{ width: '16px', height: '16px', color: '#00D9C0' }} />
              <span style={{ fontWeight: '600', fontSize: '1rem', color: '#191919' }}>
                {history.ticketCount}장 구매
              </span>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#999' }}>
              게임 #{history.numbers} ~ #{history.numbers + history.ticketCount - 1}
            </div>
          </div>
          <div style={{ 
            fontSize: '1.125rem', 
            fontWeight: '700', 
            color: '#00D9C0' 
          }}>
            {history.amount.toLocaleString()}원
          </div>
        </div>
      </button>

      {/* 확장된 내용 */}
      {isExpanded && (
        <div style={{
          padding: '0 20px 20px 20px',
          borderTop: '1px solid #F0F0F0'
        }}>
          <div style={{ paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mockLottoNumbers.map((lotto, index) => (
              <div
                key={index}
                style={{
                  padding: '16px',
                  backgroundColor: '#FAFAFA',
                  borderRadius: '8px'
                }}
              >
                <div style={{ 
                  fontSize: '0.8125rem', 
                  color: '#767676', 
                  marginBottom: '8px' 
                }}>
                  게임 #{lotto.gameId}
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  flexWrap: 'wrap'
                }}>
                  {lotto.numbers.map((num, i) => (
                    <div
                      key={i}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: getBallColor(num),
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '600',
                        fontSize: '0.875rem'
                      }}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('winning')}
            style={{
              width: '100%',
              marginTop: '16px',
              padding: '12px',
              background: 'linear-gradient(135deg, #00D9C0 0%, #00C0AA 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            당첨 확인하기
          </button>
        </div>
      )}
    </div>
  );
}

// 랜덤 로또 번호 생성 (1~45 중 6개)
function generateRandomNumbers(): number[] {
  const numbers = new Set<number>();
  while (numbers.size < 6) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}