import React, { useEffect, useRef, useState } from 'react';
import { TossAds } from '@apps-in-toss/web-framework';
import { AD_CONFIG } from '../../constants/adConfig';

interface TossBannerAdProps {
  adGroupId: string;    
  height?: string;      
  variant?: 'card' | 'expanded'; 
}

export const TossBannerAd: React.FC<TossBannerAdProps> = ({ 
  adGroupId, 
  height, 
  variant = 'expanded' 
}) => {
  // 높이값이 안들어왔을 때의 자동 크기 처리 (이미지 배너는 410px)
  let resolvedHeight = height;
  if (!resolvedHeight) {
    if (variant === 'expanded') resolvedHeight = '96px';
    else if (adGroupId === AD_CONFIG.BANNER_FEED_ID) resolvedHeight = '410px';
    else resolvedHeight = '180px';
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const isTossApp = /Toss/i.test(navigator.userAgent);

  // ① SDK 초기화
  useEffect(() => {
    if (!isTossApp) return;
    
    const globalAds = TossAds as any;
    try {
      if (globalAds.initialize?.isSupported?.() || globalAds.initialize) {
        globalAds.initialize({
          callbacks: {
            onInitialized: () => setIsInitialized(true),
            onInitializationFailed: (error: any) => {
              console.error('Toss Ads 초기화 실패:', error);
              setIsInitialized(true); 
            },
          },
        });
      } else {
        setIsInitialized(true);
      }
    } catch(e) {
      console.error('TossAds 초기화 중 예외:', e);
      setIsInitialized(true);
    }
  }, [isTossApp]);

  // ② 배너 부착 및 컴포넌트 언마운트 시 제거(Destroy) - 메모리 누수 방지
  useEffect(() => {
    if (!isTossApp || !isInitialized || !containerRef.current) return;
    let banner: { destroy: () => void } | undefined;
    
    const globalAds = TossAds as any;
    const attachFn = globalAds.attachBanner || globalAds.attach;
    try {
      banner = attachFn?.(adGroupId, containerRef.current, {
        variant,
        theme: 'light', 
      });
    } catch (error) {
      console.error('Toss Banner 부착 에러:', error);
    }

    return () => {
      if (banner && typeof banner.destroy === 'function') {
        banner.destroy();
      } else {
        globalAds.destroyAll?.();
      }
    };
  }, [adGroupId, variant, isInitialized, isTossApp]);

  return (
    <div style={{ width: '100%', minHeight: resolvedHeight, background: 'transparent', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: variant === 'expanded' ? 'env(safe-area-inset-bottom)' : '0' }}>
      {isTossApp ? (
        <div 
          ref={containerRef} 
          style={{ width: '100%', margin: variant === 'expanded' ? 0 : '16px 0' }} 
        />
      ) : (
        /* 로컬 환경(PC 웹 등)일 때 보여지는 Placeholder UI */
        <div style={{ 
            height: resolvedHeight, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            border: '2px dashed #ccc',
            backgroundColor: '#F2F4F6',
            borderRadius: variant === 'card' ? '16px' : '0px',
            margin: variant === 'expanded' ? 0 : '16px 0'
        }}>
          [AD PLACEHOLDER] - 이미지 강조형 배너 영역 ({resolvedHeight})
        </div>
      )}
    </div>
  );
};
