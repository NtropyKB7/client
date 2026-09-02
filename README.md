<p align="center">
  <img src="./public/icons/icon-512.png" alt="Ntropy Logo" width="120" />
</p>

<h1 align="center">Ntropy</h1>

<p align="center">
  <strong>N잡러를 위한 소득·근무 관리 PWA</strong>
</p>

<p align="center">
  <a href="#-주요-기능">주요 기능</a> •
  <a href="#-기술-스택">기술 스택</a> •
  <a href="#-시작하기">시작하기</a> •
  <a href="#-프로젝트-구조">프로젝트 구조</a> •
  <a href="#-주요-플로우">주요 플로우</a>
</p>

---

## 📸 스크린샷

<!-- 스크린샷 촬영 후 docs/screenshots/ 에 추가하고 아래 경로를 채워주세요 -->

<p align="center">
  <img src="./docs/screenshots/home.png" alt="홈 화면" width="800" />
  <br/>
  <em>홈 화면 - 목표 진행률과 AI 인사이트</em>
</p>

<p align="center">
  <img src="./docs/screenshots/onboarding.png" alt="온보딩 - 목표 설정" width="400" />
  <img src="./docs/screenshots/job-setup.png" alt="온보딩 - 정기잡 등록" width="400" />
  <br/>
  <em>온보딩 (계좌 연동 / 목표 설정 / 정기잡 등록)</em>
</p>

<p align="center">
  <img src="./docs/screenshots/calendar.png" alt="캘린더" width="800" />
  <br/>
  <em>캘린더 - 근무 확정/정산 상태 관리</em>
</p>

<p align="center">
  <img src="./docs/screenshots/defense-mode.png" alt="방어모드" width="400" />
  <img src="./docs/screenshots/report.png" alt="리포트" width="400" />
  <br/>
  <em>방어모드 (소득 초과 대응) / 월간 리포트</em>
</p>

---

## 🎬 데모 영상

<!-- 데모 영상 링크와 썸네일을 추가해주세요 -->

<p align="center">
  <a href="#">
    <img src="./docs/demo-thumbnail.png" alt="데모 영상" width="600" />
  </a>
  <br/>
  <em>▶️ 클릭하여 데모 영상 보기</em>
</p>

---

## ✨ 주요 기능

### 🧭 온보딩

- **계좌 연동**: 오픈뱅킹 계좌를 연결해 입출금 내역 자동 분석
- **정기잡 자동 감지**: 연동된 계좌 입금 내역에서 알바/정기잡 후보를 탐지해 등록
- **목표 설정**: 월 목표 소득과 근무 강도(피로도)를 슬라이더로 설정하고 달성 가능 범위 확인

### 🏠 홈 대시보드

- **목표 진행률**: 이번 달 목표 소득/근무시간 대비 확정·예정 실적을 이중 프로그레스 바로 시각화
- **AI 인사이트**: 소득 패턴을 분석한 인사이트 카드와 맞춤 추천 상품 제공
- **피로도 배지**: 근무 강도를 기반으로 한 피로도 점수 표시
- **알바 추천**: 목표 달성을 돕는 추가 잡 추천 카드

### 📅 캘린더

- **일별 근무 확인**: 날짜별 근무 일정을 확정/정산완료 상태로 색상 구분하여 표시
- **정기잡 관리**: 등록된 정기잡의 근무 시간을 스크롤 선택 방식으로 간편하게 입력

### 🛡️ 방어모드 (Pro)

- **소득 초과 대응**: 건강보험 피부양자 자격 등 소득 기준 초과가 예상될 때 대응 모드 진입
- **생존 계산기 / 예상 손실 카드**: 초과 시 예상 손실액과 대응 방안 계산
- **체크리스트**: 고정비 절감 체크리스트, 보험금 청구 체크리스트 제공
- **신고 지원**: 소득 신고(Declaration) 폼 제공

### 📊 리포트

- **월간 정산 리포트**: 월별 소득/근무 리포트 목록 및 상세 조회

### 👤 마이페이지

- **프로필/계좌 관리**: 연동 계좌 목록 관리 및 비활성화
- **구독 관리**: Basic/Pro 플랜 구독 상태 확인, 결제 수단 관리 (PortOne 연동)
- **알림/권한 관리**: 알림 수신 동의, 위치 등 권한 관리

### 🔐 인증

- **소셜 로그인**: 카카오/구글 OAuth 로그인
- **체험 모드**: 로그인 없이 목데이터로 서비스를 둘러볼 수 있는 체험 모드

---

## 🛠 기술 스택

### Frontend

| 기술            | 설명                                    |
| --------------- | --------------------------------------- |
| **Vue 3**       | Composition API, `<script setup>`       |
| **Vite**        | 빌드 도구                               |
| **Vue Router**  | 클라이언트 라우팅                       |
| **JavaScript**  | 타입스크립트 미사용 (plain JS)          |

### 상태/데이터 관리

| 기술                   | 설명                     |
| ---------------------- | ------------------------ |
| **Pinia**              | 전역 상태 관리           |
| **TanStack Vue Query** | 서버 상태 관리 및 캐싱   |
| **Axios**              | HTTP 클라이언트          |

### 스타일링

| 기술              | 설명                                             |
| ----------------- | ------------------------------------------------ |
| **Tailwind CSS 4**| CSS-first 테마 (`@theme`, `@utility`), 유틸리티 클래스만 사용 |
| **Pretendard**    | 전역 폰트 (CDN)                                  |

### 기타

| 기술                    | 설명                          |
| ----------------------- | ----------------------------- |
| **@portone/browser-sdk**| 결제(구독) 연동               |
| **vite-plugin-pwa**     | PWA(설치, 서비스워커) 지원    |

### 개발 도구

| 기술         | 설명                                   |
| ------------ | -------------------------------------- |
| **oxlint**   | 1차 린팅 (`--fix`)                     |
| **ESLint**   | 2차 린팅 (`--fix --cache`)             |
| **Prettier** | 코드 포맷팅 (`src/`)                   |
| **pnpm**     | 패키지 매니저                          |

---

## 🚀 시작하기

### 필수 요구사항

- **Node.js** `^22.18.0` 또는 `>=24.12.0`
- **pnpm** (이 저장소는 pnpm을 사용합니다 — npm/yarn 사용 금지)

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd client

# 의존성 설치
pnpm install
```

### 환경 변수 설정

프로젝트 루트에 `.env.development` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# API 서버 (비워두면 로그인 시 목데이터로 동작)
VITE_API_BASE_URL=http://localhost:8080/api

# 카카오/구글 소셜 로그인 클라이언트 ID
VITE_KAKAO_CLIENT_ID=your-kakao-client-id
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

> `VITE_API_BASE_URL`이 비어 있으면 로그인 관련 로직이 실제 백엔드 없이 목데이터로 성공 처리됩니다. (`src/features/auth/store.js` 참고)

### 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 `http://localhost:5173`으로 접속하세요.

### 빌드

```bash
# 프로덕션 빌드
pnpm build

# 빌드 미리보기
pnpm preview
```

### 기타 스크립트

```bash
# 린팅 (oxlint → eslint 순서로 --fix 실행, 파일을 직접 수정합니다)
pnpm lint

# 포맷팅 (src/ 대상)
pnpm format
```

---

## 📁 프로젝트 구조

```
src/
├── app/
│   └── router/           # Vue Router 설정 및 인증/온보딩 라우트 가드
│
├── features/             # 기능 단위 모듈 (View + co-located store)
│   ├── auth/             # 로그인, OAuth 콜백
│   ├── onboarding/       # 계좌 연동, 정기잡 등록, 목표 설정
│   ├── home/             # 홈 대시보드
│   ├── calendar/         # 근무 일정 캘린더
│   ├── defense-mode/     # 소득 초과 방어모드 (Pro)
│   ├── report/           # 월간 정산 리포트
│   ├── mypage/           # 프로필, 구독, 계좌/알림 관리
│   └── notification/     # 알림
│
├── shared/               # 기능 간 공유 코드
│   ├── api/              # axios 인스턴스, 목데이터 모드, 공통 요청 헬퍼
│   ├── components/       # 공용 UI 컴포넌트
│   │   └── icons/        # SVG 아이콘 컴포넌트 (currentColor 기반)
│   ├── store/            # 전역 Pinia 스토어 (모달 등)
│   └── utils/            # 유틸리티 함수
│
├── style.css             # Tailwind v4 테마 토큰 (@theme, @utility)
└── main.js               # 엔트리 포인트
```

각 기능(`features/<name>`)은 `<Name>View.vue`를 기본으로 하고, 필요 시 `store.js`(Pinia), `api.js`(데이터 요청), `components/`(하위 컴포넌트)를 함께 둡니다.

---

## 📋 주요 플로우

### 1. 온보딩 플로우

```
소셜 로그인 → 계좌 연동 → 계좌 분석 중 → 정기잡 확인/등록 → 목표(소득/근무) 설정 → 홈
```

### 2. 근무 확정 플로우

```
캘린더에서 근무 등록 → 근무 확정 → 정산완료 상태 반영 → 리포트에 집계
```

### 3. 방어모드 플로우 (Pro)

```
소득 초과 감지 → 방어모드 진입 → 생존 계산기/예상 손실 확인 → 체크리스트 대응 → 신고
```

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes with [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:` 등)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👥 팀

| 이름   | 역할     | GitHub                                 |
| ------ | -------- | --------------------------------------- |
| 김동현 | Frontend | [@Kimd0ng](https://github.com/Kimd0ng) |

---

<p align="center">
  Made with 💚 by Ntropy Team
</p>
