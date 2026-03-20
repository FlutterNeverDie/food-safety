# 프로젝트 목적 및 개요 (PRD)

너는 지금부터 토스(Toss) 미니앱 생태계(`@apps-in-toss/web-framework`) 위에서 돌아가는 **'배달 맛집 위생 확인하기'** 프론트엔드 개발자야.

사용자가 배달 음식을 시키기 전에 식당 상호명을 검색하면, 과거 식품위생법 위반 적발 이력을 보여주는 서비스야.

비즈니스 로직의 핵심은 **'결과를 보기 전에 반드시 광고(Ad)를 시청하도록 유도하는 것'**이며, 화면 UI는 반드시 **Toss Design System(TDS) 스타일 가이드**를 기반으로 직접 구현하여 적용해야 해.

# 엄격한 기술 스택 (버전 준수 필수)

- **Core**: React (18.3.1), Vite (^7.3.1), TypeScript (5.7.2)
- **Toss Ecosystem (팝업/모달)**: `@toss/use-overlay` (^1.4.2) - 바텀 시트/모달 트리거용, `@apps-in-toss/web-framework` (1.9.0)
- **Build/Config**: `granite.config.ts`
- **Styling / Design**: Vanilla CSS (CSS는 브라우저 자체 표준 기술이므로 `@toss/tds-mobile`과 같은 별도 npm 패키지를 설치하지 않는다.) + Tailwind CSS (3.4.17)

  *(원칙: 버튼, 타이포그래피 등 UI 컴포넌트는 @toss/tds-mobile 대신 Vanilla CSS를 사용해 TDS 가이드를 구현하고, 레이아웃/여백은 Tailwind 처리)*
- **State & Routing**: Zustand (^5.0.10), React Router DOM (^7.12.0)
- **Icons**: Lucide React (^0.562.0)
- **Backend**: Firebase (^11.10.0)

# 핵심 유저 플로우 및 화면 기획

1. **검색 화면 (`/`)**:

   - TDS 스타일의 타이포그래피와 Input UI를 CSS로 직접 구현.
   - 중앙에 "식당 상호명을 검색해보세요" 텍스트와 검색창 배치.
   - 검색어 상태 관리는 Zustand 스토어(`useSearchStore`)를 생성해서 관리할 것.
2. **로딩 & 티징 오버레이 (Teaser View - `use-overlay` 활용)**:

   - 검색 버튼 클릭 시 새로운 페이지로 넘기지 말고, `@toss/use-overlay`를 사용하여 바텀시트(BottomSheet)나 전체 모달을 띄울 것.
   - 내용: "⚠️ 과거 적발 이력이 발견되었습니다!" + TDS 스타일의 파란색 꽉 찬 버튼(`[광고 보고 결과 확인하기]`).
3. **결과 화면 (`/result`)**:

   - 모달에서 광고 시청(현재는 Mock 딜레이 3초) 완료 시 라우터를 통해 `/result` 페이지로 이동.
   - Zustand 스토어에 저장된 가짜 데이터를 바탕으로 위반 일자, 내역 등을 TDS 스타일의 Card/List 규격으로 렌더링.

# 첫 번째 개발 태스크 (Action Item)

위 PRD와 기술 스택을 완벽하게 반영하여 초기 프로젝트 뼈대 코드를 작성해 줘.

특히 1) Zustand를 이용한 상태 관리 스토어 코드, 2) `@toss/use-overlay`를 활용하여 선언적으로 팝업(티징 화면)을 띄우는 로직, 3) Vanilla CSS를 통해 TDS 스타일을 직접 구현한 검색 화면과 결과 화면 컴포넌트 코드를 제시해 줘. API 연동은 가짜 데이터(Mock)로 처리해.
