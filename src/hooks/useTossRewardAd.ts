import { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleAdMob } from '@apps-in-toss/web-framework';

export const useTossRewardAd = (adGroupId: string) => {
    const [isAdLoaded, setIsAdLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const isAdLoadedRef = useRef(false);
    
    // 지원 여부 체크 (로컬 브라우저 에러 방지용 try-catch)
    let isSupported = false;
    try {
        isSupported = typeof GoogleAdMob?.loadAppsInTossAdMob?.isSupported === 'function' && 
                      GoogleAdMob.loadAppsInTossAdMob.isSupported();
    } catch (error) {
        // 브라우저 등 미지원 환경에서 발생하는 예외 무시
        isSupported = false;
    }

    const preloadAd = useCallback(() => {
        if (!isSupported) return () => {};

        try {
            console.log(`[RewardAd] Preloading: ${adGroupId}`);
            const cleanup = GoogleAdMob.loadAppsInTossAdMob({
                options: { adGroupId },
                onEvent: (event) => {
                    if (event.type === 'loaded') {
                        setIsAdLoaded(true);
                        isAdLoadedRef.current = true;
                        setHasError(false);
                        console.log('[RewardAd] Ad Loaded');
                        if (cleanup) cleanup();
                    }
                },
                onError: (error) => {
                    console.error('[RewardAd] Load Error:', error);
                    setHasError(true);
                }
            });
            return cleanup;
        } catch (error) {
            console.error('[RewardAd] Unexpected Load Error:', error);
            setHasError(true);
            return () => {};
        }
    }, [adGroupId, isSupported]);

    useEffect(() => {
        const cleanup = preloadAd();
        return () => {
            if (cleanup) cleanup();
        };
    }, [preloadAd]);

    const showAd = useCallback((onComplete: () => void, onDismissed?: () => void) => {
        // 미지원 환경이거나 로드가 안 됐으면 바로 다음 단계로 (Fallback)
        if (!isSupported || !isAdLoadedRef.current) {
            console.warn('[RewardAd] Not loaded or not supported, skipping to complete');
            onComplete();
            return;
        }

        try {
            GoogleAdMob.showAppsInTossAdMob({
                options: { adGroupId },
                onEvent: (event) => {
                    switch (event.type) {
                        case 'userEarnedReward':
                            console.log('[RewardAd] Reward earned');
                            onComplete();
                            break;
                        case 'dismissed':
                            console.log('[RewardAd] Ad dismissed');
                            setIsAdLoaded(false);
                            isAdLoadedRef.current = false;
                            preloadAd(); // 다음 번을 위해 재로드
                            if (onDismissed) onDismissed();
                            break;
                        case 'failedToShow':
                            console.error('[RewardAd] Failed to show');
                            onComplete();
                            break;
                    }
                },
                onError: (error) => {
                    console.error('[RewardAd] Show Error:', error);
                    onComplete();
                }
            });
        } catch (error) {
            console.error('[RewardAd] Unexpected Show Error:', error);
            onComplete();
        }
    }, [adGroupId, isSupported, preloadAd]);

    return { showAd, isAdLoaded, isSupported, hasError };
};
