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
| `/`, `/en` | 랜딩. 이름, 후킹 문구, 커리어 흐름(블록체인 → 게임 → 컨트랙트 → 트레이딩 터미널), 아이콘, PDF 다운로드, 경력 요약, 글, 스택, 학력 |
| `/work/[id]`, `/en/work/[id]` | 경력 상세. 성과, 프로젝트(문제 → 접근), 스택 |
| `/print/{locale}/{cv\|portfolio}` | 인쇄용 문서. PDF 생성 소스, 검색 제외 |
| `/downloads/jake-kim-{cv\|portfolio}-{ko\|en}.pdf` | 정적 PDF |

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

## 배포

Vercel에 그대로 올린다. `lib/data.ts`의 `SITE_URL`을 실제 도메인으로 바꾼다. PDF는 빌드 산출물이 아니라 `public/`에 커밋된 파일이므로, 데이터 수정 후 `bun run pdf`를 돌리고 함께 커밋한다.
