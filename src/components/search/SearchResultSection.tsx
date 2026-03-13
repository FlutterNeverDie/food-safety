import React, { Fragment } from 'react';
import { Map, X, ChevronRight } from 'lucide-react';
import type { Restaurant } from '../../store/useSearchStore';
import { TossBannerAd } from '../common/TossBannerAd';

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
                    <h2 className="text-[17px] font-semibold text-[#333D4B]">최근 검색한 지역</h2>
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
                                    <span className="text-[15px] font-semibold text-[#4E5968]">{region}</span>
                                    <button 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            onRemoveRecent(region); 
                                        }} 
                                        className="text-[#B0B8C1]"
                                        aria-label="삭제"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <div className="w-full py-16 flex flex-col items-center justify-center bg-white rounded-[32px] border border-[#F2F4F6]">
                            <Map className="w-10 h-10 text-[#E5E8EB] mb-4" />
                            <p className="text-[#B0B8C1] font-semibold text-center text-[14px] leading-relaxed">지역을 선택하시면<br />최근 검색한 내역에 저장돼요.</p>
                        </div>
                    )}
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between px-1">
                <span className="text-[14px] font-semibold text-[#8B95A1]">{isSearching ? '조회 중...' : `검색 결과 ${filteredResults.length}개`}</span>
            </div>
            <div className="grid gap-3 pb-24">
                {filteredResults.map((res, index: number) => (
                    <Fragment key={res.id}>
                        <div 
                            onClick={() => onRestaurantClick(res)} 
                            className="w-full box-border overflow-hidden p-4 sm:p-5 bg-white border border-[#F2F4F6] rounded-[28px] flex items-center gap-3 sm:gap-4 active:scale-[0.98] cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 group"
                        >
                            {/* 아이콘: 모바일 환경에 대응하기 위해 불필요한 크기 팽창 억제 */}
                            <div className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] bg-[#FFF0F0] rounded-full flex items-center justify-center text-2xl sm:text-3xl shrink-0 group-hover:scale-110 transition-transform">🚨</div>
                            
                            {/* 텍스트 정보 (확실히 줄어들게 flex-1 min-w-0 강제) */}
                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                                {/* 가로 넘침(Overflow) 완벽 차단용 w-full min-w-0 */}
                                <div className="flex items-center justify-between gap-2 w-full min-w-0">
                                    {/* truncate가 확실히 동작하도록 flex-1 min-w-0 박스 설정, flex 제거 */}
                                    <div className="flex-1 min-w-0 text-[18px] sm:text-[19px] font-semibold text-[#3182F6] tracking-tight truncate">
                                        {res.name}
                                    </div>
                                    <span className="shrink-0 text-[11px] font-bold text-[#3182F6] bg-[#E8F3FF] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-[#3182F6]/10">
                                        {res.category}
                                    </span>
                                </div>
                                <p className="mt-0.5 text-[14px] sm:text-[15px] font-medium text-[#8B95A1] leading-snug tracking-tight line-clamp-2 break-all text-left">
                                    {res.address}
                                </p>
                            </div>

                            {/* 우측 화살표 (공간 최소화로 우측 잘림 방지) */}
                            <ChevronRight className="w-5 h-5 text-[#D1D6DB] shrink-0" />
                        </div>
                        {/* 5번째 아이템마다 리스트 안에 카드형 광고 삽입 */}
                        {(index + 1) % 5 === 0 && (
                            <div className="py-2">
                                <TossBannerAd adGroupId="ait-ad-test-banner-id" variant="card" height="96px" />
                            </div>
                        )}
                    </Fragment>
                ))}
                {!isSearching && filteredResults.length === 0 && (
                    <div className="py-24 px-6 text-center animate-fade-in-up">
                        <p className="text-[14px] text-[#8B95A1] font-medium leading-relaxed">
                            검색하신 지역과 이름이 일치하는<br />
                            위생 적발 기록이 발견되지 않았습니다.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};
