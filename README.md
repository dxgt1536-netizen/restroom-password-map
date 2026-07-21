# 화장실 비밀번호 지도 앱

네이버 지도에서 건물을 클릭/검색해 화장실 비밀번호를 저장하고 다시 찾아볼 수 있는 개인용 웹앱입니다. 저장한 항목은 브라우저의 `localStorage`에만 남고, 서버는 장소명 검색을 위한 프록시 용도로만 아주 작게 사용합니다.

## 1. Node.js 설치

이 프로젝트를 실행하려면 Node.js가 필요합니다.

1. https://nodejs.org 에서 LTS 버전을 내려받아 설치
2. 설치 후 새 터미널을 열어 확인: `node -v`, `npm -v`

## 2. 네이버 지도 API 키 발급 (지도 표시용)

1. [네이버 클라우드 플랫폼](https://www.ncloud.com)에 가입/로그인
2. Console → Services → Application Services → Maps → Application 등록
3. API 선택에서 **Web Dynamic Map**과 **Geocoding**을 체크 (Dynamic Map을 빼먹으면 429 오류 발생)
4. Web 서비스 URL에 `http://localhost:5173`, `http://localhost`, `http://127.0.0.1:5173`을 모두 등록
5. 발급된 **Client ID**를 복사 (스크립트에서는 `ncpKeyId` 파라미터로 사용됨 — 신규 발급 키 기준)

## 3. 네이버 검색 API 키 발급 (장소명 검색용)

지하철역·상호명 같은 장소명 검색("신천역" 등)은 지도 API의 geocoder만으로는 안 되어서, 네이버의 지역 검색 API를 별도로 붙였습니다. 이건 위 Maps 키와는 **완전히 다른 키**이며, 서버 쪽에서만 사용되고 브라우저에는 노출되지 않습니다.

1. [네이버 개발자센터](https://developers.naver.com/apps/#/register)에서 애플리케이션 등록
2. 사용 API에서 **검색**을 선택
3. 발급된 **Client ID**와 **Client Secret**을 복사

## 4. 프로젝트 설정

```bash
npm install
copy .env.example .env
```

`.env` 파일을 열어 아래 값을 채웁니다.
- `VITE_NAVER_MAP_CLIENT_ID`: 2번에서 발급받은 Maps Client ID
- `NAVER_SEARCH_CLIENT_ID`, `NAVER_SEARCH_CLIENT_SECRET`: 3번에서 발급받은 검색 API 키

## 5. 실행

```bash
npm run dev
```

브라우저에서 안내된 주소(기본 http://localhost:5173)로 접속합니다.

## 사용법

- 지도를 클릭하면 해당 위치에 비밀번호를 등록하는 창이 뜹니다.
- 검색창에 주소를 입력하면 바로 이동하고, 장소명(역 이름, 상호명 등)을 입력하면 지역 검색으로 주소를 찾은 뒤 이동합니다.
- 저장된 마커를 클릭하면 비밀번호와 복사 버튼, 수정/삭제 버튼이 있는 말풍선이 뜹니다.
- 왼쪽(모바일에서는 위쪽) 목록에서도 전체 항목을 검색·이동·삭제할 수 있습니다.
- 비밀번호 데이터 자체는 서버로 전송되지 않고 현재 브라우저의 `localStorage`에만 저장되며, 다른 기기나 브라우저와 공유되지 않습니다.
