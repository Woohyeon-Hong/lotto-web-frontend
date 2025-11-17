import { useState, useRef, useEffect } from 'react';
import { Award, AlertCircle, CheckCircle, ShoppingCart, ChevronDown, ChevronUp, Home as HomeIcon, History } from 'lucide-react';
import { getPurchase, putResult, getResult } from '../api/lottos';
import type { PurchaseDetailResponse, LottoResultResponse } from '../api/types';

type Page = 'home' | 'purchase' | 'purchase-result' | 'purchase-history' | 'winning' | 'statistics';

interface WinningNumbersProps {
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

const calculateRank = (matchCount: number, hasBonus: boolean): string => {
  if (matchCount === 6) return '1등';
  if (matchCount === 5 && hasBonus) return '2등';
  if (matchCount === 5) return '3등';
  if (matchCount === 4) return '4등';
  if (matchCount === 3) return '5등';
  return '낙첨';
};

const getRankColor = (rank: string): string => {
  switch (rank) {
    case '1등': return '#FFB800';
    case '2등': return '#00D9C0';
    case '3등': return '#8B5CF6';
    case '4등': return '#FF6B6B';
    case '5등': return '#999999';
    default: return '#E5E5E5';
  }
};

export function WinningNumbers({ onNavigate, purchaseId }: WinningNumbersProps) {
  const [purchase, setPurchase] = useState<PurchaseDetailResponse | null>(null);
  const [winningNumbers, setWinningNumbers] = useState<string[]>(['', '', '', '', '', '']);
  const [bonusNumber, setBonusNumber] = useState('');
  const [error, setError] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [results, setResults] = useState<LottoResultResponse | null>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        setIsLoading(true);
        setError('');
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

  const handleNumberChange = (index: number, value: string) => {
    const num = value.replace(/[^0-9]/g, '');
    
    if (num === '' || (parseInt(num) >= 1 && parseInt(num) <= 45)) {
      const newNumbers = [...winningNumbers];
      newNumbers[index] = num;
      setWinningNumbers(newNumbers);
      setError('');
      setIsChecked(false);

      if (num.length === 2 && index < 5) {
        inputRefs.current[index + 1]?.focus();
      } else if (num.length === 2 && index === 5) {
        inputRefs.current[6]?.focus();
      }
      else if (num.length === 1 && parseInt(num) > 4 && index < 5) {
        setTimeout(() => {
          inputRefs.current[index + 1]?.focus();
        }, 150);
      }
    }
  };

  const handleBonusChange = (value: string) => {
    const num = value.replace(/[^0-9]/g, '');
    if (num === '' || (parseInt(num) >= 1 && parseInt(num) <= 45)) {
      setBonusNumber(num);
      setError('');
      setIsChecked(false);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement> | KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (index === 6 && bonusNumber === '' && inputRefs.current[5]) {
        e.preventDefault();
        inputRefs.current[5]?.focus();
      } else if (index < 6 && index > 0 && winningNumbers[index] === '') {
        e.preventDefault();
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const validateNumbers = (): boolean => {
    if (winningNumbers.some(n => n === '') || bonusNumber === '') {
      setError('모든 번호를 입력해주세요');
      return false;
    }

    const nums = winningNumbers.map(n => parseInt(n));
    const bonus = parseInt(bonusNumber);

    const allNumbers = [...nums, bonus];
    if (new Set(allNumbers).size !== allNumbers.length) {
      setError('중복된 번호가 있습니다');
      return false;
    }

    return true;
  };

  const handleCheck = async () => {
    if (!validateNumbers() || !purchase) {
      return;
    }

    const winNums = winningNumbers.map(n => parseInt(n, 10)).sort((a, b) => a - b);
    const bonus = parseInt(bonusNumber, 10);

    if (winNums.length !== 6) {
      setError('당첨 번호는 6개여야 합니다.');
      return;
    }
    if (winNums.some(n => n < 1 || n > 45)) {
      setError('당첨 번호는 1-45 사이의 숫자여야 합니다.');
      return;
    }
    if (isNaN(bonus) || bonus < 1 || bonus > 45) {
      setError('보너스 번호는 1-45 사이의 숫자여야 합니다.');
      return;
    }
    if (winNums.includes(bonus)) {
      setError('보너스 번호는 당첨 번호와 중복될 수 없습니다.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      await putResult(purchaseId, {
        lottoNumbers: winNums,
        bonusNumber: bonus
      });
      
      const resultData = await getResult(purchaseId);
      setResults(resultData);
      setIsChecked(true);
    } catch (e: any) {
      setError(e.message || '당첨 결과를 확인하는 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setWinningNumbers(['', '', '', '', '', '']);
    setBonusNumber('');
    setError('');
    setIsChecked(false);
    setResults(null);
    setIsDetailsVisible(false);
    inputRefs.current[0]?.focus();
  };

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

  if (error && !purchase) {
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

  if (!purchase) {
    return null;
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
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏆</div>
        <h1 style={{ color: 'white', marginBottom: '8px' }}>당첨 확인</h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
          당첨 번호를 입력하고 결과를 확인하세요
        </p>
      </header>

      <div style={{ padding: '20px' }}>
        {/* 당첨 번호 입력 카드 */}
        <div style={{ 
          backgroundColor: 'white',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Award style={{ width: '20px', height: '20px', color: '#00D9C0' }} />
            <h3 style={{ fontSize: '1rem', margin: 0 }}>당첨 번호 입력</h3>
          </div>

          {/* 메인 번호 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block',
              marginBottom: '12px',
              fontSize: '0.875rem',
              color: '#767676'
            }}>
              당첨 번호 (1~45)
            </label>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '8px'
            }}>
              {winningNumbers.map((num, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="tel"
                  inputMode="numeric"
                  maxLength={2}
                  value={num}
                  onChange={(e) => handleNumberChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  placeholder={(index + 1).toString()}
                  style={{
                    width: '100%',
                    padding: '12px 8px',
                    textAlign: 'center',
                    borderRadius: '8px',
                    border: `2px solid ${error && num === '' ? '#FF6B6B' : '#E5E5E5'}`,
                    fontSize: '1rem',
                    fontWeight: '600',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    if (!error || num !== '') {
                      e.currentTarget.style.borderColor = '#00D9C0';
                    }
                    e.currentTarget.select();
                  }}
                  onBlur={(e) => {
                    if (!error || num !== '') {
                      e.currentTarget.style.borderColor = '#E5E5E5';
                    }
                  }}
                />
              ))}
            </div>
            <p style={{ 
              marginTop: '8px',
              fontSize: '0.75rem',
              color: '#999',
              margin: '8px 0 0 0'
            }}>
              💡 숫자를 입력하면 자동으로 다음 칸으로 이동합니다
            </p>
          </div>

          {/* 보너스 번호 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block',
              marginBottom: '12px',
              fontSize: '0.875rem',
              color: '#767676'
            }}>
              보너스 번호
            </label>
            <input
              ref={(el) => (inputRefs.current[6] = el)}
              type="tel"
              inputMode="numeric"
              maxLength={2}
              value={bonusNumber}
              onChange={(e) => handleBonusChange(e.target.value)}
              onKeyDown={(e) => handleKeyDown(6, e)}
              placeholder="보너스"
              style={{
                width: '100%',
                padding: '12px 16px',
                textAlign: 'center',
                borderRadius: '8px',
                border: `2px solid ${error && bonusNumber === '' ? '#FF6B6B' : '#E5E5E5'}`,
                fontSize: '1rem',
                fontWeight: '600',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                if (!error || bonusNumber !== '') {
                  e.currentTarget.style.borderColor = '#00D9C0';
                }
                e.currentTarget.select();
              }}
              onBlur={(e) => {
                if (!error || bonusNumber !== '') {
                  e.currentTarget.style.borderColor = '#E5E5E5';
                }
              }}
            />
          </div>

          {/* 오류 메시지 */}
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#FFF1F0',
              marginBottom: '16px'
            }}>
              <AlertCircle style={{ 
                width: '16px', 
                height: '16px', 
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

          {/* 버튼 그룹 */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleReset}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: 'white',
                color: '#767676',
                fontWeight: '500',
                border: '1.5px solid #E5E5E5',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              초기화
            </button>
            <button
              onClick={handleCheck}
              disabled={isSubmitting}
              style={{
                flex: 2,
                padding: '14px',
                borderRadius: '12px',
                background: isSubmitting
                  ? '#CCCCCC'
                  : 'linear-gradient(135deg, #00D9C0 0%, #00C0AA 100%)',
                color: 'white',
                fontWeight: '600',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseDown={(e) => {
                if (!isSubmitting) {
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
              {isSubmitting ? '확인 중...' : '당첨 확인하기'}
            </button>
          </div>
        </div>

        {/* 당첨 결과 */}
        {isChecked && results && (
          <>
            {/* 결과 요약 */}
            <div style={{
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <CheckCircle style={{ width: '20px', height: '20px', color: '#00D9C0' }} />
                <h3 style={{ fontSize: '1rem', margin: 0 }}>당첨 결과</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                <ResultSummary label="총 구매 금액" value={`${totalAmount.toLocaleString()}원`} />
                <ResultSummary label="총 당첨 금액" value={`${(results?.totalPrize || 0).toLocaleString()}원`} />
              </div>

              <div style={{
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: (results?.totalPrize || 0) > totalAmount ? '#F0FDF4' : '#FAFAFA',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#767676', marginBottom: '4px' }}>
                  수익률
                </div>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700',
                  color: (results?.totalPrize || 0) > totalAmount ? '#00D9C0' : '#999'
                }}>
                  {(results?.returnRate || 0).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* 등수별 당첨 */}
            <div style={{
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '16px'
            }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>등수별 당첨</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(results?.rankCounts || []).map((rankCount, index) => {
                  const rankColors: { [key: string]: string } = {
                    'FIRST': '#FFB800',
                    'SECOND': '#00D9C0',
                    'THIRD': '#8B5CF6',
                    'FOURTH': '#FF6B6B',
                    'FIFTH': '#999999',
                    'NONE': '#E5E5E5',
                    '1등': '#FFB800',
                    '2등': '#00D9C0',
                    '3등': '#8B5CF6',
                    '4등': '#FF6B6B',
                    '5등': '#999999',
                    '낙첨': '#E5E5E5'
                  };
                  const rankLabels: { [key: string]: string } = {
                    'FIRST': '1등',
                    'SECOND': '2등',
                    'THIRD': '3등',
                    'FOURTH': '4등',
                    'FIFTH': '5등',
                    'NONE': '낙첨'
                  };
                  const label = rankLabels[rankCount.rank] || rankCount.rank;
                  const color = rankColors[rankCount.rank] || '#E5E5E5';
                  return (
                    <RankRow key={index} rank={label} count={rankCount.count} color={color} />
                  );
                })}
              </div>
            </div>

            {/* 상세 내역 (collapse) */}
            <div style={{
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '16px'
            }}>
              <button
                onClick={() => setIsDetailsVisible(!isDetailsVisible)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 0,
                  background: 'none',
                   border: 'none',
                   cursor: 'pointer',
                   marginBottom: isDetailsVisible ? '16px' : 0
                }}
              >
                <h3 style={{ fontSize: '1rem', margin: 0 }}>상세 내역</h3>
                {isDetailsVisible ? (
                  <ChevronUp style={{ width: '20px', height: '20px', color: '#767676' }} />
                ) : (
                  <ChevronDown style={{ width: '20px', height: '20px', color: '#767676' }} />
                )}
              </button>
              
              {isDetailsVisible && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {tickets.map((ticket, index) => {
                    const winNums = winningNumbers.map(n => parseInt(n, 10)).filter(n => !isNaN(n));
                    const bonus = parseInt(bonusNumber, 10);
                    const matchCount = ticket.numbers.filter((n: number) => winNums.includes(n)).length;
                    const hasBonus = ticket.numbers.includes(bonus);
                    const rank = calculateRank(matchCount, hasBonus);
                    
                    return (
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
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{ fontWeight: '600' }}>{String.fromCharCode(65 + index)}</span>
                          <span style={{ 
                            fontWeight: '600',
                            color: getRankColor(rank)
                          }}>
                            {rank}
                          </span>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          marginBottom: '8px',
                          flexWrap: 'wrap'
                        }}>
                          {ticket.numbers.map((num: number, i: number) => (
                            <div
                              key={i}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: getBallColor(num),
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '600',
                                fontSize: '0.8125rem'
                              }}
                            >
                              {num}
                            </div>
                          ))}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#999' }}>
                          일치: {matchCount}개 {hasBonus && '(보너스 포함)'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 재구매 버튼 */}
            <button
              onClick={() => onNavigate('purchase')}
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
                transition: 'transform 0.2s',
                marginBottom: '12px'
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <ShoppingCart style={{ width: '20px', height: '20px' }} />
              다시 구매하기
            </button>

            {/* 하단 버튼 그룹 */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => onNavigate('purchase-history')}
                style={{
                  flex: 1,
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
                <History style={{ width: '18px', height: '18px' }} />
                내역 확인
              </button>
              <button
                onClick={() => onNavigate('home')}
                style={{
                  flex: 1,
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
                홈으로
              </button>
            </div>
          </>
        )}

        {/* 발행 내역이 없을 때 */}
        {!isChecked && (
          <div style={{
            backgroundColor: 'white',
            padding: '32px 24px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎯</div>
            <p style={{ color: '#767676', fontSize: '0.875rem', margin: 0, marginBottom: '20px' }}>
              당첨 번호를 입력하고 확인 버튼을 눌러주세요
            </p>
            {tickets.length === 0 && (
              <>
                <p style={{ color: '#999', fontSize: '0.8125rem', marginBottom: '16px' }}>
                  구매한 로또가 없습니다.<br />
                  먼저 로또를 구매해주세요.
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
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface ResultSummaryProps {
  label: string;
  value: string;
}

function ResultSummary({ label, value }: ResultSummaryProps) {
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

interface RankRowProps {
  rank: string;
  count: number;
  color: string;
}

function RankRow({ rank, count, color }: RankRowProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px',
      backgroundColor: '#FAFAFA',
      borderRadius: '8px'
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
      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#191919' }}>
        {count}회
      </span>
    </div>
  );
}