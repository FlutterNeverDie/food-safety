import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Text } from '@toss/tds-mobile';
import { useSearchStore } from '../store/useSearchStore';
import { ChevronLeft, ShieldCheck, Calendar, Info, MapPin } from 'lucide-react';

export const ResultPage: React.FC = () => {
    const { selectedRestaurant } = useSearchStore();
    const navigate = useNavigate();

    if (!selectedRestaurant) return null;


    const formatDate = (dateStr?: string) => {
        if (!dateStr || dateStr.length !== 8) return dateStr || '정보 없음';
        return `${dateStr.substring(0, 4)}년 ${parseInt(dateStr.substring(4, 6))}월 ${parseInt(dateStr.substring(6, 8))}일`;
    };

    return (
        <div className="app-container !bg-[#F9FAFB]">
            <div className="flex-1 flex flex-col">
                <header className="px-6 py-4 flex items-center bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-[#F2F4F6]">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-[#8B95A1] active:scale-95 transition-transform">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <Text className="flex-1 text-center font-bold text-[16px] text-[#191F28] mr-8">위생 적발 상세 내역</Text>
                </header>

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
                                    <div key={idx} className="bg-white border border-[#F2F4F6] rounded-[32px] p-8 space-y-7 shadow-[0_8px_20px_rgba(0,0,0,0.02)]">
                                        <div className="flex items-center justify-between pb-5 border-b border-[#F2F4F6]">
                                            <div className="px-3.5 py-1.5 bg-[#FFF0F0] text-[#F04452] rounded-xl text-[13px] font-bold tracking-tight">
                                                {row.DSPS_TYPECD_NM}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[#B0B8C1]">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <Text className="text-[14px] font-bold">{formatDate(row.DSPS_DCSNDT)}</Text>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-[#F04452] rounded-full" />
                                                <Text className="text-[15px] font-bold text-[#8B95A1]">위반 내용</Text>
                                            </div>
                                            <div className="bg-[#F9FAFB] p-6 rounded-[24px] border border-[#F2F4F6]/50">
                                                <Text className="text-[16px] text-[#4E5968] leading-relaxed font-semibold break-keep">{row.VILTCN}</Text>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-[#3182F6] rounded-full" />
                                                <Text className="text-[15px] font-bold text-[#8B95A1]">처분 결과</Text>
                                            </div>
                                            <div className="px-1">
                                                <Text className="text-[18px] text-[#191F28] font-bold leading-relaxed">{row.DSPSCN}</Text>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 bg-white border border-[#F2F4F6] rounded-[32px] flex flex-col items-center justify-center space-y-4">
                                    <ShieldCheck className="w-12 h-12 text-[#00D082] opacity-20" />
                                    <Text className="text-[#B0B8C1] font-bold text-[16px]">기록이 없습니다</Text>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* 2. 매장 이름 (가장 크게 강조) */}
                    <div className="space-y-3 px-1 pt-4">
                        <Text className="text-[40px] font-bold text-[#191F28] leading-[1.1] tracking-tighter break-all">
                            {selectedRestaurant.name}
                        </Text>
                        <Text className="text-[17px] font-medium text-[#8B95A1] leading-relaxed">
                            식약처 단속 데이터에 의해 행정처분 이력이<br />확인된 매장입니다.
                        </Text>
                    </div>

                    {/* 3. 매장 상세 정보 (하단) */}
                    <section className="bg-white rounded-[28px] p-8 border border-[#F2F4F6] space-y-7 shadow-sm">
                        <Text className="text-[17px] font-bold text-[#191F28] px-1">매장 상세 정보</Text>
                        <div className="space-y-8 pt-2">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[#F9FAFB] rounded-2xl text-[#8B95A1] shrink-0 border border-[#F2F4F6]">
                                    <Info className="w-5 h-5" />
                                </div>
                                <div className="space-y-1.5 flex-1 overflow-hidden">
                                    <Text className="text-[13px] font-bold text-[#8B95A1] block">업종</Text>
                                    <Text className="text-[17px] font-bold text-[#191F28] break-all">{selectedRestaurant.category}</Text>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[#F9FAFB] rounded-2xl text-[#8B95A1] shrink-0 border border-[#F2F4F6]">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="space-y-1.5 flex-1">
                                    <Text className="text-[13px] font-bold text-[#8B95A1] block">소재지</Text>
                                    <Text className="text-[16px] font-bold text-[#4E5968] leading-[1.6] break-keep">{selectedRestaurant.address}</Text>
                                </div>
                            </div>
                        </div>
                    </section>
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
