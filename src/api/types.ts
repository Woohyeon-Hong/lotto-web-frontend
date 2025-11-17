export interface LottoPurchaseRequest {
  purchaseAmount: number;
}

export interface IssuedLottoResponse {
  numbers: number[];
  issuedAt: string;
}

export interface PurchaseSummaryResponse {
  id: number;
  purchaseAmount: number;
  lottoCount: number;
  purchasedAt: string;
  hasResult: boolean;
  returnRate: number | null;
}

export interface PurchasesResponse {
  count: number;
  purchases: PurchaseSummaryResponse[];
}

export interface PurchaseDetailResponse {
  id: number;
  purchaseAmount: number;
  lottoCount: number;
  lottos: IssuedLottoResponse[];
  purchasedAt: string;
}

export interface LottoResultRequest {
  lottoNumbers: number[];
  bonusNumber: number;
}

export interface RankCount {
  rank: string;
  count: number;
}

export interface LottoResultResponse {
  purchaseId: number;
  purchaseAmount: number;
  totalPrize: number;
  returnRate: number;
  rankCounts: RankCount[];
}

export interface ErrorResponse {
  status?: number;
  errorCode?: string;
  message: string;
  timestamp?: string;
}

export interface ExpectedStatistics {
  totalSamples: number;
  averageReturnRate: number;
  accumulatedRankCounts: RankCount[];
}

