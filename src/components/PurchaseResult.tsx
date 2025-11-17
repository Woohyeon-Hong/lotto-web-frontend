import { CheckCircle, ArrowRight, Home as HomeIcon, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getPurchase } from '../api/lottos';
import type { PurchaseDetailResponse } from '../api/types';

type Page = 'home' | 'purchase' | 'purchase-result' | 'purchase-history' | 'winning' | 'statistics';

interface PurchaseResultProps {
  onNavigate: (page: Page) => void;
  purchaseId: number;
}

const getBallColor = (number: number): string => {
  if (number <= 10) return '#FFB800';
  if (number <= 20) return '#00D9C0';
  if (number <= 30) return '#FF6B6B';
  if (number <= 40) return '#999999';
  return '#8B5CF6';
};

export function PurchaseResult({ onNavigate, purchaseId }: PurchaseResultProps) {
  const [isNumbersVisible, setIsNumbersVisible] = useState(false);
  const [purchase, setPurchase] = useState<PurchaseDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getPurchase(purchaseId);
        setPurchase(data);
      } catch (e: any) {
        setError(e.message || '구매 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchase();
  }, [purchaseId]);

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        backgroundColor: '#FAFAFA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#767676' }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error || !purchase) {
    return (
      <div style={{ 
        minHeight: '100vh',
        backgroundColor: '#FAFAFA',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <AlertCircle style={{ width: '48px', height: '48px', color: '#FF6B6B', margin: '0 auto 16px' }} />
          <h3 style={{ marginBottom: '8px', color: '#191919' }}>오류 발생</h3>
          <p style={{ color: '#767676', marginBottom: '16px' }}>
            {error || '구매 정보를 불러올 수 없습니다.'}
          </p>
          <button
            onClick={() => onNavigate('home')}
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
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const tickets = purchase.lottos || [];
  const totalAmount = purchase.purchaseAmount;

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#FAFAFA',
      paddingBottom: '40px'
    }}>
      {/* 헤더 */}
      <header style={{
        background: 'linear-gradient(135deg, #00D9C0 0%, #00C0AA 100%)',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div style={{ 
          width: '60px',
          height: '60px',
          margin: '0 auto 16px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <CheckCircle style={{ width: '32px', height: '32px', color: 'white' }} />
        </div>
        <h1 style={{ color: 'white', marginBottom: '8px' }}>구매 완료!</h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
          총 {tickets.length}장의 로또가 발행되었습니다
        </p>
      </header>

      <div style={{ padding: '20px' }}>
        {/* 구매 요약 */}
        <div style={{
          backgroundColor: 'white',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '16px'
        }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>구매 요약</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <SummaryCard label="발행 장수" value={`${tickets.length}장`} />
            <SummaryCard label="총 금액" value={`${totalAmount.toLocaleString()}원`} />
          </div>
        </div>

        {/* 발행된 번호 */}
        <div style={{
          backgroundColor: 'white',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '16px'
        }}>
          <button
            onClick={() => setIsNumbersVisible(!isNumbersVisible)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 0,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginBottom: isNumbersVisible ? '16px' : 0
            }}
          >
            <h3 style={{ fontSize: '1rem', margin: 0 }}>발행된 번호</h3>
            {isNumbersVisible ? (
              <ChevronUp style={{ width: '20px', height: '20px', color: '#767676' }} />
            ) : (
              <ChevronDown style={{ width: '20px', height: '20px', color: '#767676' }} />
            )}
          </button>
          
          {isNumbersVisible && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tickets.map((ticket, index) => (
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
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    flexWrap: 'wrap'
                  }}>
                    {ticket.numbers.map((num: number, i: number) => (
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
          )}
        </div>

        {/* 다음 단계 버튼들 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => {
              onNavigate('winning');
            }}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #00D9C0 0%, #00C0AA 100%)',
              color: 'white',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'transform 0.2s'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            당첨 확인하기
            <ArrowRight style={{ width: '20px', height: '20px' }} />
          </button>

          <button
            onClick={() => onNavigate('home')}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              backgroundColor: 'white',
              color: '#767676',
              border: '1.5px solid #E5E5E5',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'transform 0.2s'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <HomeIcon style={{ width: '18px', height: '18px' }} />
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
}

function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <div style={{
      padding: '12px',
      backgroundColor: '#FAFAFA',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '0.8125rem', color: '#767676', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontWeight: '600', fontSize: '1rem', color: '#191919' }}>
        {value}
      </div>
    </div>
  );
}