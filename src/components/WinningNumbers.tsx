import { useState, useRef } from 'react';
import { Award, AlertCircle, CheckCircle, ShoppingCart, ChevronDown, ChevronUp, Home as HomeIcon, History } from 'lucide-react';

type Page = 'home' | 'purchase' | 'purchase-result' | 'purchase-history' | 'winning' | 'statistics';

interface WinningNumbersProps {
  onNavigate: (page: Page) => void;
  tickets: any[];
}

// 로또 번호 색상
const getBallColor = (number: number): string => {
  if (number <= 10) return '#FFB800';
  if (number <= 20) return '#00D9C0';
  if (number <= 30) return '#FF6B6B';
  if (number <= 40) return '#999999';
  return '#8B5CF6';
};

// 당첨 등수 계산
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

export function WinningNumbers({ onNavigate, tickets }: WinningNumbersProps) {
  const [winningNumbers, setWinningNumbers] = useState<string[]>(['', '', '', '', '', '']);
  const [bonusNumber, setBonusNumber] = useState('');
  const [error, setError] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  
  // 각 input에 대한 ref
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleNumberChange = (index: number, value: string) => {
    const num = value.replace(/[^0-9]/g, '');
    
    // 빈 값이거나 1-45 범위 내
    if (num === '' || (parseInt(num) >= 1 && parseInt(num) <= 45)) {
      const newNumbers = [...winningNumbers];
      newNumbers[index] = num;
      setWinningNumbers(newNumbers);
      setError('');
      setIsChecked(false);

      // 2자리 입력 시 자동으로 다음 필드로 이동
      if (num.length === 2 && index < 5) {
        inputRefs.current[index + 1]?.focus();
      } else if (num.length === 2 && index === 5) {
        // 마지막 숫자면 보너스로 이동
        inputRefs.current[6]?.focus();
      }
      // 1자리인데 1-9 범위가 아닌 10-45 범위 시작 숫자면 다음 필드로
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

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace를 눌렀을 때 현재 필드가 비어있으면 이전 필드로 이동
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
    // 모든 번호 입력 확인
    if (winningNumbers.some(n => n === '') || bonusNumber === '') {
      setError('모든 번호를 입력해주세요');
      return false;
    }

    const nums = winningNumbers.map(n => parseInt(n));
    const bonus = parseInt(bonusNumber);

    // 중복 확인
    const allNumbers = [...nums, bonus];
    if (new Set(allNumbers).size !== allNumbers.length) {
      setError('중복된 번호가 있습니다');
      return false;
    }

    return true;
  };

  const handleCheck = () => {
    if (!validateNumbers()) {
      return;
    }

    const winNums = winningNumbers.map(n => parseInt(n));
    const bonus = parseInt(bonusNumber);

    // 각 티켓에 대해 당첨 여부 확인
    const details = tickets.map((ticket, index) => {
      const matchCount = ticket.numbers.filter((n: number) => winNums.includes(n)).length;
      const hasBonus = ticket.numbers.includes(bonus);
      const rank = calculateRank(matchCount, hasBonus);
      
      // Mock 당첨금 (실제로는 서버에서)
      let prize = 0;
      if (rank === '1등') prize = 2000000000;
      else if (rank === '2등') prize = 50000000;
      else if (rank === '3등') prize = 1500000;
      else if (rank === '4등') prize = 50000;
      else if (rank === '5등') prize = 5000;
      
      return {
        gameId: ticket.id,
        numbers: ticket.numbers,
        matchCount,
        hasBonus,
        rank,
        prize
      };
    });

    // 등수별 집계
    const ranks = {
      'FIRST': details.filter(d => d.rank === '1등').length,
      'SECOND': details.filter(d => d.rank === '2등').length,
      'THIRD': details.filter(d => d.rank === '3등').length,
      'FOURTH': details.filter(d => d.rank === '4등').length,
      'FIFTH': details.filter(d => d.rank === '5등').length,
      'NONE': details.filter(d => d.rank === '낙첨').length
    };

    const totalPrize = details.reduce((sum, d) => sum + d.prize, 0);
    const totalAmount = tickets.length * 1000;

    setResults({
      totalGames: tickets.length,
      totalAmount,
      totalPrize,
      ranks,
      details
    });
    setIsChecked(true);
  };

  const handleReset = () => {
    setWinningNumbers(['', '', '', '', '', '']);
    setBonusNumber('');
    setError('');
    setIsChecked(false);
    setResults(null);
    setIsDetailsVisible(false);
    // 첫 번째 입력 필드로 포커스
    inputRefs.current[0]?.focus();
  };

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
                    // 포커스 시 전체 선택
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
              style={{
                flex: 2,
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #00D9C0 0%, #00C0AA 100%)',
                color: 'white',
                fontWeight: '600',
                border: 'none',
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
                <ResultSummary label="총 구매 금액" value={`${results.totalAmount.toLocaleString()}원`} />
                <ResultSummary label="총 당첨 금액" value={`${results.totalPrize.toLocaleString()}원`} />
              </div>

              <div style={{
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: results.totalPrize > results.totalAmount ? '#F0FDF4' : '#FAFAFA',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#767676', marginBottom: '4px' }}>
                  수익률
                </div>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700',
                  color: results.totalPrize > results.totalAmount ? '#00D9C0' : '#999'
                }}>
                  {((results.totalPrize / results.totalAmount) * 100).toFixed(1)}%
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
                <RankRow rank="1등" count={results.ranks.FIRST} color="#FFB800" />
                <RankRow rank="2등" count={results.ranks.SECOND} color="#00D9C0" />
                <RankRow rank="3등" count={results.ranks.THIRD} color="#8B5CF6" />
                <RankRow rank="4등" count={results.ranks.FOURTH} color="#FF6B6B" />
                <RankRow rank="5등" count={results.ranks.FIFTH} color="#999999" />
                <RankRow rank="낙첨" count={results.ranks.NONE} color="#E5E5E5" />
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
                  {results.details.map((detail: any, index: number) => (
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
                          color: getRankColor(detail.rank)
                        }}>
                          {detail.rank}
                        </span>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        marginBottom: '8px',
                        flexWrap: 'wrap'
                      }}>
                        {detail.numbers.map((num: number, i: number) => (
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
                      {detail.prize > 0 && (
                        <div style={{ fontSize: '0.875rem', color: '#00D9C0', fontWeight: '600' }}>
                          당첨금: {detail.prize.toLocaleString()}원
                        </div>
                      )}
                    </div>
                  ))}
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