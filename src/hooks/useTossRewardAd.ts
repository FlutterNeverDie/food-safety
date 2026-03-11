import { useState, useEffect, useCallback, useRef } from 'react';
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
    const [hasError, setHasError] = useState(false);
    
    // JS 클로저 버그(이전 렌더링 값 유지) 방지용 Ref
    const isAdLoadedRef = useRef(false);
    
    // 컴포넌트 마운트 초기에 지원 여부를 평가
    const isSupported = safeIsSupported(loadFullScreenAd) && safeIsSupported(showFullScreenAd);

    const preloadAd = useCallback(() => {
        if (!isSupported) {
            return () => {};
        }

        try {
            const unregister = loadFullScreenAd({
                options: { adGroupId },
                onEvent: (event) => {
                    if (event.type === 'loaded') {
                        setIsAdLoaded(true);
                        isAdLoadedRef.current = true;
                        setHasError(false);
                    }
                },
                onError: (error) => {
                    console.error('광고 로드 실패:', error);
                    setHasError(true);
                }
            });
            return unregister;
        } catch (error) {
            console.error('광고 로드 중 예상치 못한 에러:', error);
            setHasError(true);
            return () => {};
        }
    }, [adGroupId, isSupported]);

    useEffect(() => {
        const unregister = preloadAd();
        return () => {
            if (unregister) unregister();
        };
    }, [preloadAd]);

    const showAd = useCallback((onComplete: () => void, onDismissed?: () => void) => {
        // 미지원 기기이거나 로드가 안 된 상태이면 Fallback: 바로 진행
        // isAdLoadedRef를 확인하여 closure 밖에서의 최신 상태를 보장
        if (!isSupported || !isAdLoadedRef.current) {
            console.warn('Fallback으로 이동:', { isSupported, isAdLoaded: isAdLoadedRef.current });
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
                            isAdLoadedRef.current = false;
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
    }, [adGroupId, isSupported, preloadAd]);

    return { showAd, isAdLoaded, isSupported, hasError };
};
