import { TrendingUp, Award, DollarSign, Hash, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getStatistics, getPurchases } from '../api/lottos';
import type { ExpectedStatistics } from '../api/types';

type Page = 'home' | 'purchase' | 'purchase-result' | 'purchase-history' | 'winning' | 'statistics';

interface StatisticsProps {
  onNavigate: (page: Page) => void;
}

// 로또 번호 색상
const getBallColor = (number: number): string => {
  if (number <= 10) return '#FFB800';
  if (number <= 20) return '#00D9C0';
  if (number <= 30) return '#FF6B6B';
  if (number <= 40) return '#999999';
  return '#8B5CF6';
};

export function Statistics({ onNavigate }: StatisticsProps) {
  const [statistics, setStatistics] = useState<ExpectedStatistics | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalPrize, setTotalPrize] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const statsData = await getStatistics();
        setStatistics(statsData);

        const purchasesData = await getPurchases();
        const total = purchasesData.purchases.reduce((sum, p) => sum + p.purchaseAmount, 0);
        setTotalAmount(total);

        const prize = purchasesData.purchases
          .filter(p => p.hasResult && p.returnRate !== null)
          .reduce((sum, p) => {
            const rate = p.returnRate || 0;
            return sum + (p.purchaseAmount * rate / 100);
          }, 0);
        setTotalPrize(prize);
      } catch (e: any) {
        setError(e.message || '통계를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const rankMap: { [key: string]: { label: string; color: string } } = {
    'FIRST': { label: '1등', color: '#FFB800' },
    'SECOND': { label: '2등', color: '#00D9C0' },
    'THIRD': { label: '3등', color: '#8B5CF6' },
    'FOURTH': { label: '4등', color: '#FF6B6B' },
    'FIFTH': { label: '5등', color: '#999999' },
  };

  const rankCounts = statistics?.accumulatedRankCounts || [];
  const rankMapCounts: { [key: string]: number } = {};
  rankCounts.forEach(rc => {
    rankMapCounts[rc.rank] = rc.count;
  });

  const totalWins = rankCounts.reduce((sum, rc) => sum + rc.count, 0);
  const totalSamples = statistics?.totalSamples || 0;
  const noneCount = Math.max(0, totalSamples - totalWins);

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#FAFAFA',
      paddingBottom: '80px'
    }}>
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
        {isLoading ? (
          <div style={{
            backgroundColor: 'white',
            padding: '48px 24px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}>
            <div style={{ fontSize: '1.2rem', color: '#767676' }}>로딩 중...</div>
          </div>
        ) : error ? (
          <div style={{
            backgroundColor: 'white',
            padding: '48px 24px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}>
            <AlertCircle style={{ width: '48px', height: '48px', color: '#FF6B6B', margin: '0 auto 16px' }} />
            <h3 style={{ marginBottom: '8px', color: '#191919' }}>오류 발생</h3>
            <p style={{ color: '#767676', fontSize: '0.875rem', marginBottom: '24px' }}>
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                backgroundColor: '#00D9C0',
                color: 'white',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              다시 시도
            </button>
          </div>
        ) : !statistics || totalSamples === 0 ? (
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
                  value={`${totalSamples}회`}
                />
                <StatCard
                  icon={<DollarSign style={{ width: '20px', height: '20px' }} />}
                  iconColor="#8B5CF6"
                  label="총 구매 금액"
                  value={`${totalAmount.toLocaleString()}원`}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                <StatCard
                  icon={<Award style={{ width: '20px', height: '20px' }} />}
                  iconColor="#FFB800"
                  label="총 당첨 금액"
                  value={`${totalPrize.toLocaleString()}원`}
                />
                <StatCard
                  icon={<TrendingUp style={{ width: '20px', height: '20px' }} />}
                  iconColor={(statistics?.averageReturnRate || 0) >= 100 ? '#00D9C0' : '#FF6B6B'}
                  label="평균 수익률"
                  value={`${(statistics?.averageReturnRate || 0).toFixed(1)}%`}
                />
              </div>

              <div style={{
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: totalPrize > totalAmount ? '#F0FDF4' : '#FFF1F0',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#767676', marginBottom: '4px' }}>
                  {totalPrize > totalAmount ? '총 수익' : '총 손실'}
                </div>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700',
                  color: totalPrize > totalAmount ? '#00D9C0' : '#FF6B6B'
                }}>
                  {totalPrize > totalAmount ? '+' : '-'}
                  {Math.abs(totalPrize - totalAmount).toLocaleString()}원
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
                {['FIRST', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH'].map(rank => {
                  const count = rankMapCounts[rank] || 0;
                  const config = rankMap[rank];
                  return (
                    <RankStatRow 
                      key={rank}
                      rank={config.label} 
                      count={count} 
                      total={totalSamples}
                      color={config.color}
                    />
                  );
                })}
                <RankStatRow 
                  rank="낙첨" 
                  count={noneCount} 
                  total={totalSamples}
                  color="#E5E5E5"
                />
              </div>

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
                  {totalSamples > 0 ? ((totalWins / totalSamples) * 100).toFixed(1) : '0.0'}%
                </div>
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