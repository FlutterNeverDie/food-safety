import { useCallback, useEffect, useState } from 'react';
import { TossAds } from '@apps-in-toss/web-framework';

// 전역 상태 관리 (파일 로드 시 1회만 정의되며, 여러 훅 인스턴스가 공유함)
type InitStatus = 'none' | 'progress' | 'done';
let globalInitStatus: InitStatus = 'none';
const initListeners = new Set<() => void>();

/**
 * AppsInToss 배너 광고 SDK 초기화 및 부착을 위한 커스텀 훅.
 * 중복 초기화 방지 로직이 포함되어 있습니다.
 */
export function useTossBanner() {
  const [isInitialized, setIsInitialized] = useState(globalInitStatus === 'done');

  useEffect(() => {
    // 1. 이미 완료된 경우 상태만 업데이트
    if (globalInitStatus === 'done') {
      setIsInitialized(true);
      return;
    }

    // 2. 초기화 완료 시 실행할 리스너 등록
    const handleInitialized = () => setIsInitialized(true);
    initListeners.add(handleInitialized);

    // 3. 아직 아무도 초기화를 시작하지 않은 경우에만 실행
    if (globalInitStatus === 'none') {
      globalInitStatus = 'progress';
      
      const ads = (TossAds as any);
      if (ads?.initialize) {
        try {
          ads.initialize({
            callbacks: {
              onInitialized: () => {
                globalInitStatus = 'done';
                console.log('Toss Ads SDK initialized (Singleton Mode)');
                // 대기 중인 모든 훅에 알림
                initListeners.forEach(listener => listener());
                initListeners.clear();
              },
              onInitializationFailed: (error: any) => {
                globalInitStatus = 'none'; // 실패 시 재시작 가능하도록
                console.error('Toss Ads SDK initialization failed:', error);
                initListeners.clear();
              },
            },
          });
        } catch (e) {
            globalInitStatus = 'none';
            console.error('Exception during Ads initialization:', e);
        }
      }
    }

    // 언마운트 시 리스너 제거
    return () => {
      initListeners.delete(handleInitialized);
    };
  }, []);

  const attachBanner = useCallback(
    (adGroupId: string, element: HTMLElement, options?: any) => {
      if (!isInitialized) return;
      
      const ads = (TossAds as any);
      try {
        if (typeof ads?.attachBanner === 'function') {
          return ads.attachBanner(adGroupId, element, {
            theme: 'auto',
            tone: 'blackAndWhite',
            variant: 'expanded',
            ...options
          });
        }
      } catch (e) {
        console.error('Failed to attach banner:', e);
      }
      return { destroy: () => {} };
    },
    [isInitialized]
  );

  return { isInitialized, attachBanner };
}
