# minjokim.kr 도메인 연결 가이드

현재 목표:

```text
Academic_Quartz_v4
  ↓
GitHub Pages
  ↓
minjokim.kr
```

## 1. 현재 상태

완료:

```text
Quartz v4 사이트 생성
로컬 빌드 성공
로컬 미리보기 성공: http://localhost:8080
baseUrl: minjokim.kr
public/CNAME: minjokim.kr
GitHub Pages deploy.yml 생성
```

현재 DNS 조회 결과:

```text
minjokim.kr
  75.2.85.42
  99.83.196.71

www.minjokim.kr
  minjokim.kr 로 alias
```

판단:

```text
아직 GitHub Pages로 연결된 상태가 아니다.
현재 A 레코드는 GitHub Pages 공식 IP가 아니다.
```

## 2. GitHub 저장소 준비

GitHub에 새 저장소를 만든다.

추천 이름:

```text
minjokim.kr
```

또는:

```text
minjokim-research
```

저장소 생성 후 이 폴더에서 remote를 연결한다.

```powershell
git remote add origin https://github.com/<GitHub아이디>/<저장소명>.git
git add .
git commit -m "Set up Quartz academic research site"
git push -u origin v4
```

현재 `upstream`은 Quartz 원본 저장소다.
실수로 원본 저장소에 push하지 않도록 `origin`은 아직 비워둔 상태다.

## 3. GitHub Pages 설정

GitHub 저장소에서:

```text
Settings
  → Pages
  → Source: GitHub Actions
```

Actions 탭에서 `Deploy Quartz site to GitHub Pages`가 성공해야 한다.

Custom domain:

```text
minjokim.kr
```

Enforce HTTPS:

```text
DNS 전파 후 활성화
```

## 4. DNS 설정

도메인을 구매한 곳의 DNS 관리 화면에서 현재 A 레코드를 GitHub Pages로 바꾼다.

### Apex domain

이름:

```text
@
```

값:

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

### www

이름:

```text
www
```

값:

```text
<GitHub아이디>.github.io
```

유형:

```text
CNAME
```

주의:

```text
www를 minjokim.kr로 CNAME 연결하지 않는다.
GitHub Pages에서는 www가 <GitHub아이디>.github.io 를 보도록 잡는 편이 안정적이다.
```

## 5. 연결 확인 명령

DNS 변경 후 확인:

```powershell
nslookup minjokim.kr
nslookup www.minjokim.kr
```

기대값:

```text
minjokim.kr
  185.199.108.153
  185.199.109.153
  185.199.110.153
  185.199.111.153

www.minjokim.kr
  <GitHub아이디>.github.io
```

## 6. 아직 필요한 정보

Codex가 다음 단계까지 진행하려면 아래 둘 중 하나가 필요하다.

```text
1. GitHub 저장소 URL
2. GitHub 아이디와 새 저장소 이름
```

DNS 변경은 도메인 구매처의 관리 화면에서 해야 한다.
민조님이 도메인 관리 화면을 열어주면, 어떤 값을 넣어야 하는지 옆에서 맞춰줄 수 있다.

