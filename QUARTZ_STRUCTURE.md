# Quartz 구성도

이 폴더는 `minjokim.kr`에 공개할 학술 글만 담는 Quartz 사이트다.

운영 원칙:

```text
Academic_WIKI 전체를 공개하지 않는다.
06_Published 중 quartz_status: ready_for_quartz 인 글만 공개한다.
```

## 1. 전체 구조

```text
03_Academic/
  Academic_WIKI/
    00_Inbox/              비공개 수집
    01_References/         비공개 근거 노트
    02_Concepts/           비공개 개념 노트
    04_Drafts/             비공개 후보/초안
    05_Ready_To_Publish/   비공개 발행 직전 검토본
    06_Published/          공개 가능 원본

  Academic_Quartz_v4/
    content/               Quartz가 읽는 공개 콘텐츠
      index.md             홈페이지
      research/            공개 연구 글
    public/                빌드 결과물
    quartz.config.ts       사이트 설정
    quartz.layout.ts       화면 레이아웃
    scripts/
      sync-published.ps1   06_Published -> content/research 동기화
    .github/workflows/
      deploy.yml           GitHub Pages 배포
```

## 2. 공개 흐름

```text
Academic_WIKI/06_Published
  조건:
    status: published
    quartz_status: ready_for_quartz
  ↓
scripts/sync-published.ps1
  ↓
Academic_Quartz_v4/content/research
  ↓
npx quartz build
  ↓
Academic_Quartz_v4/public
  ↓
GitHub Pages
  ↓
minjokim.kr
```

## 3. 공개되는 것과 공개되지 않는 것

공개되는 것:

```text
content/index.md
content/research/*.md
```

공개되지 않는 것:

```text
Academic_WIKI/00_Inbox
Academic_WIKI/01_References
Academic_WIKI/02_Concepts
Academic_WIKI/04_Drafts
Academic_WIKI/05_Ready_To_Publish
Academic_Quartz_v4/scripts
Academic_Quartz_v4/docs
```

## 4. 주요 설정

파일:

```text
quartz.config.ts
```

현재 핵심값:

```text
pageTitle: 김민조 연구노트
locale: ko-KR
baseUrl: minjokim.kr
font: Noto Sans KR
CNAME: minjokim.kr
RSS/Sitemap: enabled
```

## 5. 평소 명령

공개 글 동기화:

```powershell
.\scripts\sync-published.ps1
```

로컬 빌드:

```powershell
npx quartz build
```

로컬 미리보기:

```powershell
npx quartz build --serve --port 8080
```

미리보기 주소:

```text
http://localhost:8080
```

## 6. 혼동 방지

`Academic_Quartz_v5_experimental`은 처음 시도한 Quartz 5 실험 폴더다.
현재 운영 대상이 아니다.

운영 대상은 아래 폴더 하나다.

```text
Academic_Quartz_v4
```

