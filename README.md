# jake-cv

김성주(Jake)의 CV 사이트. 한 컬럼, 키 컬러 하나, 랜딩은 한 페이지 요약이고 상세는 경력별 페이지로 들어간다. KR/EN 제공, CV·경력기술서 PDF 다운로드.

Next.js 15 + React 19 + Tailwind v4, Bun. 코드 수정 없이 `data/`의 JSON만 고치면 사이트와 PDF가 바뀐다.

## 실행

```bash
bun install
bun dev            # http://localhost:3000
bun run build:all  # next build + PDF 생성
```

PDF는 시스템 Chrome(headless)으로 `/print/{ko|en}/{cv|portfolio}`를 렌더해 `public/downloads/`에 저장한다. 데이터를 바꾸면 `bun run pdf`를 다시 돌려야 한다.

## 라우트

| 경로 | 내용 |
| --- | --- |
| `/` (EN), `/ko` (KR) | 랜딩. 이름, 후킹 문구, 직무 줄, 아이콘, 문서 미리보기 링크, 경력 요약, 글, 스택, 학력 |
| `/work/[id]`, `/ko/work/[id]` | 경력 상세. 성과, 프로젝트(문제 → 접근), 스택 |
| `/preview/{cv\|portfolio}`, `/ko/preview/...` | 이력서·경력기술서 미리보기. 상단 툴바에서 PDF 다운로드 |
| `/print/{locale}/{cv\|portfolio}` | 인쇄용 문서. PDF 생성 소스, 검색 제외 |
| `/downloads/jake-kim-{cv\|portfolio}-{ko\|en}.pdf` | 정적 PDF |

## 언어 선택

기본은 영어(`/`)이고 한국어는 `/ko`입니다. `middleware.ts`가 첫 방문 시 `Accept-Language`가 한국어면 `/ko`로 보내고, 방문한 언어를 `locale` 쿠키(1년)에 저장해 이후에는 사용자가 고른 언어를 유지합니다. 정적 파일, `/print`, `/downloads`, `llms.txt` 등은 미들웨어를 거치지 않습니다.

## 데이터

| 파일 | 역할 |
| --- | --- |
| `data/cv.ko.json`, `data/cv.en.json` | 같은 구조의 KR/EN 데이터. `profile`(headline, intro, tagline), `stack`, `experiences[]`, `education`, `credentials` |
| `data/ui.json` | 섹션 제목 등 UI 문구 |
| `data/posts.json` | 외부 블로그 글. 랜딩 "글" 섹션에 원문 링크로 나열 |
| `resume.md` | 사람이 읽는 이력서. `cv.ko.json`의 파생본 |

`experiences[]` 한 항목의 구조:

- `oneLiner`, `bullets[]` — 랜딩과 CV PDF에 나오는 요약 (2~3줄)
- `detail.description`, `detail.impact[]`, `detail.projects[]`(title, period, problem, approach[]), `detail.stack` — 상세 페이지와 경력기술서 PDF
- `compact: true` — 랜딩에서 "이전" 한 줄 목록으로 내려감

## 외부 블로그 글 포워딩

```bash
bun post:add https://blog.naver.com/xxx/123 --tags web3,career
bun post:list
```

OG 메타(제목, 요약, 발행일)를 읽어 `data/posts.json`에 넣고 호스트로 출처(naver, tistory, paragraph, medium, velog, brunch)를 판별한다. OG가 없으면 `--title "..." --date YYYY-MM-DD`로 직접 지정. 파일을 손으로 편집해도 된다.

## 용어 설명 패널 (glossary)

본문에서 `[[id]]` 또는 `[[id|표시 문구]]`로 표시한 용어는 점선 밑줄로 렌더되고, 누르면 우하단(모바일은 하단)에 터미널처럼 생긴 패널이 열려 설명을 쌓아 보여줍니다. 정의는 `data/glossary.json`에 `term.ko/en`, `ko`, `en`, `related[]`로 두고, 새 용어는 거기에 추가한 뒤 본문에 토큰을 넣으면 됩니다.

- 웹: `components/rich-text.tsx`가 토큰을 `<Term>`으로 바꾸고, `components/glossary-panel.tsx`가 패널 상태를 관리합니다. 같은 용어는 페이지에서 처음 나올 때만 링크가 되고(`firstOccurrenceOnly`), 상세 페이지에서는 설명·성과·첫 프로젝트까지만 용어 링크를 허용하고 나머지 프로젝트는 일반 텍스트로 둡니다.
- 헤더의 "용어(Glossary)" 버튼 또는 `G` 단축키를 누르면 그 페이지에 등장하는 용어 전체를 패널에 한 번에 띄웁니다(`collectTerms`로 페이지별 목록을 계산). 입력 필드에 포커스가 있거나 Cmd/Ctrl/Alt가 눌려 있으면 무시합니다.
- 외부 링크(프로젝트명, 스캐너, 원문)는 `.ext` 클래스로 실선 밑줄 + 우상향 chevron이 붙어 점선 밑줄인 용어와 구분됩니다.
- PDF·llms.txt: `lib/glossary.ts`의 `stripTerms`로 토큰을 표시 문구로 치환합니다. 경력기술서 PDF 끝에는 본문에 쓰인 용어만 모은 "용어 설명" 부록이 붙습니다.

## 실시간 시세 hovercard

본문의 `{{price:ETH:104.65|ETH 104.65}}`, `{{basket:USDC=72500,ETH=104.65,...|약 $1.5M}}` 토큰은 마우스를 올리면 Binance 공개 API(`/api/v3/ticker/price`)에서 현재가를 받아 달러로 환산해 보여줍니다(`components/price-hover.tsx`, 60초 캐시, USDC/USDT는 1달러 고정). 카드는 `document.body`에 포탈로 렌더되고 앵커의 `getBoundingClientRect()`를 기준으로 위치를 계산해 뷰포트 바깥으로 나가지 않도록 좌우/상하로 클램프합니다(모바일 포함). PDF·llms.txt에서는 라벨 문구만 남습니다.

## AI 에이전트 친화 (llms.txt)

[llmstxt.org](https://llmstxt.org/) 스펙을 따라 두 파일을 요청 시점에 생성합니다.

- `/llms.txt` — 소개, 경력 목록과 링크, PDF, 글 목록을 요약한 인덱스.
- `/llms-full.txt` — 두 언어 전체 이력·프로젝트·성과를 한 번에 담은 전문(全文).

둘 다 `lib/llms.ts`가 `data/cv.*.json`에서 그때그때 만들어 내므로 데이터를 바꾸면 재배포만으로 갱신됩니다. `app/robots.ts`와 `app/sitemap.ts`도 함께 있고, `<head>`에 `<link rel="llms.txt">`로 링크해 뒀습니다.

## 배포

Vercel에 그대로 올린다. `lib/data.ts`의 `SITE_URL`을 실제 도메인으로 바꾼다. PDF는 빌드 산출물이 아니라 `public/`에 커밋된 파일이므로, 데이터 수정 후 `bun run pdf`를 돌리고 함께 커밋한다.
