import { FileText, Calendar, ChevronDown, ChevronUp, Ticket, AlertCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import type { ReactElement } from 'react';
import { getPurchases, getPurchase } from '../api/lottos';
import type { PurchaseSummaryResponse, PurchaseDetailResponse } from '../api/types';
import { WalletIcon } from './icons/WalletIcon';
import { TicketIcon } from './icons/TicketIcon';

type Page = 'home' | 'purchase' | 'purchase-result' | 'purchase-history' | 'winning' | 'statistics';

interface HistoriesProps {
  onNavigate: (page: Page) => void;
  onSetPurchaseId?: (id: number) => void;
}

// 로또 번호 색상
const getBallColor = (number: number): string => {
  if (number <= 10) return '#FFB800'; // 노란색
  if (number <= 20) return '#00D9C0'; // 민트색
  if (number <= 30) return '#FF6B6B'; // 빨간색
  if (number <= 40) return '#999999'; // 회색
  return '#8B5CF6'; // 보라색
};

export function Histories({ onNavigate, onSetPurchaseId }: HistoriesProps) {
  const [purchases, setPurchases] = useState<PurchaseSummaryResponse[]>([]);
  const [expandedDetails, setExpandedDetails] = useState<{ [key: number]: PurchaseDetailResponse }>({});
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getPurchases();
        setPurchases(data.purchases || []);
      } catch (e: any) {
        setError(e.message || '구매 내역을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  const toggleExpand = async (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(id);

    if (!expandedDetails[id]) {
      try {
        const detail = await getPurchase(id);
        setExpandedDetails({ ...expandedDetails, [id]: detail });
      } catch (e: any) {
        setError(e.message || '구매 상세 정보를 불러오는 중 오류가 발생했습니다.');
      }
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch {
      return dateString;
    }
  };

  const totalAmount = purchases.reduce((sum, p) => sum + p.purchaseAmount, 0);
  const totalTickets = purchases.reduce((sum, p) => sum + p.lottoCount, 0);

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
        ) : (
          <>
            {/* 통계 요약 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <SummaryCard
                label="총 구매 금액"
                value={`${totalAmount.toLocaleString()}원`}
                icon={<WalletIcon />}
              />
              <SummaryCard
                label="총 발행 장수"
                value={`${totalTickets}장`}
                icon={<TicketIcon />}
              />
            </div>

            {/* 내역이 없을 때 */}
            {purchases.length === 0 ? (
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
                  총 {purchases.length}건
                </span>
              </div>

              {/* 내역 리스트 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {purchases.map((purchase) => (
                  <HistoryCard
                    key={purchase.id}
                    purchase={purchase}
                    detail={expandedDetails[purchase.id]}
                    isExpanded={expandedId === purchase.id}
                    onToggle={() => toggleExpand(purchase.id)}
                    onNavigate={onNavigate}
                    onSetPurchaseId={onSetPurchaseId}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            </>
          )}
          </>
        )}
      </div>
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
  icon: string | ReactElement;
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
      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
        {typeof icon === 'string' ? <div style={{ fontSize: '32px' }}>{icon}</div> : icon}
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

interface HistoryCardProps {
  key?: React.Key;
  purchase: PurchaseSummaryResponse;
  detail: PurchaseDetailResponse | undefined;
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate: (page: Page) => void;
  onSetPurchaseId?: (id: number) => void;
  formatDate: (dateString: string) => string;
}

function HistoryCard({ purchase, detail, isExpanded, onToggle, onNavigate, onSetPurchaseId, formatDate }: HistoryCardProps) {
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
              {formatDate(purchase.purchasedAt)}
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
                {purchase.lottoCount}장 구매
              </span>
            </div>
            {purchase.hasResult && purchase.returnRate !== null && (
              <div style={{ fontSize: '0.875rem', color: purchase.returnRate >= 100 ? '#00D9C0' : '#999' }}>
                수익률: {purchase.returnRate.toFixed(1)}%
              </div>
            )}
          </div>
          <div style={{ 
            fontSize: '1.125rem', 
            fontWeight: '700', 
            color: '#00D9C0' 
          }}>
            {purchase.purchaseAmount.toLocaleString()}원
          </div>
        </div>
      </button>

      {/* 확장된 내용 */}
      {isExpanded && (
        <div style={{
          padding: '0 20px 20px 20px',
          borderTop: '1px solid #F0F0F0'
        }}>
          {detail ? (
            <>
              <div style={{ paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {detail.lottos.map((lotto, index) => (
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
                      로또 #{index + 1}
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
                onClick={() => {
                  if (onSetPurchaseId) {
                    onSetPurchaseId(purchase.id);
                  }
                  onNavigate('winning');
                }}
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
            </>
          ) : (
            <div style={{ paddingTop: '20px', textAlign: 'center', color: '#767676' }}>
              로딩 중...
            </div>
          )}
        </div>
      )}
    </div>
  );
}