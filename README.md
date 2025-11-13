
# Lotto Web Client

로또 구매·당첨 확인 과정을 시뮬레이션하는 SPA 프론트엔드입니다.  
`lotto-web` 백엔드(향후 REST API 제공 예정)와 짝을 이루어 실제 발행, 당첨 결과, 구매 이력 데이터를 주고받을 수 있도록 설계되었습니다.

## 주요 기능
- 금액 입력 기반 자동 로또 발행 및 결과 요약 화면
- 발행된 번호 상세 확인, 당첨 번호 입력 및 수익률 계산
- 발행 이력/통계 화면(REST API 연동 시 서버 데이터로 확장 예정)
- 모바일 친화 UI 컴포넌트 세트(Shadcn UI + Radix UI)

## 개발 환경
- React 18 + Vite
- TypeScript
- Shadcn UI / Radix UI / lucide-react

## 실행 방법
```bash
npm install
npm run dev
```

## 프로젝트 구조
```
src/
├── App.tsx                # 페이지 전환 및 전역 상태 관리
├── components/            # 도메인별 UI 컴포넌트
├── styles/                # 전역 스타일
└── main.tsx               # 진입점
```
