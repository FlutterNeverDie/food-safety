# 📣 앱인토스(AppsInToss) 2.0 광고 구현 인수인계 가이드

이 문서는 **"배달 위생 지킴이"** 프로젝트의 토스 통합 광고 시스템(AppsInToss 2.0 ADS) 구현 상세를 다룹니다. 전면, 배너, 리워드 광고의 핵심 로직과 코드를 포함하고 있습니다.

---

## 1. 개요 및 핵심 원칙

본 프로젝트는 **순수 웹뷰(WebView)** 환경에서 동작하는 토스 인앱 광고 2.0 시스템을 사용합니다.
- **Toss Ads 우선**: 토스 앱 내부(v5.244.1 이상)에서는 토스 네이티브 광고 소스를 사용합니다.
- **AdMob Fallback**: 지원되지 않는 환경(일반 브라우저 등)에서는 구글 애드몹 광고를 자동으로 불러와 수익을 보존하는 하이브리드 방식입니다.
- **호환성**: **React Native가 아닙니다.** 본 프로젝트는 순수 웹(React/TypeScript) 기반으로 구현되었으며, 브라우저 환경에서의 예외 처리가 포함되어 있습니다.

---

## 2. 광고 유형별 구현 가이드

### A. 리워드 광고 (Rewarded Ads)
시청 완료 시 혜택을 주는 광고입니다. (`ait-ad-test-rewarded-id`)

```tsx
import { loadFullScreenAd, showFullScreenAd } from '@apps-in-toss/web-framework';

const showRewarded = (onGrantReward: () => void) => {
  // safeIsSupported 등으로 환경 체크 후 실행
  const isSupported = loadFullScreenAd.isSupported() && showFullScreenAd.isSupported();
  
  if (!isSupported) {
    onGrantReward(); // 미지원 시 즉시 보상 (Fallback)
    return;
  }

  showFullScreenAd({
    options: { adGroupId: 'ait-ad-test-rewarded-id' },
    onEvent: (event) => {
      if (event.type === 'userEarnedReward') onGrantReward();
    }
  });
};
```

### B. 전면 광고 (Interstitial Ads)
화면 전환 시 노출되는 광고입니다. (`ait-ad-test-interstitial-id`)

### C. 배너 광고 (Banner Ads)
리스트 중간이나 하단에 고정되는 광고입니다. (`ait-ad-test-banner-id`)
- **높이**: 고정형 96px 권장.
- **모드**: `variant: 'card'` (둥근 모서리) 또는 `expanded` (전체 너비).

---

## 3. 환경별 대응 전략 (WebView 중심)

| 환경 | 동작 방식 | 개발자 조치 |
| :--- | :--- | :--- |
| **토스 앱 내부 (WebView)** | Toss Ads 우선 송출 | SDK 자동 대응 |
| **일반 브라우저 (Standalone)** | AdMob 하이브리드 전환 시도 | `isSupported` 체크로 에러 방지 |

---

## 4. 인수인계 핵심 포인트

1. **WebView 최적화**: 모든 광고 로직은 `window` 브릿지를 사용하는 웹 표준 방식으로 구현되었습니다. **RN 전용 설정은 불필요**합니다.
2. **에러 핸들링**: 일반 브라우저에서 `ReactNativeWebView` 에러를 방지하기 위해 반드시 `isSupported()` 체크를 통해 호출 범위를 제한했습니다.
3. **리워드 검증**: 반드시 `userEarnedReward` 이벤트를 확인하고 보상을 지급하세요.

---
**작성일**: 2026-03-13  
**담당**: Antigravity AI
