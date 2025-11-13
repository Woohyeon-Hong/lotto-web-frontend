import { TrendingUp, Award, DollarSign, Hash } from 'lucide-react';

type Page = 'home' | 'purchase' | 'purchase-result' | 'purchase-history' | 'winning' | 'statistics';

interface StatisticsProps {
  onNavigate: (page: Page) => void;
}

// Mock 통계 데이터
const mockStats = {
  totalPurchases: 25,
  totalAmount: 50000,
  totalPrize: 15000,
  returnRate: 30.0,
  ranks: {
    'FIRST': 0,
    'SECOND': 0,
    'THIRD': 0,
    'FOURTH': 2,
    'FIFTH': 5,
    'NONE': 18
  },
  mostFrequentNumbers: [
    { number: 7, count: 8 },
    { number: 23, count: 7 },
    { number: 34, count: 6 },
    { number: 12, count: 6 },
    { number: 41, count: 5 },
    { number: 15, count: 5 }
  ]
};

// 로또 번호 색상
const getBallColor = (number: number): string => {
  if (number <= 10) return '#FFB800';
  if (number <= 20) return '#00D9C0';
  if (number <= 30) return '#FF6B6B';
  if (number <= 40) return '#999999';
  return '#8B5CF6';
};

export function Statistics({ onNavigate }: StatisticsProps) {
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
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>📊</div>
        <h1 style={{ color: 'white', marginBottom: '8px' }}>통계</h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
          로또 구매 및 당첨 통계를 확인하세요
        </p>
      </header>

      <div style={{ padding: '20px' }}>
        {mockStats.totalPurchases === 0 ? (
          /* 통계가 없을 때 */
          <div style={{
            backgroundColor: 'white',
            padding: '48px 24px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📈</div>
            <h3 style={{ marginBottom: '8px', color: '#191919' }}>통계가 없습니다</h3>
            <p style={{ color: '#767676', fontSize: '0.875rem', marginBottom: '24px' }}>
              로또를 구매하면 통계가 집계됩니다
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
            {/* 전체 요약 */}
            <div style={{
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <TrendingUp style={{ width: '20px', height: '20px', color: '#00D9C0' }} />
                <h3 style={{ fontSize: '1rem', margin: 0 }}>전체 요약</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                <StatCard
                  icon={<Hash style={{ width: '20px', height: '20px' }} />}
                  iconColor="#00D9C0"
                  label="총 구매 횟수"
                  value={`${mockStats.totalPurchases}회`}
                />
                <StatCard
                  icon={<DollarSign style={{ width: '20px', height: '20px' }} />}
                  iconColor="#8B5CF6"
                  label="총 구매 금액"
                  value={`${mockStats.totalAmount.toLocaleString()}원`}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                <StatCard
                  icon={<Award style={{ width: '20px', height: '20px' }} />}
                  iconColor="#FFB800"
                  label="총 당첨 금액"
                  value={`${mockStats.totalPrize.toLocaleString()}원`}
                />
                <StatCard
                  icon={<TrendingUp style={{ width: '20px', height: '20px' }} />}
                  iconColor={mockStats.returnRate >= 100 ? '#00D9C0' : '#FF6B6B'}
                  label="평균 수익률"
                  value={`${mockStats.returnRate.toFixed(1)}%`}
                />
              </div>

              {/* 손익 */}
              <div style={{
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: mockStats.totalPrize > mockStats.totalAmount ? '#F0FDF4' : '#FFF1F0',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#767676', marginBottom: '4px' }}>
                  {mockStats.totalPrize > mockStats.totalAmount ? '총 수익' : '총 손실'}
                </div>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700',
                  color: mockStats.totalPrize > mockStats.totalAmount ? '#00D9C0' : '#FF6B6B'
                }}>
                  {mockStats.totalPrize > mockStats.totalAmount ? '+' : '-'}
                  {Math.abs(mockStats.totalPrize - mockStats.totalAmount).toLocaleString()}원
                </div>
              </div>
            </div>

            {/* 등수별 당첨 통계 */}
            <div style={{
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '16px'
            }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>등수별 당첨 통계</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <RankStatRow 
                  rank="1등" 
                  count={mockStats.ranks.FIRST} 
                  total={mockStats.totalPurchases}
                  color="#FFB800"
                />
                <RankStatRow 
                  rank="2등" 
                  count={mockStats.ranks.SECOND} 
                  total={mockStats.totalPurchases}
                  color="#00D9C0"
                />
                <RankStatRow 
                  rank="3등" 
                  count={mockStats.ranks.THIRD} 
                  total={mockStats.totalPurchases}
                  color="#8B5CF6"
                />
                <RankStatRow 
                  rank="4등" 
                  count={mockStats.ranks.FOURTH} 
                  total={mockStats.totalPurchases}
                  color="#FF6B6B"
                />
                <RankStatRow 
                  rank="5등" 
                  count={mockStats.ranks.FIFTH} 
                  total={mockStats.totalPurchases}
                  color="#999999"
                />
                <RankStatRow 
                  rank="낙첨" 
                  count={mockStats.ranks.NONE} 
                  total={mockStats.totalPurchases}
                  color="#E5E5E5"
                />
              </div>

              {/* 당첨률 */}
              <div style={{
                marginTop: '16px',
                padding: '16px',
                backgroundColor: '#FAFAFA',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#767676', marginBottom: '4px' }}>
                  전체 당첨률
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#00D9C0' }}>
                  {(((mockStats.totalPurchases - mockStats.ranks.NONE) / mockStats.totalPurchases) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* 자주 나온 번호 */}
            <div style={{
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              borderRadius: '16px',
              padding: '20px'
            }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>자주 나온 번호 (Top 6)</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {mockStats.mostFrequentNumbers.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      backgroundColor: '#FAFAFA',
                      borderRadius: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#767676',
                        minWidth: '24px'
                      }}>
                        {index + 1}위
                      </div>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: getBallColor(item.number),
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '600',
                          fontSize: '1rem'
                        }}
                      >
                        {item.number}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ fontSize: '0.875rem', color: '#767676' }}>
                        {item.count}회 출현
                      </span>
                      <div style={{
                        width: '60px',
                        height: '6px',
                        backgroundColor: '#E5E5E5',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${(item.count / mockStats.totalPurchases) * 100}%`,
                          height: '100%',
                          backgroundColor: '#00D9C0',
                          borderRadius: '3px'
                        }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#F0FDF4',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '0.8125rem', color: '#767676', margin: 0 }}>
                  💡 자주 나온 번호는 참고용이며, 실제 당첨 확률과는 무관합니다
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  iconColor: string;
  label: string;
  value: string;
}

function StatCard({ icon, iconColor, label, value }: StatCardProps) {
  return (
    <div style={{
      padding: '16px',
      backgroundColor: '#FAFAFA',
      borderRadius: '8px'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '6px',
        marginBottom: '8px',
        color: iconColor
      }}>
        {icon}
      </div>
      <div style={{ fontSize: '0.8125rem', color: '#767676', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontWeight: '700', fontSize: '1.125rem', color: '#191919' }}>
        {value}
      </div>
    </div>
  );
}

interface RankStatRowProps {
  rank: string;
  count: number;
  total: number;
  color: string;
}

function RankStatRow({ rank, count, total, color }: RankStatRowProps) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div style={{
      padding: '12px',
      backgroundColor: '#FAFAFA',
      borderRadius: '8px'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: color
          }} />
          <span style={{ fontSize: '0.875rem', color: '#191919' }}>{rank}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#191919' }}>
            {count}회
          </span>
          <span style={{ fontSize: '0.8125rem', color: '#767676', minWidth: '50px', textAlign: 'right' }}>
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
      <div style={{
        width: '100%',
        height: '4px',
        backgroundColor: '#E5E5E5',
        borderRadius: '2px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: '2px',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );
}