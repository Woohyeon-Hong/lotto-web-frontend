# Lotto Web Frontend

CLI 로또 프로그램을 웹 서비스로 확장한 프로젝트의 SPA 프론트엔드입니다.  
금액 입력부터 발행/당첨 확인/통계 확인까지의 UX를 React 기반으로 구현하고,  
[lotto-web-backend](https://github.com/Woohyeon-Hong/lotto-web-backend) REST API와 1:1로 연동합니다.

## 요구 사항

- Node.js 20 이상
- npm 10 이상
- 백엔드 서버(`http://localhost:8080`) 실행

## 실행 방법

```bash
npm install
npm run dev
```

## 주요 화면

- **Home**: 서비스 소개 및 플로우 진입
- **Purchase**: 금액 입력 → 자동 로또 발행
- **Purchase Result**: 발행된 번호/요약 정보 확인
- **Winning Numbers**: 당첨 번호 입력 및 수익률 계산
- **Histories**: 서버에 저장된 발행 이력 조회
- **Statistics**: 누적 통계(총 구매, 당첨 등수별 집계) 시각화

## 기술 스택

- React 18 / TypeScript / Vite
- Shadcn UI · Radix UI · lucide-react
- Fetch API 기반 REST 통신
- Client-side state 기반 화면 전환

## 프로젝트 구조

```
src/
├── api/            # 백엔드 REST API wrapper
├── components/     # 페이지/도메인별 UI
├── App.tsx         # 상태 관리 및 뷰 전환
└── main.tsx        # 엔트리 포인트
```

## 백엔드 연동

프론트엔드는 백엔드가 제공하는 다음 엔드포인트를 사용합니다.

- `POST /lottos` : 로또 구매 생성
- `GET /lottos` : 구매 목록 조회
- `GET /lottos/{id}` : 구매 상세 조회
- `PUT /lottos/{id}/result` : 당첨 결과 등록/수정
- `GET /lottos/{id}/result` : 당첨 결과 조회
- `GET /lottos/statistics` : 누적 통계 조회

자세한 Request/Response 스펙은 백엔드 README를 참고하세요.

<https://github.com/Woohyeon-Hong/lotto-web-backend>
