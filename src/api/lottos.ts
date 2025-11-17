import {
  PurchasesResponse,
  PurchaseDetailResponse,
  LottoResultRequest,
  LottoResultResponse,
  ErrorResponse,
  ExpectedStatistics,
} from './types';

const BASE_URL = 'http://localhost:8080';

async function toError(res: Response): Promise<Error> {
  try {
    const body = (await res.json()) as ErrorResponse;
    return new Error(body.message ?? `${res.status} ${res.statusText}`);
  } catch {
    return new Error(`${res.status} ${res.statusText}`);
  }
}


export async function createPurchase(purchaseAmount: number): Promise<number> {
  const res = await fetch(`${BASE_URL}/lottos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ purchaseAmount }),
  });

  if (!res.ok) {
    throw await toError(res);
  }

  const location = res.headers.get('Location');
  if (location) {
    const idStr = location.split('/').pop();
    const id = Number(idStr);
    if (!Number.isNaN(id)) {
      return id;
    }
  }

  const responseData = await res.json();
  if (responseData.id && typeof responseData.id === 'number') {
    return responseData.id;
  }
  if (responseData.purchaseId && typeof responseData.purchaseId === 'number') {
    return responseData.purchaseId;
  }

  throw new Error('서버 응답에서 구매 ID를 찾을 수 없습니다.');
}

export async function getPurchases(): Promise<PurchasesResponse> {
  const res = await fetch(`${BASE_URL}/lottos`);
  if (!res.ok) throw await toError(res);
  return (await res.json()) as PurchasesResponse;
}

export async function getPurchase(id: number): Promise<PurchaseDetailResponse> {
  const res = await fetch(`${BASE_URL}/lottos/${id}`);
  if (!res.ok) throw await toError(res);
  return (await res.json()) as PurchaseDetailResponse;
}

export async function putResult(
  id: number,
  request: LottoResultRequest,
): Promise<LottoResultResponse> {
  const res = await fetch(`${BASE_URL}/lottos/${id}/result`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    throw await toError(res);
  }

  return (await res.json()) as LottoResultResponse;
}

export async function getResult(id: number): Promise<LottoResultResponse> {
  const res = await fetch(`${BASE_URL}/lottos/${id}/result`);
  if (!res.ok) {
    if (res.status === 400 || res.status === 404) {
      throw new Error('아직 당첨 결과가 없습니다.');
    }
    throw await toError(res);
  }
  return (await res.json()) as LottoResultResponse;
}

export async function getStatistics(): Promise<ExpectedStatistics> {
  const res = await fetch(`${BASE_URL}/lottos/statistics`);
  if (!res.ok) throw await toError(res);
  return (await res.json()) as ExpectedStatistics;
}

