import { useState, useEffect } from 'react';
import { AlertCircle, RefreshCcw, Ticket } from 'lucide-react';
import { createPurchase } from '../api/lottos';

type Page = 'home' | 'purchase' | 'purchase-result' | 'purchase-history' | 'winning' | 'statistics';

interface PurchaseProps {
  onNavigate: (page: Page) => void;
  onPurchaseComplete: (id: number, amount: number) => void;
  lastAmount: number | null;
}

const LOTTO_PRICE = 1000;

const generateLottoNumbers = (): number[] => {
  const numbers: number[] = [];
  while (numbers.length < 6) {
    const num = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers.sort((a, b) => a - b);
};

export function Purchase({ onNavigate, onPurchaseComplete, lastAmount }: PurchaseProps) {
  const [amount, setAmount] = useState('');
  const [ticketCount, setTicketCount] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (amount === '') {
      setTicketCount(0);
      setError('');
      return;
    }

    const numAmount = Number(amount);

    if (!Number.isFinite(numAmount) || numAmount <= 0) {
      setTicketCount(0);
      setError('양수 금액을 입력해주세요');
      return;
    }

    if (numAmount % LOTTO_PRICE !== 0) {
      const nearest = Math.floor(numAmount / LOTTO_PRICE) * LOTTO_PRICE;
      setTicketCount(Math.floor(numAmount / LOTTO_PRICE));
      setError(`${LOTTO_PRICE.toLocaleString()}원 단위로 입력해주세요 (예: ${nearest.toLocaleString()}원)`);
      return;
    }

    const count = Math.floor(numAmount / LOTTO_PRICE);
    setTicketCount(count);
    setError('');
  }, [amount]);

  const handlePurchase = async () => {
    if (error || !amount || ticketCount === 0) {
      return;
    }

    const numAmount = Number(amount);
    
    try {
      setIsLoading(true);
      setError('');
      const purchaseId = await createPurchase(numAmount);
      onPurchaseComplete(purchaseId, numAmount);
    } catch (e: any) {
      setError(e.message || '구매 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastAmount) {
      setAmount(String(lastAmount));
    }
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
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>💰</div>
        <h1 style={{ color: 'white', marginBottom: '8px' }}>로또 구매</h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
          원하는 금액을 입력하세요
        </p>
      </header>

      <div style={{ padding: '20px' }}>
        {/* 최근 금액으로 재구매 */}
        {lastAmount && (
          <div style={{ 
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            border: '2px solid #00D9C0',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '16px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '12px'
            }}>
              <RefreshCcw style={{ width: '20px', height: '20px', color: '#00D9C0' }} />
              <h3 style={{ fontSize: '1rem', margin: 0 }}>같은 금액으로 다시 구매</h3>
            </div>
            <p style={{ 
              color: '#767676', 
              marginBottom: '16px', 
              fontSize: '0.875rem' 
            }}>
              최근 구매 금액: <strong style={{ color: '#191919' }}>
                {lastAmount.toLocaleString()}원
              </strong> ({Math.floor(lastAmount / LOTTO_PRICE)}장)
            </p>
            <button
              onClick={handleRetry}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #00D9C0 0%, #00C0AA 100%)',
                color: 'white',
                border: 'none',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              같은 금액으로 다시 구매
            </button>
          </div>
        )}

        {/* 금액 입력 카드 */}
        <div style={{ 
          backgroundColor: 'white',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Ticket style={{ width: '20px', height: '20px', color: '#00D9C0' }} />
            <h3 style={{ fontSize: '1rem', margin: 0 }}>구매 금액 입력</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 입력 필드 */}
            <div>
              <label 
                htmlFor="purchaseAmount"
                style={{ 
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.875rem',
                  color: '#767676'
                }}
              >
                구매 금액 (원)
              </label>
              <input
                id="purchaseAmount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`${LOTTO_PRICE.toLocaleString()}원 단위로 입력`}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: `2px solid ${error ? '#FF6B6B' : '#E5E5E5'}`,
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  if (!error) {
                    e.currentTarget.style.borderColor = '#00D9C0';
                  }
                }}
                onBlur={(e) => {
                  if (!error) {
                    e.currentTarget.style.borderColor = '#E5E5E5';
                  }
                }}
              />
              <p style={{ 
                marginTop: '8px',
                fontSize: '0.8125rem',
                color: '#999',
                margin: '8px 0 0 0'
              }}>
                로또 1장의 가격은 {LOTTO_PRICE.toLocaleString()}원입니다
              </p>
            </div>

            {/* 오류 메시지 */}
            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#FFF1F0'
              }}>
                <AlertCircle style={{ 
                  width: '16px', 
                  height: '16px', 
                  marginTop: '2px',
                  color: '#FF6B6B',
                  flexShrink: 0
                }} />
                <p style={{ 
                  fontSize: '0.8125rem', 
                  color: '#FF6B6B',
                  margin: 0
                }}>
                  {error}
                </p>
              </div>
            )}

            {/* 예상 발행 장수 */}
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: ticketCount > 0 
                ? 'rgba(0, 217, 192, 0.1)' 
                : '#F7F7F7'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between' 
              }}>
                <span style={{ 
                  fontSize: '0.875rem',
                  color: '#767676'
                }}>
                  예상 발행 장수
                </span>
                <div>
                  <span style={{ 
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: ticketCount > 0 
                      ? '#00D9C0' 
                      : '#999'
                  }}>
                    {ticketCount}
                  </span>
                  <span style={{ 
                    fontSize: '1rem', 
                    marginLeft: '4px',
                    color: ticketCount > 0 
                      ? '#00D9C0' 
                      : '#999'
                  }}>
                    장
                  </span>
                </div>
              </div>
            </div>

            {/* 구매 버튼 */}
            <button
              onClick={handlePurchase}
              disabled={!!error || !amount || ticketCount === 0 || isLoading}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                background: (error || !amount || ticketCount === 0 || isLoading)
                  ? '#CCCCCC'
                  : 'linear-gradient(135deg, #00D9C0 0%, #00C0AA 100%)',
                color: 'white',
                fontWeight: '600',
                border: 'none',
                cursor: (error || !amount || ticketCount === 0 || isLoading) ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseDown={(e) => {
                if (!error && amount && ticketCount > 0 && !isLoading) {
                  e.currentTarget.style.transform = 'scale(0.98)';
                }
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {isLoading ? '구매 중...' : (ticketCount > 0 ? `${ticketCount}장 구매하기` : '구매하기')}
            </button>
          </div>
        </div>

        {/* 발행 내역 보기 버튼 */}
        <button
          onClick={() => onNavigate('purchase-history')}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            backgroundColor: 'white',
            color: '#191919',
            fontWeight: '500',
            border: '1.5px solid #E5E5E5',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          최근 발행 내역 보기
        </button>
      </div>
    </div>
  );
}