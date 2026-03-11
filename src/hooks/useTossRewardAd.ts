import { useState, useEffect, useCallback } from 'react';
import { loadFullScreenAd, showFullScreenAd } from '@apps-in-toss/web-framework';

// Fallback 처리를 위한 isSupported 안전 호출 함수
const safeIsSupported = (method: any) => {
    try {
        if (typeof method?.isSupported === 'function') {
            return method.isSupported();
        }
    } catch (error) {
        // 브릿지 미지원/로컬 환경에서 throw되는 에러 무시
    }
    return false;
};

export const useTossRewardAd = (adGroupId: string) => {
    const [isAdLoaded, setIsAdLoaded] = useState(false);

    const preloadAd = useCallback(() => {
        if (!safeIsSupported(loadFullScreenAd)) {
            return () => {};
        }

        try {
            const unregister = loadFullScreenAd({
                options: { adGroupId },
                onEvent: (event) => {
                    if (event.type === 'loaded') {
                        setIsAdLoaded(true);
                    }
                },
                onError: (error) => {
                    console.error('광고 로드 실패:', error);
                }
            });
            return unregister;
        } catch (error) {
            console.error('광고 로드 중 예상치 못한 에러:', error);
            return () => {};
        }
    }, [adGroupId]);

    useEffect(() => {
        const unregister = preloadAd();
        return () => {
            if (unregister) unregister();
        };
    }, [preloadAd]);

    const showAd = useCallback((onComplete: () => void, onDismissed?: () => void) => {
        // 미지원 기기이거나 로드가 안 된 상태이면 Fallback: 바로 진행
        if (!isAdLoaded || !safeIsSupported(showFullScreenAd)) {
            onComplete();
            return;
        }

        try {
            showFullScreenAd({
                options: { adGroupId },
                onEvent: (event) => {
                    switch (event.type) {
                        case 'userEarnedReward':
                            // 사용자가 광고 시청을 완수함. 보상(다음 페이지 이동) 로직 실행
                            console.log('리워드 획득 성공!');
                            onComplete();
                            break;
                        case 'dismissed':
                            // 사용자가 창을 중도에 닫음 (다음 노출을 위해 새 광고 로드)
                            setIsAdLoaded(false);
                            preloadAd();
                            if (onDismissed) onDismissed();
                            break;
                        case 'failedToShow':
                            // 오류 상황에서의 Fallback 처리
                            console.error('광고를 띄울 수 없습니다.');
                            onComplete();
                            break;
                    }
                },
                onError: (error) => {
                    console.error('광고 표시 중 에러:', error);
                    onComplete();
                }
            });
        } catch (error) {
            console.error('광고 표시 중 예상치 못한 에러:', error);
            onComplete();
        }
    }, [adGroupId, isAdLoaded, preloadAd]);

    return { showAd, isAdLoaded };
};
