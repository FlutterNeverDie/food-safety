# 📣 앱인토스(AppsInToss) 2.0 광고 구현 인수인계 가이드

이 문서는 **"집온다"** 프로젝트의 토스 통합 광고 시스템(AppsInToss 2.0 ADS) 구현 상세를 다룹니다. 전면, 배너, 리워드 광고의 핵심 로직과 코드를 포함하고 있습니다.

---

## 1. 개요 및 핵심 원칙

앱인토스 2.0 통합 광고 시스템은 환경에 따라 최적의 플랫폼을 자동 선택합니다.
- **Toss Ads 우선**: 토스 앱 내부(v5.244.1 이상)에서는 토스 네이티브 광고 소스를 사용합니다.
- **AdMob Fallback**: 지원되지 않는 환경에서는 구글 애드몹 광고를 자동으로 불러와 수익을 보존합니다.
- **단일 인터페이스**: 하나의 `adGroupId`와 SDK API를 통해 두 플랫폼을 모두 제어합니다.

---

## 2. 광고 유형별 구현 가이드

### A. 리워드 광고 (Rewarded Ads)
사용자가 광고를 끝까지 시청했을 때 보상을 지급하는 방식입니다.

```tsx
import { loadFullScreenAd, showFullScreenAd } from '@apps-in-toss/web-framework';

const REWARDED_ID = 'ait-ad-test-rewarded-id'; // 테스트용 보상형 ID

// 1. 광고 로드 (화면 진입 시 권장)
const loadRewarded = () => {
  loadFullScreenAd({
    options: { adGroupId: REWARDED_ID },
    onEvent: (e) => e.type === 'loaded' && console.log('리워드 로드 완료'),
    onError: (err) => console.error(err)
  });
};

// 2. 광고 실행
const showRewarded = (onGrantReward: () => void) => {
  showFullScreenAd({
    options: { adGroupId: REWARDED_ID },
    onEvent: (event) => {
      if (event.type === 'userEarnedReward') {
        // 🔥 중요: 이 시점에만 보상을 지급해야 함
        onGrantReward();
      }
      if (event.type === 'dismissed') {
        loadRewarded(); // 닫히면 다음을 위해 다시 로드
      }
    },
    onError: (err) => console.error(err)
  });
};
```

### B. 전면 광고 (Interstitial Ads)
화면 전환 시 전체 화면을 덮는 광고입니다. 리워드와 API가 동일하며 `adGroupId`로 구분됩니다.

```tsx
const INTERSTITIAL_ID = 'ait-ad-test-interstitial-id'; // 테스트용 전면 ID

const showInterstitial = () => {
  showFullScreenAd({
    options: { adGroupId: INTERSTITIAL_ID },
    onEvent: (event) => {
      if (event.type === 'impression') console.log('수익 발생 시점');
      if (event.type === 'dismissed') console.log('광고 닫힘');
    },
    onError: (err) => console.error(err)
  });
};
```

### C. 배너 광고 (Banner Ads)
화면 내 특정 영역(리스트 중간, 하단 고정 등)에 삽입되는 광고입니다.

```tsx
import { TossAds } from '@apps-in-toss/web-framework';
import { useEffect, useRef } from 'react';

const BANNER_ID = 'ait-ad-test-banner-id'; // 리스트형 배너 테스트 ID

const BannerComponent = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. SDK 초기화 (앱 실행 시 한 번만 수행 권장)
    TossAds.initialize({
      callbacks: { onInitialized: () => console.log('ADS 초기화 완료') }
    });

    // 2. 배너 부착
    if (containerRef.current) {
      const banner = TossAds.attachBanner(BANNER_ID, containerRef.current, {
        variant: 'expanded', // 전체 너비
        theme: 'auto',       // 다크모드 대응
        callbacks: {
          onAdRendered: () => console.log('배너 노출됨')
        }
      });

      // 3. 클린업 (메모리 누수 방지)
      return () => banner.destroy();
    }
  }, []);

  // 고정형 가이드: width 100%, height 96px 권장
  return <div ref={containerRef} style={{ width: '100%', height: '96px' }} />;
};
```

---

## 3. 환경별 Fallback 전략

| 환경 | 동작 방식 | 개발자 조치 |
| :--- | :--- | :--- |
| **토스 앱 내부** | Toss Ads 우선 → 실패 시 AdMob | SDK 기본 동작 (추가 코드 불필요) |
| **토스 앱 외부** | AdMob 단독 지원 | `isSupported()` 체크 후 예외 처리 |
| **브라우저 테스트** | Mocking | 개발용 Mock 데이터 노출 권장 |

---

## 4. 인수인계 핵심 포인트

1. **테스트 ID 주의**: 런칭 시에는 반드시 토스 파트너 센터에서 발급받은 **실제 AD ID**로 교체해야 합니다. 
2. **비동기 흐름**: 광고 로드(`load`)와 노출(`show`) 사이에는 반드시 `loaded` 이벤트 확인이 필요합니다.
3. **리워드 검증**: `dismissed`는 단순히 광고가 닫힌 것이므로, 반드시 `userEarnedReward` 이벤트에서만 아이템/권한을 지급하세요.
4. **배너 제거**: 리액트 컴포넌트 언마운트 시 반드시 `banner.destroy()`를 호출해야 합니다.

---
**작성일**: 2026-03-13  
**담당**: Antigravity AI
