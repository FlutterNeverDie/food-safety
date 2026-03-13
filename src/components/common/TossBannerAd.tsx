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
    height = "96px"
}) => {
    const bannerRef = useRef<HTMLDivElement>(null);
    const { isInitialized, attachBanner } = useTossBanner();

    useEffect(() => {
        if (!isInitialized || !bannerRef.current) return;

        const attached = attachBanner(adGroupId, bannerRef.current, {
            variant,
            callbacks: {
                onAdFailedToRender: (payload: any) => {
                    console.error('Banner failed to render:', payload.error.message);
                }
            }
        });

        return () => {
            attached?.destroy();
        };
    }, [isInitialized, adGroupId, attachBanner, variant]);

    return (
        <div 
            ref={bannerRef} 
            className={`w-full overflow-hidden ${className}`} 
            style={{ minHeight: height }} 
        />
    );
};
