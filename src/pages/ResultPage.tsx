import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Text, Button, Badge } from '@toss/tds-mobile';
import { useSearchStore } from '../store/useSearchStore';
import { ChevronLeft } from 'lucide-react';

export const ResultPage: React.FC = () => {
    const { selectedRestaurant } = useSearchStore();
    const navigate = useNavigate();

    if (!selectedRestaurant) return null;

    const isClean = selectedRestaurant.status !== '적발';

    return (
        <div className="min-h-screen bg-white flex flex-col pt-4">
            <header className="px-6 py-4 flex items-center justify-between border-b border-gray-50">
                <ChevronLeft onClick={() => navigate(-1)} className="w-6 h-6 stroke-gray-400 cursor-pointer" />
                <Text className="text-lg font-bold">식당 위생 정보</Text>
                <div className="w-6"></div>
            </header>

            <div className="flex-1 px-10 flex flex-col items-center pt-20 text-center space-y-12">
                {isClean ? (
                    <>
                        <div className="relative w-56 h-56 flex items-center justify-center">
                            <div className="absolute inset-0 bg-[#E8F8F0] rounded-full opacity-50"></div>
                            <div className="relative w-36 h-36 bg-[#00D082] rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                                ✓
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="inline-block px-5 py-1.5 bg-[#E8F8F0] text-[#00D084] rounded-full text-xs font-bold uppercase tracking-wider">CLEAN STATUS</div>
                            <Text className="text-3xl font-bold leading-snug">안심하고 드세요!</Text>
                            <Text color="grey600" className="text-lg leading-relaxed pt-2">최근 1년간 위반 내역이 없는<br />청결한 안심 식당입니다.</Text>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="relative w-56 h-56 flex items-center justify-center">
                            <div className="absolute inset-0 bg-[#FFF0F0] rounded-full opacity-50"></div>
                            <div className="relative w-36 h-36 bg-[#F04452] rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                                !
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="inline-block px-5 py-1.5 bg-[#FFF0F0] text-[#F04452] rounded-full text-xs font-bold uppercase tracking-wider">VIOLATION ALERT</div>
                            <Text className="text-3xl font-bold leading-snug">주의가 필요해요</Text>
                            <Text color="grey600" className="text-lg leading-relaxed pt-2">과거 위생 적발 이력이 발견되었습니다.<br />상세 내역을 확인해주세요.</Text>
                        </div>
                    </>
                )}

                <div className="w-full p-8 bg-[#F9FAFB] rounded-[32px] space-y-6 text-left border border-[#F2F4F6]">
                    <div className="flex justify-between items-center border-b border-[#F2F4F6] pb-4">
                        <Text color="grey600" className="text-base">위생 등급</Text>
                        <Text color={isClean ? '#00D082' : '#F04452'} className="text-base font-bold">{selectedRestaurant.status}</Text>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#F2F4F6] pb-4">
                        <Text color="grey600" className="text-base">최종 점검일</Text>
                        <Text className="text-base font-bold">{selectedRestaurant.lastInspection || '기록 없음'}</Text>
                    </div>
                    <div className="flex justify-between items-start pt-1">
                        <Text color="grey600" className="text-base whitespace-nowrap">행정 처분 내역</Text>
                        <div className="text-right ml-4">
                            {selectedRestaurant.violations && selectedRestaurant.violations.length > 0 ? (
                                selectedRestaurant.violations.map((v, i) => (
                                    <Text key={i} className="text-sm font-bold mb-1 block leading-tight">{v}</Text>
                                ))
                            ) : (
                                <Text className="text-base font-bold text-[#3182F6]">없음</Text>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 py-10">
                <Button className="w-full py-5 rounded-[20px] bg-[#3182F6] text-white font-bold" onClick={() => navigate('/')}>확인</Button>
            </div>
        </div>
    );
};
