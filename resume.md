# 김성주 (Jake Kim)

**Product Engineer · Crypto-native Builder · AI-native Developer**

- 이메일: jiovana.jake@gmail.com
- GitHub: https://www.github.com/howdyfrom2019
- LinkedIn: https://www.linkedin.com/in/sungjoo-kim-jake/
- X: https://x.com/b_cryptojake
- Telegram: https://t.me/b_cryptojake
- 포트폴리오: https://sungjoo-kim-jake.notion.site/Jake-002d8d2201634a0eaa471e92fe6ce6b2

> `[확인 필요]` 표시는 아직 확인되지 않은 항목입니다.

---

## 간략 소개

가장 트렌디한 금융 소프트웨어를 만들고 있습니다.

크립토에서 시작해 dApp, 온체인 게임, 그리고 기관용 트레이딩 터미널까지 만들어온 AI-native 프로덕트 엔지니어입니다.

지금은 크립토 파생상품 멀티 거래소 터미널 OrderX를 만들고 있습니다. Claude와 Codex를 planner/reviewer로 활용하고, 직접 설계한 시스템을 실제 서비스까지 운영하며 작은 팀으로 큰 제품을 만드는 것을 좋아합니다.

- OrderX: 파일럿·프라이빗 베타 단계에서 $10B 명목 거래 처리, $1M 매출. 브라우저 메모리 3.8GB → 1GB 최적화, translate 기반 자체 그리드, AI 워크플로우와 Figma MCP + i18n 파이프라인 정착.
- Waifu Sweeper: 업그레이더블 프록시로 토큰 경제 변경을 재배포 없이 매주 반영. 외부 감사 후 Abstract 메인넷 운영.
- 이전: Yooldo에서 90만 명 이상 온체인 온보딩, 곰블 TGE에서 하루 1만 건 스파이크를 견디는 클레임 dApp.

기술보다 문제를 푸는 방법론을 먼저 세웁니다. 설계 문서 → 구현 → Gap 분석 사이클을 남기고, 레거시 분석과 라이브러리 교체(차트, 그리드 엔진, 데이터 테이블) 경험이 많습니다. TypeScript, React, Next.js, Solidity가 주력입니다.

---

## 스킬

| 분야 | 스택 |
| --- | --- |
| Frontend | TypeScript, React 19, Next.js 15 (App Router), Vite, Bun, TanStack Query, Jotai, React Hook Form, Zod, Tailwind CSS v4, Radix UI, Framer Motion, dnd-kit |
| Realtime / Data | WebSocket, Protocol Buffers (ts-proto), TradingView Charting Library, TitanCharts, lightweight-charts, ECharts, Recharts, TanStack Table, react-virtuoso |
| Web3 | Viem, Wagmi, Ethers v6, RainbowKit, Reown AppKit, WalletConnect, Abstract Global Wallet (Session Keys), Thirdweb |
| Blockchain | Solidity, Hardhat, OpenZeppelin (UUPS Upgradeable), Pyth Network Oracle, EIP-712, TypeChain |
| Backend | Node.js, Nest.js, Prisma, Next.js Route Handlers |
| Infra / Tooling | Vercel, AWS S3 + Route53, AWS Amplify, GitHub Actions, PostHog, Google Analytics, Cloudflare Turnstile, Lokalise (i18n), Playwright, Storybook |
| Mobile | React Native, Expo, PWA |

---

## 경력

### SunLabs AG · OrderX · FE Part Lead

**2025.10 ~ 재직중 (12개월)** · 원격 근무 · 프론트엔드 1인 주도 개발(필요 시 페어 프로그래밍) · https://app.orderx.com

크립토 파생상품(옵션·선물·현물) 멀티 거래소 트레이딩 터미널 OrderX의 프론트엔드를 초기 세팅부터 리드하고 있습니다. 커스터마이즈 가능한 위젯 대시보드, 실시간 마켓/계정 스트림, 차트, 주문 입력, 포트폴리오, 분석 위젯, AI 채팅 기반 주문 워크플로우를 포함합니다.

**성과**

- 파일럿 + 프라이빗 베타 단계에서 명목 거래 $10B 처리, $1M 매출. 대형 멀티스트랫 펀드 파일럿 운영.
- 주문 실행과 멀티 거래소(Deribit, Hyperliquid, Lighter, Bybit, Binance, OPRA, CME, IBKR) 지원을 프론트에서 통합. 배치 주문, 앵커 가격 기반 미리보기, 계정 자동 해석, 거래소별 종목 표기의 구조화. TP/SL·RFQ·Spreader·Arb·Hedge·TWAP·One-tap 주문 방식을 그 위에 구축.
- 브라우저 메모리 상시 점유 3.8GB → 1GB 내외. react-grid-layout의 CPU 계산을 translate 기반 자체 그리드로 교체.
- Context injection과 Claude–Codex planner/reviewer 구조로 AI 워크플로우 정착. 단일 모델·단일 에이전트였다면 며칠~몇 주 뒤 다시 손봐야 했을 엣지 케이스를 리뷰 단계에서 잡아 기능당 작업일 1~3일 이상 절감. Figma MCP + i18n 에이전트 다국어 파이프라인.

**주요 업무**

- **실시간 위젯 성능 최적화**
  - 오더북: WebSocket delta를 즉시 렌더 → RAF 배칭 → 심볼 단위 타이머 배칭으로 단계적으로 전환하고, delta 유실 시 snapshot 기반 resync와 staleness 표시 경로를 추가.
  - 포지션 테이블: 서버 snapshot / 라이브 ticker / 그룹핑 구조를 분리해 행 단위 구독으로 쪼개 "가격 하나가 바뀌면 테이블 전체가 리렌더"되던 문제를 해결. Jotai atomFamily 기반 포지션 lookup 최적화.
  - AG Grid → 자체 DataTable로 교체하고 행 메모이제이션, 컬럼 전환 성능, 스크롤 체이닝 옵션 구현.
- **대시보드 그리드 엔진 교체**: react-grid-layout을 dnd-kit + framer-motion + 명령형 DOM 업데이트 기반 커스텀 그리드로 마이그레이션. 리사이즈 중 React 리렌더를 최소화해 차트 위젯이 많은 화면에서도 드래그/리사이즈가 부드럽게 동작. 위젯 stretch, 페이지 공유 레이아웃(OG 이미지 자동 생성 포함) 추가.
- **차트 라이브러리 마이그레이션**: lightweight-charts → TradingView Charting Library v31. 백엔드가 UDF가 아닌 gRPC-over-HTTP + WebSocket이라 Provider 패턴의 커스텀 Datafeed를 새로 작성. 포지션/체결 오버레이, 실시간 bid/ask quote push, 커스텀 인디케이터(OI 프로파일, visible range 프로파일, 크로스 거래소 스터디), 계정별 오버레이, 범위 프리셋/Go-to-date 툴바 구현.
- **3단계 웹 런타임 복구 시스템 설계·구현**: 장시간 백그라운드 탭 복귀 시 WebSocket은 살아있지만 데이터가 멈추는 문제를 단일 타이머가 아닌 복수 신호(WS health, 탭 visibility, 네트워크)로 판단하고, 부분 재구독 → query invalidation → 전체 리로드로 단계적으로 복구. 주문 입력 중에는 리로드를 차단.
- **AI 채팅 기반 주문**: assistant-ui 기반 채팅 UI 마이그레이션, 리서치(classify/confirm-card) 플로우, 리서치 job 취소/영속화/알림. AI에 전달하는 `UIContext` 프로토 v2 RFC(구조화된 instrument identity, 배치 주문, 트리거/TP·SL 상태)와 `@account` 태그 기반 티커별 계정 라우팅 제안서를 작성해 백엔드 팀과 협의.
- **멀티 거래소·멀티 계정 트레이딩 위젯**: Spreader(매트릭스 스프레드 주문), Arb 빌더, Hedge 시뮬레이션, RFQ(dual RFQ), TWAP, One-tap buy / Quick order, 배치 주문 프리뷰 및 앵커 가격 해석, 계정 해석(`resolvePreferredOrderAccountId`) 리팩터링. 멀티 계정 포지션 집계 시 프로토콜 레벨 계정 상관관계가 없어 안전하지 않다는 점을 분석해 백엔드 변경 요구사항으로 정리.
- **데이터/분석 위젯**: FedWatch(grid/timeline), 경제 캘린더, 옵션 volume/OI 리더보드, 옵션 테이블 strike range 관리, SVI 파라미터, 히트맵, 수익률 버킷 차트, Amberdata 스트리밍.
- **인증/설정/운영**: 로그인·회원가입·MFA·패스키·이메일 인증 플로우, 서버사이드 토큰 리프레시 프록시, 알림 설정, Telegram 연동, 사운드 알림(cuelume), next-intl + Lokalise 스크립트로 i18n 파이프라인 구축, PostHog/Intercom 연동, `@t3-oss/env-nextjs` + Zod 환경변수 검증.

**기술 스택**

- Frontend: Next.js 15 (App Router, Turbopack), React 19, TypeScript, Bun, Tailwind CSS v4, Radix UI, Jotai (atomFamily / atomWithStorage), TanStack Query, React Hook Form + Zod, dnd-kit, framer-motion, react-virtuoso, TanStack Table
- Realtime: Protocol Buffers (ts-proto) over HTTP + WebSocket, 채널 기반 구독 모델
- Chart: TradingView Charting Library v31, TitanCharts, ECharts, Recharts
- AI: Vercel AI SDK, assistant-ui, ElevenLabs
- Web3: Wagmi, Viem, Reown AppKit
- Tooling: Playwright, Bun test, Prettier/ESLint, Lokalise, PostHog, OpenTelemetry, AWS Amplify

---

### YGG (Yield Guild Games) · Waifu Sweeper · Frontend & Smart Contract Engineer

**2025.08 ~ 2026.07 (12개월)** · 원격

Abstract 체인 위에서 동작하는 로그라이크 지뢰찾기 온체인 게임 Waifu Sweeper(프로젝트 초기명 Princess Sweeper, 이후 Playpsweeper로 리브랜딩)의 웹 클라이언트와 스마트 컨트랙트 전체를 단독으로 설계·구현·운영했습니다. YGG Play, Raito와 파트너십을 맺고 Abstract 메인넷에 배포했습니다.

**성과**

- 직접 설계한 결제 컨트랙트로 19,939건의 결제를 한 건의 실패 없이 처리. 합계 약 $1.5M 상당(USDC 72,500 · USDT 25,000 · ETH 104.65 ≈ $266K · YGG 50,616,446 ≈ $1.14M, 2026.09.12 시세 환산). https://abscan.org/address/0x465738e6d8ded1384c3e8402658257d4ae8ed17d
- 업그레이더블 프록시 운영으로 토큰 경제 순환·재구매·재방문율 변경을 재배포 없이 매주 반영. 외부 감사(2025.12) 후 Abstract 메인넷 운영.
- Context injection으로 인게임 로직과 웹 클라이언트를 단독 구현·운영. 94개 Hardhat 테스트, Cloudflare Turnstile 봇 차단.
- 서비스 종료. 초기 코어 로직 기반 빌드: https://dragon-sweeper-web.vercel.app/

**주요 업무 (프론트엔드)**

- React 19 + Vite 7 + Tailwind v4 기반 SPA. 지갑 연결은 RainbowKit + Wagmi + Abstract Global Wallet(AGW).
- **AGW Session Key 기반 게임 세션**: 게임 중 타일 오픈/몬스터 처치/아이템 획득/부활 같은 반복 액션을 매번 지갑 서명 없이 온체인에 기록하도록 24시간 세션 키(수수료 한도, 컨트랙트·셀렉터 단위 call policy)를 생성·저장·복구하는 훅 설계.
- NFT 가챠박스·에너지팩 상점: ETH/USDC/USDT/YGG 다중 결제, Pyth 가격 피드 업데이트 데이터를 트랜잭션에 동봉, NFT 결제 수단, 슬리피지 처리.
- 시즌 리더보드, Gold Mine 리더보드, 보상 대시보드, 레퍼럴 코드 검증, 마이페이지, 온보딩 캐릭터 선택, 이용약관/디스클레이머(YGG 퀘스트 연동).
- 운영 도구: 점검 모드 페이지와 서비스 스케줄 설정, 기능별 feature flag 및 날짜 플래그, 서버사이드 로그아웃, 모바일 제한 뷰, BGM/효과음 시스템, 이미지 프리로드.
- GA4 이벤트 설계(점수, 구매 등), Twitter Pixel, SEO/OG 최적화.

**주요 업무 (스마트 컨트랙트)**

- `ShopManager` (UUPS): 가챠박스/에너지팩 구매, ETH·USDC·USDT·YGG 결제(토큰별 decimals 명시 관리), EIP-712 서명 검증 + nonce 기반 리플레이 방지, 자금 인출, 민터 권한 관리.
- `WaifuSweeperNFT` (UUPS ERC721): 최대 30개 배치 민팅, gas limit을 피하기 위한 페이지네이션 `tokensOfOwner`.
- `PriceFeed` (UUPS): Pyth Network ETH/USD 피드 통합, 신뢰도 검증, 팩 가격(센트 단위) 관리.
- `NakiSBT`: 소울바운드 토큰, 소각 방지, 허용 민터 관리.
- `WaifuGameSessionTracker`: 플레이어별 세션 ID와 액션 nonce로 순서를 검증하는 온체인 액션 로그. 이미 배포된 `ShopManager` 프록시의 storage layout을 건드리지 않기 위해 tracker 주소를 상태 변수로 저장하지 않고 인자로 넘기는 설계를 택함(문서화).
- Hardhat Ignition + OpenZeppelin Upgrades 플러그인으로 Sepolia/Abstract 테스트넷·메인넷 배포 및 업그레이드 스크립트, 가격/민팅 권한/base URI 셋업 스크립트 작성.

**기술 스택**

- Frontend: React 19, TypeScript, Vite 7, Tailwind CSS v4, Radix UI, Jotai, TanStack Query, React Hook Form + Zod, Framer Motion, react-router 7
- Web3: Wagmi, Viem, Ethers v6, RainbowKit, Abstract Global Wallet (agw-client / agw-react sessions)
- Contracts: Solidity, Hardhat, OpenZeppelin Contracts Upgradeable v5, Pyth SDK, TypeChain, solidity-coverage
- Infra: Vercel (multi-env build), Cloudflare Turnstile, GA4

---

### 111퍼센트 · 곰블 · Frontend Engineer

**2025.04 ~ `[확인 필요: 종료 시점]`**

국내 1위 모바일 게임 스튜디오 111퍼센트의 Web3 사업부, 곰블 프로젝트의 웹/앱 플랫폼 개발을 담당했습니다. 합류 전 한 달간 원격으로 거래소 상장(Binance Alpha, 코인원, Bitget) 토큰 에어드랍 프로젝트 인수인계를 받았고, 이후 1인 프론트엔드로 사업 요구사항을 대응하고 있습니다.

- TGE 토큰 에어드랍 페이지를 10개의 Public JSON-RPC 노드로 분산 요청 처리해 개발 CS 이슈 0건 달성. Wagmi 기반 UX Writing으로 체인·지갑 변경에도 안정적인 지갑 연결·트랜잭션 전송 제공. Linear Cliff Vesting 시간 표기 UI 구현.
- 캐주얼 클리커 + 결과 베팅을 결합한 블록체인 게임을 Solidity로 설계(스테이킹 + 보상 구조 컨트랙트 포함).
- 리워드앱(React Native + Expo, Admob)과 동일 UI의 PWA(Vite-pwa)를 병행 개발해 스토어 심사 없이 빠르게 반복.
- NFT 인증·스테이킹 커뮤니티 웹, NFT 스테이킹/언스테이킹 웹사이트, 아웃소싱 미니게임(펭귄 얼음깨기)까지 1인 대응.
- Binance Alpha, 코인원, Bitget에 상장한 $GM 토큰 클레임 웹사이트 개발.

기술: React.js, TypeScript, Vite, Bun, Vite-pwa, React Native, Expo, Viem, Ethers, Wagmi, WalletConnect, Hardhat, Solidity, AWS S3 + Route53, Vercel

---

### 지엑스씨 · xCBT · Blockchain Engineer

**2024.10 ~ 2025.04 (7개월)** · 프리랜서, 2인 개발

지엑스씨(GXC Inc.) 주도로 설립된 스핀오프 팀 xCBT. Round Ventures, Pentachora Labs의 블록체인 전문가들과 함께 만든, 한 달마다 출시되는 블록체인 게임을 미리 해보고 경쟁적인 보상을 받는 미션 플랫폼입니다. 팀 빌딩 단계부터 합류해 웹사이트 구축과 NFT 스마트 컨트랙트, 구매·소각 검증 로직을 담당했습니다. 백엔드·인프라를 맡은 팀원 1인과 2인 페어로 개발했습니다.

- 10K+ USDT 이상 수익을 낸 SNS 인증(Xociety) 미션 플랫폼 기능 개발.
- USDT(ERC-20) 기반 NFT 민팅, Thirdweb 화이트리스트 구매 제한 대응.
- Next.js로 트위터·에픽게임즈·디스코드 OAuth 구현. next-auth에 없던 트위터 OAuth 처리 방식을 직접 제시.
- Turborepo 기반 모노레포로 어드민·클라이언트 페이지 통합 개발.

기술: TypeScript, Next.js, Tailwind CSS, Framer Motion, pnpm, Turborepo, Solidity, Hardhat, Viem, Thirdweb, Abstract Global Wallet

---

### 캣제랩스 · Yooldo · Frontend Engineer

**2023.04 ~ 2024.10 (1년 7개월)**

Web2 게임의 Web3 전환을 돕는 블록체인 게이밍 플랫폼 Yooldo(https://www.yooldo.gg)와 게임 온보딩을 지원했습니다. Yooldo는 Linea 체인 최대 규모의 GameFi 플랫폼으로, ESPORTS 토큰이 Binance Alpha·Bitget·MEXC 등 주요 거래소에 상장돼 있습니다.

- 리브랜딩(2023.07~11) 이후 사용자수 20,000%+ 증가. 월간 트랜잭션 1.38M+, 월간 거래량 $152.73K+. 2024.04 기준 DappRadar 게이밍 섹터 전체 26위, Linea 생태계 1위 트래픽.
- Yooldo x 리니아 파크 체인 협업 이벤트로 신규 유저 약 75만 명 유입. 서버측 트랜잭션 실행을 클라이언트측 실행+영수증 검증으로 바꿔 대규모 트래픽 부하를 낮춤.
- 8,888개 NFT 컬렉션을 일주일 만에 완판해 3억 원 이상 수익. MetaMask(Consensys)·Unisat 월렛·Facewallet(HaechiLabs) 팀과 영문 서면으로 버그·개선사항을 주고받으며 기술 협업.
- 디자인 시스템을 npm 라이브러리(catze-ui)로 분리, styled-components → Tailwind CSS 전환, SSR 도입, 토큰 저장을 localStorage → 쿠키로 이전.
- 딥링크 로그인(yooldo://game/troublepunk)과 백오피스 S3 해시 추적으로 게임 클라이언트 변조 감지.
- 백오피스로 운영 kill switch 10분+ 단축. Jury DAO(탈중앙화 어뷰징 신고 시스템), BRC-20 브릿지 구축·운영.
- 트랜잭션 영수증 분석을 통한 게임 재화 획득 검증 로직 개발.

기술: TypeScript, Next.js, TanStack Query, Framer Motion, Storybook, Node.js, Nest.js, Prisma, Viem, Wagmi, Vercel, GitHub Actions

---

### 블루포인트파트너스 · Frontend Engineer

**2021.07 ~ 2022.02 (8개월: 인턴 6개월 + 계약직 2개월)**

시드·pre-A 단계 테크 스타트업 전문 액셀러레이터. 6개월 인턴 후 2개월 계약직으로 전환해 근무했습니다.

- 3일 이상 소요되던 투자계약 문서 준비를 자동 생성 기능으로 1초 이내로 단축.
- 팀마다 엑셀로 분산 관리되던 투자 분야별 데이터를 취합해 시계열·장소별 차트로 시각화.
- 투자 심사역 사용자 인터뷰를 통한 스타트업 발굴 과정 UX 개선.
- 홈페이지 투자 제안 유입을 Slack 채널과 연동하는 알림 서비스 구축.

기술: TypeScript, React.js, Jest, recharts, styled-components, AWS S3 + Route53

---

### 테이스팅벤처 · FOUND · Founder

**2018.12 ~ 2019.06 (7개월)** · 서비스 자체는 2020.02까지 운영

GPS 기반 위치 서비스 연구소 스타트업 테이스팅벤처에서 분실물 습득/보상 모바일 플랫폼 FOUND를 개발했습니다. 용인·경기 지역에서 운영했고, 플레이스토어 5천 다운로드를 기록했습니다.

- Android Studio(Java), Retrofit, Glide를 사용한 습득물 리포트 기능 개발.
- Angular, Ionic Framework를 사용한 하이브리드 앱 개발.
- 카카오톡 챗봇 분실물 신고 + Flask/MongoDB 챗봇 서버 구축.

기술: Java, Android Studio, Retrofit2, Glide, Angular, Ionic Framework, Python, Flask, MongoDB

---

## 학력

- **단국대학교(경기) 전자전기공학부** · 2016.03 ~ 2023.02 졸업 · 학점 3.92/4.5
  - 졸업작품: Google Cloud TTS를 사용한 지류 책 리딩 스마트 기기
- 광주중앙고등학교 이과계열 · 2013.03 ~ 2016.02

## 경험 / 활동 / 교육

- **Open AI SDK 활용 서비스 구축** (2024.12 ~ 2025.01): 빗썸 SOL 투자 판단 트레이딩 봇 (https://github.com/howdyfrom2019/cex-trading-bot), elizaOS 기반 트위터 AI Agent (https://github.com/howdyfrom2019/aiko-airi-agent)
- **Alchemy University Ethereum Bootcamp 수료** (2024.09 ~ 2024.12)
- **인도네시아 발리 거주** (2023.09 ~ 2023.12): 디지털 노마드 네트워킹, 비즈니스 영어회화
- **예비창업패키지 수행** (2018.07 ~ 2019.06): FOUND 앱 운영, GPS 기반 하차 결제 모듈을 한성운수 24번 버스에서 테스트
- **비트코인서울 2024 해커톤** (2024.05, 논스)

## 자격 / 수상 / 특허

- 정보처리기사 (2020.12, 한국산업인력공단)
- [특허] 버스 요금 결제 방법 및 이를 수행하는 버스 요금 결제 서버 (2020.10, 특허청)
- 창업 아이디어 해커톤 대상 (2018.05, 경기창조경제혁신센터)
