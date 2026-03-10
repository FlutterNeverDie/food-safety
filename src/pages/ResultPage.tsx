import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Text } from '@toss/tds-mobile';
import { useSearchStore } from '../store/useSearchStore';
import { ShieldCheck } from 'lucide-react';
import { ResultHeader } from '../components/result/ResultHeader';
import { ViolationCard } from '../components/result/ViolationCard';
import { RestaurantDetailInfo } from '../components/result/RestaurantDetailInfo';
import { formatDate } from '../utils/format';

export const ResultPage: React.FC = () => {
    const { selectedRestaurant } = useSearchStore();
    const navigate = useNavigate();

    if (!selectedRestaurant) return null;

    return (
        <div className="app-container !bg-[#F9FAFB]">
            <div className="flex-1 flex flex-col">
                <ResultHeader />

                <main className="flex-1 px-6 pt-8 pb-32 space-y-12 animate-fade-in-up">
                    {/* 1. 상세 위반 내역 (최상단) */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2.5 px-1">
                            <div className="w-8 h-8 bg-[#FFF0F0] rounded-lg flex items-center justify-center text-base shadow-sm border border-[#FFE0E0]">🚨</div>
                            <Text className="text-[17px] font-bold text-[#F04452]">위생 적발 내역</Text>
                        </div>
                        
                        <div className="space-y-6">
                            {selectedRestaurant.raw && selectedRestaurant.raw.length > 0 ? (
                                selectedRestaurant.raw.map((row, idx) => (
                                    <ViolationCard key={idx} row={row} formatDate={formatDate} />
                                ))
                            ) : (
                                <div className="py-20 bg-white border border-[#F2F4F6] rounded-[32px] flex flex-col items-center justify-center space-y-4">
                                    <ShieldCheck className="w-12 h-12 text-[#00D082] opacity-20" />
                                    <Text className="text-[#B0B8C1] font-bold text-[16px]">기록이 없습니다</Text>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* 2. 매장 이름 및 정보 (좌측 정렬 강조) */}
                    <div className="space-y-3 px-1 pt-4">
                        <Text className="text-[40px] font-bold text-[#191F28] leading-[1.1] tracking-tighter break-all">
                            {selectedRestaurant.name}
                        </Text>
                        <Text className="text-[17px] font-medium text-[#8B95A1] leading-relaxed">
                            식약처 단속 데이터에 의해 행정처분 이력이<br />확인된 매장입니다.
                        </Text>
                    </div>

                    {/* 3. 매장 상세 정보 (하단) */}
                    <RestaurantDetailInfo restaurant={selectedRestaurant} />
                </main>

                <footer className="p-6 bg-white/80 backdrop-blur-md border-t border-[#F2F4F6] fixed bottom-0 left-0 right-0 max-w-lg mx-auto z-20">
                    <button
                        className="w-full py-5 bg-[#3182F6] text-white rounded-[22px] font-bold text-lg active:scale-[0.98] transition-all shadow-xl shadow-blue-100"
                        onClick={() => navigate('/')}
                    >
                        닫기
                    </button>
                </footer>
            </div>
        </div>
    );
};
