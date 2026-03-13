import React, { useEffect, useRef } from 'react';
import { TossAds } from '@apps-in-toss/web-framework';

interface TossBannerAdProps {
    adGroupId: string;
    variant?: 'card' | 'expanded';
    className?: string;
    height?: string;
}

/**
 * AppsInToss 배너 광고 컴포넌트 (리뉴얼 버전)
 */
export const TossBannerAd: React.FC<TossBannerAdProps> = ({ 
    adGroupId, 
    variant = 'expanded',
    className = "",
    height
}) => {
    const bannerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const isTossApp = /Toss/i.test(navigator.userAgent);
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname.startsWith('172.');
        
        // 1. 토스 앱이 아닌 웹 브라우저/로컬 환경이면 광고 로직 수행 안함 (흰 화면 방지용 조기 리턴)
        if (!isTossApp && isLocal) return;

        if (!bannerRef.current) return;

        try {

            // 2. 반드시 초기화(initialize)가 선행되어야 합니다.
            // (Note: 웹 프레임워크 버전에 따라 TossAds.initialize.isSupported() 호출 형태가 다를 수 있음)
            const globalAds = (TossAds as any);
            if (globalAds.initialize) {
                globalAds.initialize({
                    callbacks: {
                        onInitialized: () => console.log(`[TossAds] Initialized for ${adGroupId}`),
                        onInitializationFailed: (err: any) => console.error('[TossAds] Init Failed', err)
                    }
                });
            }

            // 3. 배너 부착 (Attach)
            // Tip: 가이드 코드의 TossAds.attach는 버전별로 attachBanner일 수 있습니다.
            const attachFn = globalAds.attachBanner || globalAds.attach;
            if (attachFn) {
                attachFn(adGroupId, bannerRef.current, {
                    variant,
                    theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
                    tone: 'blackAndWhite',
                    callbacks: {
                        onAdRendered: () => console.log(`[TossAds] Banner Rendered: ${adGroupId}`),
                        onAdFailedToRender: (payload: any) => {
                            console.error(`[TossAds] Render Failed: ${adGroupId}`, payload.error);
                        }
                    }
                });
            }
        } catch (error) {
            console.warn('[TossAds] Unexpected error:', error);
        }

        return () => {
            // 언마운트 시 정리 (destroyAll)
            const globalAds = (TossAds as any);
            if (typeof globalAds?.destroyAll === 'function') {
                try { globalAds.destroyAll(); } catch (e) {}
            }
        };
    }, [adGroupId, variant]);

    // 환경 체크 (Mock UI 노출 여부 결정)
    const isTossApp = /Toss/i.test(navigator.userAgent);
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname.startsWith('172.');
    const showMock = !isTossApp && isLocal;

    // 배너 사이즈 계산
    const containerHeight = height || (variant === 'card' ? '180px' : '96px');

    return (
        <div
            ref={bannerRef}
            className={`w-full flex items-center justify-center transition-all duration-300 ${className}`}
            style={{
                width: '100%',
                minHeight: containerHeight,
                background: showMock ? '#F2F4F6' : 'transparent',
                borderRadius: variant === 'card' ? '24px' : '0px',
                border: showMock ? '1px dashed #B0B8C1' : 'none',
                color: '#6B7684',
                margin: variant === 'card' ? '12px 0' : '0',
                overflow: 'hidden'
            }}
        >
            {/* 로컬 개발 환경에서만 보이는 Mock UI */}
            {showMock && (
                <div className="flex flex-col items-center gap-1 opacity-60">
                    <span className="text-[14px] font-bold">📢 Toss Ad Banner</span>
                    <span className="text-[11px] font-medium opacity-70">({adGroupId} / {variant})</span>
                </div>
            )}
        </div>
    );
};
