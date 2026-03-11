import React, { useEffect, useRef } from 'react';
import { useTossRewardAd } from '../hooks/useTossRewardAd';
import { useNavigate } from 'react-router-dom';
import { Text } from '@toss/tds-mobile';
import { useOverlay } from '@toss/use-overlay';
import { useSearchStore, type Restaurant } from '../store/useSearchStore';
import { X, ChevronRight } from 'lucide-react';
import { REGION_DATA, PROVINCE_DISPLAY_NAMES } from '../data/constants/regions';
import { SearchHeader } from '../components/search/SearchHeader';
import { RegionSection } from '../components/search/RegionSection';
import { SearchBar } from '../components/search/SearchBar';
import { SearchResultSection } from '../components/search/SearchResultSection';

export const SearchPage: React.FC = () => {
    const {
        keyword,
        setKeyword,
        searchResults,
        isSearching,
        searchRestaurants,
        setSelectedRestaurant,
        recentSearches,
        addRecentSearch,
        removeRecentSearch,
        clearRecentSearches,
        selectedCity,
        setSelectedCity,
        selectedDistrict,
        setSelectedDistrict
    } = useSearchStore();
    const navigate = useNavigate();
    const overlay = useOverlay();
    const inputRef = useRef<HTMLInputElement>(null);
    const AD_GROUP_ID = 'ait-ad-test-rewarded-id'; // 테스트/기본 보상형 광고 ID (구글 애드몹 기반 포함)
    const { showAd, isAdLoaded, isSupported, hasError } = useTossRewardAd(AD_GROUP_ID);
    
    // 버튼을 비활성화할 지 판단 (지원되는 기기에서만 로딩 확인. 로딩 중이거나 에러가 생기지 않았을 때)
    const isLoadingAd = isSupported && !isAdLoaded && !hasError;

    // 검색 로직 (선택된 지역이 있을 때 데이터 패치)
    useEffect(() => {
        if (selectedCity && selectedDistrict) {
            searchRestaurants();
        }
    }, [searchRestaurants, selectedCity, selectedDistrict]);

    // 입력한 키워드 필터링
    const filteredResults = searchResults.filter(res =>
        res.name.includes(keyword.trim())
    );

    // 지역 선택 다이얼로그
    const openRegionPicker = () => {
        overlay.open(({ isOpen, close, exit }) => {
            const [step, setStep] = React.useState<'city' | 'district'>(selectedCity ? 'district' : 'city');
            const [tempCity, setTempCity] = React.useState<string>(selectedCity || '');

            const handleClose = () => {
                close();
                setTimeout(() => { if (typeof exit === 'function') exit(); }, 300);
            };

            const handleCityClick = (name: string) => {
                setTempCity(name);
                setStep('district');
            };

            const handleDistrictClick = (name: string) => {
                setSelectedCity(tempCity);
                setSelectedDistrict(name);
                addRecentSearch(`${tempCity} ${name}`);
                handleClose();
            };

            return (
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={handleClose}
                >
                    <div
                        className={`w-full max-w-md bg-white rounded-[32px] p-6 pb-8 space-y-6 flex flex-col transform transition-all duration-300 shadow-2xl h-[55vh] min-h-[420px] max-h-[600px] ${isOpen ? 'scale-100' : 'scale-95'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-2">
                            <div className="flex flex-col">
                                <Text className="text-[20px] font-bold text-[#191F28]">
                                    {step === 'city' ? '어느 지역인가요?' : tempCity}
                                </Text>
                                <Text className="text-[13px] font-medium text-[#8B95A1] mt-0.5">
                                    {step === 'city' ? '시/도를 선택해주세요' : '시/군/구를 선택해주세요'}
                                </Text>
                            </div>
                            <button onClick={handleClose} className="p-2 bg-[#F2F4F6] rounded-full text-[#8B95A1]">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                            {step === 'city' ? (
                                <div className="grid grid-cols-3 gap-3 content-start overflow-y-auto pr-1 custom-scrollbar">
                                    {Object.entries(PROVINCE_DISPLAY_NAMES).map(([key, name]) => (
                                        <button
                                            key={key}
                                            onClick={() => handleCityClick(name)}
                                            className="py-5 bg-[#F2F4F6] rounded-[24px] text-[15px] font-bold text-[#4E5968] active:scale-95 transition-all"
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col h-full overflow-hidden space-y-4">
                                    <button onClick={() => setStep('city')} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F3FF] rounded-full text-[13px] font-bold text-[#3182F6] self-start">
                                        <ChevronRight className="w-4 h-4 rotate-180" /> 처음부터 다시
                                    </button>
                                    <div className="grid grid-cols-3 gap-3 content-start overflow-y-auto pr-1 flex-1 custom-scrollbar">
                                        {(() => {
                                            const provinceKey = Object.keys(PROVINCE_DISPLAY_NAMES).find(key => PROVINCE_DISPLAY_NAMES[key] === tempCity);
                                            return provinceKey ? REGION_DATA[provinceKey].map(r => (
                                                <button
                                                    key={`${provinceKey}-${r.id}`}
                                                    onClick={() => handleDistrictClick(r.name)}
                                                    className={`py-5 rounded-[22px] text-[14px] font-bold transition-all ${selectedDistrict === r.name && selectedCity === tempCity ? 'bg-[#3182F6] text-white' : 'bg-[#F2F4F6] text-[#4E5968]'}`}
                                                >
                                                    {r.name}
                                                </button>
                                            )) : null;
                                        })()}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        });
    };

    // 식당 클릭 다이얼로그 (광고 연동 포함)
    const handleRestaurantClick = (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        overlay.open(({ isOpen, close, exit }) => {
            const handleClose = () => {
                close();
                setTimeout(() => { if (typeof exit === 'function') exit(); }, 300);
            };

            const handleShowAd = () => {
                showAd(() => {
                    handleClose();
                    navigate('/result');
                });
            };

            return (
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={handleClose}
                >
                    <div
                        className={`w-full max-w-md bg-white rounded-[32px] p-8 pb-10 space-y-7 transform transition-all duration-300 shadow-2xl ${isOpen ? 'scale-100' : 'scale-95'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-[#FFF0F0] rounded-full flex items-center justify-center text-3xl text-[#F04452]">🚨</div>
                            <div className="space-y-2">
                                <Text className="text-[22px] font-bold leading-tight text-[#191F28]">
                                    <span className="font-semibold text-[26px] text-[#F04452]">{restaurant.name}</span>의<br />위생 적발 이력이 있어요
                                </Text>
                                <Text className="text-[15px] leading-relaxed text-[#8B95A1] font-medium">
                                    식품안전나라 데이터를 기반으로 확인된<br />행정처분 내역입니다.
                                </Text>
                            </div>
                        </div>

                        <div className="bg-[#F9FAFB] rounded-[24px] p-6 space-y-4 border border-[#F2F4F6]">
                            <div className="flex justify-between items-start">
                                <Text className="text-[14px] font-bold text-[#4E5968]">최근 적발일</Text>
                                <Text className="text-[14px] font-medium text-[#191F28]">
                                    {(() => {
                                        const date = restaurant.lastInspection;
                                        if (date && date.length === 8) {
                                            return `${date.substring(0, 4)}년 ${parseInt(date.substring(4, 6))}월 ${parseInt(date.substring(6, 8))}일`;
                                        }
                                        return date || '정보 없음';
                                    })()}
                                </Text>
                            </div>
                            <div className="space-y-2">
                                <Text className="text-[14px] font-bold text-[#4E5968] block">주요 위반 내용</Text>
                                <div className="space-y-1.5">
                                    {restaurant.violations?.slice(0, 2).map((v, i) => (
                                        <div key={i} className="flex gap-2">
                                            <span className="text-[#F04452] shrink-0">•</span>
                                            <Text className="text-[13px] font-medium text-[#4E5968] leading-relaxed line-clamp-2">
                                                {v.split(': ')[0]}
                                            </Text>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <button
                                className={`w-full py-5 text-white rounded-[22px] font-bold text-lg transition-all shadow-xl shadow-blue-100 ${isLoadingAd ? 'bg-[#98C0FF] cursor-not-allowed' : 'bg-[#3182F6] active:scale-[0.97]'}`}
                                onClick={isLoadingAd ? undefined : handleShowAd}
                                disabled={isLoadingAd}
                            >
                                {isLoadingAd ? '상세 내역 전체보기 (광고 로딩 중...)' : '상세 내역 전체보기'}
                            </button>
                            <button className="w-full py-2 text-[#8B95A1] font-bold text-[15px]" onClick={handleClose}>
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="app-container !bg-[#F9FAFB]">
            <SearchHeader />

            <main className="flex-1 px-6 space-y-8">
                {/* 1. 위치 지역 선택 */}
                <RegionSection 
                    selectedCity={selectedCity} 
                    selectedDistrict={selectedDistrict} 
                    onOpenPicker={openRegionPicker} 
                />

                {/* 2. 검색창 */}
                <SearchBar 
                    keyword={keyword} 
                    setKeyword={setKeyword} 
                    isSearching={isSearching} 
                    selectedDistrict={selectedDistrict} 
                    inputRef={inputRef} 
                />

                {/* 3. 최근 검색 및 검색 결과 */}
                <SearchResultSection 
                    selectedDistrict={selectedDistrict}
                    recentSearches={recentSearches}
                    isSearching={isSearching}
                    filteredResults={filteredResults}
                    onClearRecent={clearRecentSearches}
                    onRemoveRecent={removeRecentSearch}
                    onSelectRecent={(city, district) => {
                        setSelectedCity(city);
                        setSelectedDistrict(district);
                    }}
                    onRestaurantClick={handleRestaurantClick}
                />
            </main>
        </div>
    );
};
