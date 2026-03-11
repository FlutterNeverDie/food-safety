import React from 'react';
import { Text } from '@toss/tds-mobile';
import { Map, X, ChevronRight } from 'lucide-react';
import type { Restaurant } from '../../store/useSearchStore';

interface Props {
    selectedDistrict: string;
    recentSearches: string[];
    isSearching: boolean;
    filteredResults: Restaurant[];
    onClearRecent: () => void;
    onRemoveRecent: (region: string) => void;
    onSelectRecent: (city: string, district: string) => void;
    onRestaurantClick: (res: Restaurant) => void;
}

export const SearchResultSection: React.FC<Props> = ({
    selectedDistrict,
    recentSearches,
    isSearching,
    filteredResults,
    onClearRecent,
    onRemoveRecent,
    onSelectRecent,
    onRestaurantClick
}) => {
    if (!selectedDistrict) {
        return (
            <section className="space-y-6 animate-fade-in-up [animation-delay:150ms]">
                <div className="flex justify-between items-center px-1">
                    <Text className="text-[17px] font-semibold text-[#333D4B]">최근 검색한 지역</Text>
                    {recentSearches.length > 0 && (
                        <button onClick={onClearRecent} className="text-[14px] font-semibold text-[#3182F6]">모두 지우기</button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2.5">
                    {recentSearches.length > 0 ? (
                        recentSearches.map((region) => {
                            const [city, district] = region.split(' ');
                            return (
                                <div 
                                    key={region} 
                                    className="flex items-center gap-1.5 px-5 py-3 bg-white border border-[#E5E8EB] rounded-full cursor-pointer active:scale-95 shadow-sm" 
                                    onClick={() => onSelectRecent(city, district)}
                                >
                                    <Text className="text-[15px] font-semibold text-[#4E5968]">{region}</Text>
                                    <button 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            onRemoveRecent(region); 
                                        }} 
                                        className="text-[#B0B8C1]"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <div className="w-full py-16 flex flex-col items-center justify-center bg-white rounded-[32px] border border-[#F2F4F6]">
                            <Map className="w-10 h-10 text-[#E5E8EB] mb-4" />
                            <p className="text-[#B0B8C1] font-semibold text-center text-[14px]">지역을 선택하시면<br />최근 검색한 내역에 저장돼요.</p>
                        </div>
                    )}
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between px-1">
                <Text className="text-[14px] font-semibold text-[#8B95A1]">{isSearching ? '조회 중...' : `검색 결과 ${filteredResults.length}개`}</Text>
            </div>
            <div className="grid gap-3 pb-24">
                {filteredResults.map((res) => (
                    <div key={res.id} onClick={() => onRestaurantClick(res)} className="p-6 bg-white border border-[#F2F4F6] rounded-[28px] flex items-center justify-between active:scale-[0.98] cursor-pointer shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-[#FFF0F0] rounded-full flex items-center justify-center text-2xl">🚨</div>
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <Text className="text-[17px] font-semibold text-[#191F28]">{res.name}</Text>
                                    <span className="text-[10px] font-semibold text-[#3182F6] bg-blue-50 px-2 py-0.5 rounded-full">{res.category}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[#8B95A1]">
                                    <Text className="text-[13px] font-medium line-clamp-1">{res.address}</Text>
                                </div>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#D1D6DB]" />
                    </div>
                ))}
                {!isSearching && filteredResults.length === 0 && (
                    <div className="py-24 px-6 text-center animate-fade-in-up">
                        <Text className="text-[14px] text-[#8B95A1] font-medium leading-relaxed">
                            검색하신 지역과 이름이 일치하는<br />
                            위생 적발 기록이 발견되지 않았습니다.
                        </Text>
                    </div>
                )}
            </div>
        </section>
    );
};
