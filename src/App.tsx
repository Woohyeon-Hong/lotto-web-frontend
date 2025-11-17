import { useState } from 'react';
import { Home } from './components/Home';
import { Purchase } from './components/Purchase';
import { PurchaseResult } from './components/PurchaseResult';
import { Histories } from './components/Histories';
import { WinningNumbers } from './components/WinningNumbers';
import { Statistics } from './components/Statistics';
import { BottomNav } from './components/BottomNav';

type Page = 'home' | 'purchase' | 'purchase-result' | 'purchase-history' | 'winning' | 'statistics';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [purchaseId, setPurchaseId] = useState<number | null>(null);
  const [lastPurchaseAmount, setLastPurchaseAmount] = useState<number | null>(null);

  const handlePurchaseComplete = (id: number, amount: number) => {
    setPurchaseId(id);
    setLastPurchaseAmount(amount);
    setCurrentPage('purchase-result');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'purchase':
        return <Purchase onNavigate={setCurrentPage} onPurchaseComplete={handlePurchaseComplete} lastAmount={lastPurchaseAmount} />;
      case 'purchase-result':
        return purchaseId ? <PurchaseResult onNavigate={setCurrentPage} purchaseId={purchaseId} /> : <Home onNavigate={setCurrentPage} />;
      case 'purchase-history':
        return <Histories onNavigate={setCurrentPage} onSetPurchaseId={setPurchaseId} />;
      case 'winning':
        return purchaseId ? <WinningNumbers onNavigate={setCurrentPage} purchaseId={purchaseId} /> : <Home onNavigate={setCurrentPage} />;
      case 'statistics':
        return <Statistics onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  const isInPurchaseProcess = ['purchase-result', 'winning'].includes(currentPage);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <main style={{ 
        flex: 1, 
        overflowY: 'auto', 
        paddingBottom: '80px' 
      }}>
        {renderPage()}
      </main>
      {!isInPurchaseProcess && <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />}
    </div>
  );
}