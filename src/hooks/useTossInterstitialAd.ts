import { useState, useEffect, useCallback, useRef } from 'react';
import { loadFullScreenAd, showFullScreenAd } from '@apps-in-toss/web-framework';

/**
 * AppsInToss 전면 광고(Interstitial Ads) 구현을 위한 커스텀 훅.
 */
export const useTossInterstitialAd = (adGroupId: string) => {
    const [isAdLoaded, setIsAdLoaded] = useState(false);
    const isAdLoadedRef = useRef(false);

    const loadAd = useCallback(() => {
        try {
            const unregister = loadFullScreenAd({
                options: { adGroupId },
                onEvent: (event) => {
                    if (event.type === 'loaded') {
                        setIsAdLoaded(true);
                        isAdLoadedRef.current = true;
                    }
                },
                onError: (error) => {
                    console.error('전면 광고 로드 실패:', error);
                }
            });
            return unregister;
        } catch (error) {
            console.error('전면 광고 로드 중 오류:', error);
            return () => {};
        }
    }, [adGroupId]);

    useEffect(() => {
        const unregister = loadAd();
        return () => {
            if (unregister) unregister();
        };
    }, [loadAd]);

    const showAd = useCallback((onClose: () => void) => {
        // 광고가 로드되지 않았으면 바로 콜백 실행 (사용자 흐름 방해 금지)
        if (!isAdLoadedRef.current) {
            onClose();
            return;
        }

        try {
            showFullScreenAd({
                options: { adGroupId },
                onEvent: (event) => {
                    if (event.type === 'dismissed' || event.type === 'failedToShow') {
                        setIsAdLoaded(false);
                        isAdLoadedRef.current = false;
                        loadAd(); // 다음을 위해 재로드
                        onClose();
                    }
                    if (event.type === 'impression') {
                        console.log('전면 광고 수익 발생 시점');
                    }
                },
                onError: (error) => {
                    console.error('전면 광고 표시 중 에러:', error);
                    onClose();
                }
            });
        } catch (error) {
            console.error('전면 광고 표시 중 예상치 못한 에러:', error);
            onClose();
        }
    }, [adGroupId, loadAd]);

    return { showAd, isAdLoaded };
};
