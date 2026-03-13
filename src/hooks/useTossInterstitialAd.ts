import { useState, useEffect, useCallback, useRef } from 'react';
import { loadFullScreenAd, showFullScreenAd } from '@apps-in-toss/web-framework';

/**
 * 환경 지원 여부를 안전하게 확인하는 유틸리티
 */
const safeIsSupported = (method: any) => {
    try {
        if (typeof method?.isSupported === 'function') {
            return method.isSupported();
        }
    } catch (error) {
        // 브릿지 미지원 환경에서의 에러 무시
    }
    return false;
};

/**
 * AppsInToss 전면 광고(Interstitial Ads) 구현을 위한 커스텀 훅.
 * 순수 웹뷰(WebView) 환경에 최적화되어 있으며 RN 관련 의존성 없이 안전하게 호출합니다.
 */
export const useTossInterstitialAd = (adGroupId: string = 'ait-ad-test-interstitial-id') => {
    const [isAdLoaded, setIsAdLoaded] = useState(false);
    const isAdLoadedRef = useRef(false);

    // 현재 환경 지원 여부 (브라우저/웹뷰 분기용)
    const isSupported = safeIsSupported(loadFullScreenAd) && safeIsSupported(showFullScreenAd);

    const loadAd = useCallback(() => {
        // 지원되지 않는 환경(일반 브라우저 등)에서는 로드를 시도하지 않음
        if (!isSupported) return () => {};

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
            //ReactNativeWebView 에러 등 예상치 못한 에러 방어
            console.error('전면 광고 초기화 중 예외 발생:', error);
            return () => {};
        }
    }, [adGroupId, isSupported]);

    useEffect(() => {
        const unregister = loadAd();
        return () => {
            if (unregister) unregister();
        };
    }, [loadAd]);

    const showAd = useCallback((onClose: () => void) => {
        // 미지원 환경이거나 로드되지 않았으면 즉시 닫기 콜백 실행 (사용자 흐름 유지)
        if (!isSupported || !isAdLoadedRef.current) {
            console.warn('전면 광고 미지원 또는 미로드 상태로 바로 진행합니다.');
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
                        loadAd();
                        onClose();
                    }
                },
                onError: (error) => {
                    console.error('전면 광고 표시 중 에러:', error);
                    onClose();
                }
            });
        } catch (error) {
            console.error('전면 광고 호출 중 예외 발생:', error);
            onClose();
        }
    }, [adGroupId, isSupported, loadAd]);

    return { showAd, isAdLoaded, isSupported };
};
