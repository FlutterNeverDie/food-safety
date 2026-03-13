import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '../store/useSearchStore';
import { ViolationSection } from '../components/result/ViolationSection';
import { RestaurantDetailInfo } from '../components/result/RestaurantDetailInfo';
import { TossBannerAd } from '../components/common/TossBannerAd';
import { AD_CONFIG } from '../constants/adConfig';

export const ResultPage: React.FC = () => {
    const { selectedRestaurant } = useSearchStore();
    const navigate = useNavigate();

    // 페이지 이동 시 항상 최상단 스크롤 유지
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // 데이터 유실 시(새로고침 등) 검색 페이지로 튕겨내기 (흰 화면 방지)
    useEffect(() => {
        if (!selectedRestaurant) {
            navigate('/search', { replace: true });
        }
    }, [selectedRestaurant, navigate]);

    if (!selectedRestaurant) return null;

    return (
        <div className="app-container !bg-[#F9FAFB]">
            <div className="flex-1 flex flex-col">
                <main className="flex-1 px-6 pt-12 pb-32 space-y-12 animate-fade-in-up">
                    {/* 1. 위생 적발 내역 */}
                    <ViolationSection records={selectedRestaurant.raw} />

                    {/* 매장 상세 정보 위의 배너 광고 (피드형 ID 적용) */}
                    <TossBannerAd adGroupId={AD_CONFIG.BANNER_FEED_ID} variant="card" />

                    {/* 2. 매장 상세 정보 */}
                    <RestaurantDetailInfo restaurant={selectedRestaurant} />
                </main>

                <footer className="p-6 bg-white/80 backdrop-blur-md border-t border-[#F2F4F6] fixed bottom-0 left-0 right-0 max-w-lg mx-auto z-20">
                    <button
                        className="w-full py-5 bg-[#3182F6] text-white rounded-[22px] font-bold text-lg active:scale-[0.98] transition-all shadow-xl shadow-blue-100"
                        onClick={() => {
                            window.scrollTo(0, 0);
                            navigate('/search');
                        }}
                    >
                        닫기
                    </button>
                </footer>
            </div>
        </div>
    );
};
