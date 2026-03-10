import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Text } from '@toss/tds-mobile';
import { useSearchStore } from '../store/useSearchStore';
import { ChevronLeft, ShieldCheck, AlertTriangle, Calendar, Info, MapPin } from 'lucide-react';

export const ResultPage: React.FC = () => {
    const { selectedRestaurant } = useSearchStore();
    const navigate = useNavigate();

    if (!selectedRestaurant) return null;

    const isViolation = selectedRestaurant.status === '적발';

    return (
        <div className="app-container !bg-[#F9FAFB]">
            <div className="flex-1 flex flex-col bg-white">
                <header className="px-6 py-6 flex items-center bg-white sticky top-0 z-10 border-b border-[#F2F4F6]/60">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-[#8B95A1] active:bg-gray-100 rounded-full transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <Text className="flex-1 text-center font-bold text-[#191F28] mr-8">위생 정보 상세</Text>
                </header>

                <main className="flex-1 px-8 pt-12 pb-24 space-y-12 animate-fade-in-up">
                    <div className="flex flex-col items-center text-center space-y-8">
                        {isViolation ? (
                            <>
                                <div className="relative">
                                    <div className="w-24 h-24 bg-[#FFF0F0] rounded-[32px] flex items-center justify-center animate-bounce">
                                        <AlertTriangle className="w-12 h-12 text-[#F04452]" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-sm border border-red-50">
                                        🚨
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Text className="text-[26px] font-bold text-[#191F28] tracking-tight leading-tight">이 식당은 최근<br /><span className="text-[#F04452]">적발 이력이 있어요</span></Text>
                                    <Text className="text-[16px] text-[#4E5968] leading-relaxed font-medium">식약처 점검 결과 부적격 판정을 받은<br />기록이 확인되었습니다.</Text>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="relative">
                                    <div className="w-24 h-24 bg-[#E8F8F0] rounded-[32px] flex items-center justify-center">
                                        <ShieldCheck className="w-12 h-12 text-[#00D082]" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-sm border border-green-50">
                                        ✨
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Text className="text-[26px] font-bold text-[#191F28] tracking-tight leading-tight">걱정 마세요!<br /><span className="text-[#00D082]">안전한 식당이에요</span></Text>
                                    <Text className="text-[16px] text-[#4E5968] leading-relaxed font-medium">최근 위생 점검 데이터에서<br />위반 내역이 발견되지 않았습니다.</Text>
                                </div>
                            </>
                        )}
                    </div>

                    {/* 식당 기본 정보 카드 */}
                    <section className="bg-[#F9FAFB] rounded-[28px] p-7 border border-[#F2F4F6] space-y-6 shadow-sm">
                        <div className="space-y-2 pb-4 border-b border-[#E5E8EB]">
                            <Text className="text-xl font-bold text-[#191F28]">{selectedRestaurant.name}</Text>
                            <div className="flex items-start gap-1.5 text-[#8B95A1]">
                                <MapPin className="w-3.5 h-3.5 mt-1 shrink-0" />
                                <Text className="text-[14px] leading-snug">{selectedRestaurant.address}</Text>
                            </div>
                        </div>

                        <div className="space-y-5 pt-2">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-[#4E5968]">
                                    <Calendar className="w-4 h-4 text-[#B0B8C1]" />
                                    <Text className="text-[15px] font-medium">최근 점검일</Text>
                                </div>
                                <Text className="text-[15px] font-bold text-[#191F28]">{selectedRestaurant.lastInspection || '기록 없음'}</Text>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-[#4E5968]">
                                    <Info className="w-4 h-4 text-[#B0B8C1]" />
                                    <Text className="text-[15px] font-medium">업태명</Text>
                                </div>
                                <Text className="text-[15px] font-bold text-[#191F28]">{selectedRestaurant.category}</Text>
                            </div>
                        </div>
                    </section>

                    {/* 상세 위반 내역 섹션 */}
                    <section className="space-y-5">
                        <Text className="text-[18px] font-bold text-[#333D4B] ml-1">상세 기록</Text>
                        <div className="space-y-4">
                            {selectedRestaurant.raw && selectedRestaurant.raw.length > 0 ? (
                                selectedRestaurant.raw.map((row, idx) => (
                                    <div key={idx} className="bg-white border border-[#F2F4F6] rounded-[28px] p-6 space-y-5 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <div className="px-3 py-1 bg-[#FFF0F0] text-[#F04452] rounded-lg text-[12px] font-bold">
                                                {row.DSPS_TYPECD_NM}
                                            </div>
                                            <Text className="text-[13px] text-[#B0B8C1] font-bold">{row.DSPS_DCSNDT}</Text>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-[14px] font-bold text-[#8B95A1]">위반 내용</div>
                                            <div className="bg-[#F9FAFB] p-4 rounded-2xl">
                                                <Text className="text-[15px] text-[#4E5968] leading-relaxed font-medium">{row.VILTCN}</Text>
                                            </div>
                                        </div>
                                        <div className="space-y-2 pt-1 border-t border-[#F2F4F6] mt-2">
                                            <div className="text-[14px] font-bold text-[#8B95A1] pt-3">처분 결과</div>
                                            <Text className="text-[15px] text-[#191F28] font-bold leading-relaxed">{row.DSPSCN}</Text>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-16 bg-white border border-[#F2F4F6] rounded-[28px] flex flex-col items-center justify-center space-y-4">
                                    <div className="p-4 bg-[#E8F8F0] rounded-full text-[#00D082]">
                                        <ShieldCheck className="w-8 h-8" />
                                    </div>
                                    <Text className="text-[#8B95A1] font-bold text-[16px]">깨끗한 식당입니다</Text>
                                </div>
                            )}
                        </div>
                    </section>
                </main>

                <footer className="p-6 bg-white border-t border-[#F2F4F6] sticky bottom-0">
                    <button
                        className="w-full py-5 bg-[#3182F6] text-white rounded-[22px] font-bold text-lg active:scale-[0.98] transition-all shadow-lg shadow-blue-100"
                        onClick={() => navigate('/')}
                    >
                        홈으로 돌아가기
                    </button>
                </footer>
            </div>
        </div>
    );
};
