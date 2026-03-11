---
trigger: manual
---

# 앱인토스 광고 2.0 (보상형/전면형) 도입 로직 가이드 (AI 인수인계용)

이 문서는 앱인토스 환경에서 제공하는 **'인앱 광고 2.0 ver2' (보상형 리워드 광고)** 기능을 프로젝트에 연동하기 위한 로직과 가이드라인을 담고 있습니다. 다른 AI 시각 및 개발 참조용으로 정리된 명세서입니다.

## 1. 현재 구현된 모의(Mock) 로직 현황
현재 `src/components/RewardAd.tsx`에 실제 광고 연동 전의 임시 UI가 다음과 같이 구현되어 있습니다. 이를 제거하고 실제 SDK로 교체해야 합니다.

- **표출 방식**: 화면 전체를 덮는 Overlay 형태
- **동작 방식**: `useEffect`와 `setTimeout`을 통해 5초 카운트다운 진행
- **보상 지급**: 5초 타이머가 0이 되면 제안권(보상)이 지급되었다는 UI 패널로 전환
- **콜백 구조**:
  - `onComplete()`: 보상 획득 후 다음 스텝(예: 제안서 작성)으로 이동할 때 호출
  - `onCancel()`: 광고를 도중에 닫을 때 호출 (타이머가 끝나기 전에는 닫기 불가)

---

## 2. 연동해야 할 실제 SDK 핵심 로직
향후 `@apps-in-toss/web-framework`의 Toss SDK API를 사용하여 실제 연동을 진행합니다.
사용할 주요 함수: `loadFullScreenAd`, `showFullScreenAd`


### ① 초기 필수 체크 (isSupported) 및 애드몹(AdMob) Fallback
Toss SDK(인앱 광고 2.0 ver2)는 내부적으로 **토스 애즈(Toss Ads)**가 우선 노출되며, 토스 애즈가 지원되지 않는 환경에서는 **구글 애드몹(Google AdMob)**으로 자동 Fallback 되어 광고를 노출합니다.
따라서 개발자가 구글 애드몹을 띄우기 위해 별도로 코드를 작성할 필요 없이, 동일한 API(`loadFullScreenAd`, `showFullScreenAd`)만 호출하면 환경에 맞게 자동으로 분기됩니다.

- `loadFullScreenAd.isSupported()`가 `true`인지 확인
- 미지원(토스 앱 구버전 등)일 경우 광고 없이 통과하도록 Fallback 처리

### ② 광고 뷰 진입 전 선행 로드 (loadFullScreenAd) - 매우 중요!
광고는 사용자 진입 후 로드하면 지연이 발생합니다. **컴포넌트 마운트 시점 등에 미리 광고를 로드**(`load → show` 패턴)해야 합니다.

```tsx
import { loadFullScreenAd } from '@apps-in-toss/web-framework';
import { useEffect, useState } from 'react';

// ... 내부 컴포넌트 로직
const [isAdLoaded, setIsAdLoaded] = useState(false);

useEffect(() => {
  if (!loadFullScreenAd.isSupported()) return;

  const unregister = loadFullScreenAd({
    options: { adGroupId: '적용할_광고_그룹_ID' },
    onEvent: (event) => {
      if (event.type === 'loaded') {
        setIsAdLoaded(true); // 광고 로드 성공 시 상태 업데이트
      }
    },
    onError: (error) => console.error('광고 로드 실패:', error),
  });

  // 언마운트 시 반드시 콜백 등록 해제(메모리 누수 방지)
  return () => unregister(); 
}, []);
```

### ③ 광고 노출 및 보상 지급 (showFullScreenAd)
로드된 광고를 표시하고, 이벤트 결과에 따라 콜백을 처리합니다.
- **[핵심] 보상 지급 타이밍**: 이벤트 타입이 `'userEarnedReward'`일 때만 리워드를 지급해야 합니다. 단순히 `'dismissed'` 이벤트만으로 보상을 지급해서는 안 됩니다.

```tsx
import { showFullScreenAd } from '@apps-in-toss/web-framework';

const handleShowAd = (onComplete: () => void) => {
   if (!showFullScreenAd.isSupported()) {
      // 미지원 기기의 경우 바로 다음 로직으로 패스
      onComplete();
      return;
   }

  showFullScreenAd({
    options: { adGroupId: '적용할_광고_그룹_ID' },
    onEvent: (event) => {
      switch (event.type) {
        case 'userEarnedReward':
          // 사용자가 광고 시청을 완수함. 보상(제안권 등) 지급 로직 실행
          console.log('보상 획득:', event.data.unitAmount);
          onComplete(); 
          break;
        case 'dismissed':
          // 사용자가 창을 닫음 (다음 노출을 위해 새 광고 로드)
          setIsAdLoaded(false); 
          // 필요한 경우 여기서 다음 광고를 다시 미리 로드시킵니다 (load->show->load 패턴)
          break;
        case 'failedToShow':
          console.error('광고를 띄울 수 없습니다.');
          // 오류 상황에서의 Fallback 처리
          break;
      }
    },
    onError: (error) => console.error('광고 노출 중 에러:', error),
  });
};
```

---

## 3. 다른 AI에게 지시할 Action Item (프롬프트 템플릿용)

다음 내용을 복사, 붙여넣기하여 실제 코드 작성 작업을 지시하세요.

> **AI 작업 지시 사항:**
> 현재 프로젝트 내에 임시로 만들어진 `RewardAd.tsx` 모의(Mock) 카운트다운 플로우를 걷어내고, **앱인토스 광고 2.0 ver2 SDK (`@apps-in-toss/web-framework`의 `loadFullScreenAd`, `showFullScreenAd`)** 로직 체계로 리팩토링하고 싶어.
>
> 1. `useTossRewardAd`와 같은 Custom Hook 형태로 분리해서 관련 책임을 모아줘.
> 2. `isSupported()` 분기를 타서 토스 앱 환경이 아니거나 구버전이라 미지원일 경우에는 광고 시청 없이 바로 다음 단계로 넘어가게 만들어줘(=Fallback).
> 3. 광고는 항상 컴포넌트 마운트 시 등에 백그라운드에서 **미리 로드(Pre-load)** 시켜두는 패턴을 적용해 줘.
> 4. 리워드 콜백은 반드시 SDK의 `userEarnedReward` 이벤트를 리스닝하여 완료되도록 동작하게 해 줘.

---

## 4. [부록] 핵심 로직 (Custom Hook 예시 코드)
다른 AI가 코드를 작성할 때 즉각적으로 참고할 수 있는 `useTossRewardAd` 커스텀 훅의 뼈대 코드입니다.

```tsx
// src/hooks/useTossRewardAd.ts
import { useEffect, useState, useCallback } from 'react';
import { loadFullScreenAd, showFullScreenAd } from '@apps-in-toss/web-framework';

interface UseTossRewardAdProps {
  adGroupId: string;
  onRewardEarned: (unitType: string, unitAmount: number) => void;
  onAdDismissed?: () => void;
}

export const useTossRewardAd = ({ adGroupId, onRewardEarned, onAdDismissed }: UseTossRewardAdProps) => {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const isSupported = loadFullScreenAd.isSupported() && showFullScreenAd.isSupported();

  // 1. 광고 미리 로드 함수 (은닉화)
  const preloadAd = useCallback(() => {
    if (!isSupported) return;

    loadFullScreenAd({
      options: { adGroupId },
      onEvent: (event) => {
        if (event.type === 'loaded') {
          setIsAdLoaded(true);
        }
      },
      onError: (error) => console.error('광고 로드 실패:', error),
    });
  }, [adGroupId, isSupported]);

  // 2. 컴포넌트 마운트 시 최초 로드
  useEffect(() => {
    preloadAd();
  }, [preloadAd]);

  // 3. 광고 노출 트리거 함수
  const showAd = useCallback(() => {
    // 미지원 환경이거나 로드되지 않았으면 바로 패스 (Fallback)
    if (!isSupported || !isAdLoaded) {
      console.warn('광고 미지원 환경이거나 로드 전입니다. 바로 넘어갑니다.');
      onRewardEarned('fallback_pass', 1);
      return;
    }

    showFullScreenAd({
      options: { adGroupId },
      onEvent: (event) => {
        switch (event.type) {
          case 'userEarnedReward':
            // ✅ 보상 지급
            onRewardEarned(event.data.unitType, event.data.unitAmount);
            break;
          case 'dismissed':
            // 사용자가 광고를 닫으면 다시 백그라운드에서 로드 준비
            setIsAdLoaded(false);
            if (onAdDismissed) onAdDismissed();
            preloadAd();
            break;
          case 'failedToShow':
            console.error('광고 표출 실패. Fallback 진행');
            onRewardEarned('fallback_error', 1);
            break;
        }
      },
      onError: (error) => {
        console.error('광고 표시 중 오류 발생:', error);
        onRewardEarned('fallback_error', 1); 
      },
    });
  }, [adGroupId, isAdLoaded, isSupported, onRewardEarned, onAdDismissed, preloadAd]);

  return { showAd, isAdLoaded, isSupported };
};
```
