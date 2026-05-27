# SEO and Indexing Plan

## 방향

minjokim.kr은 홍보 사이트가 아니라 공개 연구노트다. SEO의 목적은 검색 유입 자체보다, 연구 글이 Google, Naver, 그리고 AI 검색 시스템에서 정확한 저자, 주제, 발행일, 문맥으로 해석되도록 하는 것이다.

## 날짜 원칙

- 글 상세 페이지에는 발행일을 표시한다.
- 첫 화면의 최신 글에는 글이 3개 이상 쌓인 뒤 작은 날짜 표기를 검토한다.
- Markdown frontmatter에는 `published`, `created`, `description`, `author`, `tags`를 반드시 둔다.
- 단순 수정일보다 최초 발행일을 우선 노출한다.

## 필수 메타데이터

각 발행 글은 아래 항목을 갖는다.

- `title`: 검색 결과 제목
- `description`: 검색 결과 설명과 AI 요약의 기준 문장
- `published`: 최초 발행일
- `author`: 김민조
- `tags`: 연구 범주와 핵심 이론어

## 사이트 수준 신호

- `sitemap.xml`: Quartz가 자동 생성한다.
- `index.xml`: Quartz가 RSS로 자동 생성한다.
- `robots.txt`: 루트에 배치하고 sitemap 위치를 명시한다.
- `canonical`: 각 페이지의 대표 URL을 명시한다.
- `JSON-LD`: 홈은 `WebSite`, 글은 `Article` 구조화 데이터를 사용한다.

## 검색 등록 운영

1. Google Search Console에 `https://minjokim.kr` 등록
2. 소유권 확인 메타태그 또는 DNS TXT 발급 후 반영
3. `https://minjokim.kr/sitemap.xml` 제출
4. Naver Search Advisor에 사이트 등록
5. Naver 소유확인 메타태그 또는 HTML 파일 반영
6. Naver에 `sitemap.xml`과 `robots.txt` 검사 제출
7. 주요 글 발행 후 수집 요청

## 향후 분류 확장

글이 10개 이상 쌓이면 다음 축으로 분류 페이지를 만든다.

- 이론의 경계조건
- 방법론과 개념모델
- AI와 업무 구조
- 조직의 실행 회로

글이 30개 이상 쌓이면 별도 인덱스 페이지를 만든다.

- 이론별 인덱스
- 개념모델 인덱스
- 연구 질문 인덱스
- 발행 연도별 인덱스

## AI 검색 대비

- 제목은 질문형 또는 개념형으로 명확하게 쓴다.
- 첫 3문단 안에 글의 핵심 주장과 이론적 위치를 밝힌다.
- 학자명은 가능한 한 원문 병기를 유지한다.
- 각주와 참고문헌은 발행 글에 남긴다.
- 추후 `llms.txt` 또는 연구노트 요약 인덱스가 실질 표준으로 굳으면 별도 추가한다.
