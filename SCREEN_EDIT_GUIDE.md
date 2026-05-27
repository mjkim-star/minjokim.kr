# Quartz 화면 조정 가이드

Quartz는 관리자 화면에서 버튼으로 꾸미는 도구가 아니라, 파일을 고쳐서 화면을 조정하는 정적 사이트 생성기다.

민조님이 직접 고치거나 Codex에게 요청할 때는 아래 기준으로 말하면 된다.

## 1. 첫 화면 문구를 바꾸고 싶을 때

수정 파일:

```text
content/index.md
```

바뀌는 것:

```text
홈 첫 문장
내 소개
연구 목적
최근 글 목록
연구 범주
앞으로의 목차
```

예시 요청:

```text
첫 화면을 더 학술지 느낌으로 바꿔줘.
내 소개를 더 짧게 하고 연구 범주를 네 개 카드처럼 보이게 해줘.
최근 글을 위로 올려줘.
```

## 2. 사이트 이름, 도메인, 언어, 폰트를 바꾸고 싶을 때

수정 파일:

```text
quartz.config.ts
```

현재 핵심값:

```text
pageTitle: 김민조 연구노트
locale: ko-KR
baseUrl: minjokim.kr
font: Noto Sans KR
```

예시 요청:

```text
사이트 제목을 김민조 Academic Lab으로 바꿔줘.
폰트를 더 차분한 느낌으로 바꿔줘.
색상을 더 논문/저널 느낌으로 조정해줘.
```

## 3. 왼쪽/오른쪽 사이드바 구성을 바꾸고 싶을 때

수정 파일:

```text
quartz.layout.ts
```

현재 구조:

```text
왼쪽:
  사이트 제목
  검색
  다크모드
  리더모드
  폴더 탐색

오른쪽:
  그래프
  목차
  백링크
```

예시 요청:

```text
오른쪽 그래프를 없애고 목차만 남겨줘.
왼쪽 탐색을 더 단순하게 해줘.
첫 화면에서는 사이드바를 줄이고 글 화면에서만 목차를 보여줘.
```

## 4. 색상, 간격, 카드 느낌, 첫 화면 꾸밈을 바꾸고 싶을 때

수정 파일:

```text
quartz/styles/custom.scss
```

바뀌는 것:

```text
홈 화면 여백
제목 크기
문단 간격
연구 범주 카드 스타일
링크 색
전체 분위기
```

예시 요청:

```text
첫 화면을 조금 더 꾸며줘.
연구 범주를 카드처럼 보이게 해줘.
학술적이지만 너무 딱딱하지 않게 색을 조정해줘.
```

## 5. 글 목록과 목차를 바꾸고 싶을 때

수정 대상:

```text
content/index.md
content/research/*.md
```

지금은 글이 1개뿐이라 첫 화면에 직접 링크를 넣었다.
글이 늘어나면 아래처럼 구조를 바꿀 수 있다.

```text
연구 에세이
방법론 노트
이론 노트
시각자료
연구 질문
```

## 6. 공개 글을 추가할 때

원본 위치:

```text
Academic_WIKI/06_Published
```

공개 조건:

```text
status: published
quartz_status: ready_for_quartz
quartz_user_approved: true
```

`quartz_user_approved: true`는 김민조가 최종 글을 확인한 뒤에만 넣는다.
이 값이 없으면 Published 폴더에 있어도 Quartz로 넘어가지 않는다.

동기화:

```powershell
.\scripts\sync-published.ps1
```

빌드:

```powershell
npx quartz build
```

## 7. 한 줄로 요청하는 법

Codex에게 이렇게 말하면 된다.

```text
Quartz 첫 화면을 더 학술적이고 보기 좋게 꾸며줘.
오른쪽 그래프는 빼고 목차만 남겨줘.
연구 범주를 카드 형태로 바꿔줘.
글 목록을 연구 에세이/방법론 노트/이론 노트로 나눠줘.
```
