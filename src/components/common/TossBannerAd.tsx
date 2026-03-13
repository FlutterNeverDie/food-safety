import React, { useEffect, useRef } from 'react';
import { useTossBanner } from '../../hooks/useTossBanner';

interface TossBannerAdProps {
    adGroupId: string;
    variant?: 'card' | 'expanded';
    className?: string;
    height?: string;
}

/**
 * AppsInToss 배너 광고 컴포넌트
 */
export const TossBannerAd: React.FC<TossBannerAdProps> = ({ 
    adGroupId, 
    variant = 'expanded',
    className = "",
    height
}) => {
    const bannerRef = useRef<HTMLDivElement>(null);
    const { isInitialized, attachBanner } = useTossBanner();

    useEffect(() => {
        if (!isInitialized || !bannerRef.current) return;

        const attached = attachBanner(adGroupId, bannerRef.current, {
            variant,
            theme: 'auto', // 시스템 설정에 따라 다크/라이트 자동 전환
            tone: 'blackAndWhite', // 가이드 권장 기본값
            callbacks: {
                onAdRendered: () => {
                    console.log(`Banner Ad (${adGroupId}) rendered successfully`);
                },
                onAdFailedToRender: (payload: any) => {
                    console.error('Banner failed to render:', payload.error.message);
                }
            }
        });

        return () => {
            if (attached && typeof attached.destroy === 'function') {
                attached.destroy();
            }
        };
    }, [isInitialized, adGroupId, attachBanner, variant]);

    return (
        <div
            ref={bannerRef}
            className={`w-full overflow-hidden flex items-center justify-center bg-white ${variant === 'card' ? 'rounded-[20px] border border-[#F2F4F6]' : ''} ${className}`}
            style={{
                height: height || (variant === 'card' ? 'auto' : '96px'),
                minHeight: height || (variant === 'card' ? '180px' : '96px')
            }}
        />
    );
};
