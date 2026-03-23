import React, { useEffect, useRef } from 'react';
import { useTossInterstitialAd } from '../hooks/useTossInterstitialAd';
import { useNavigate } from 'react-router-dom';

import { useOverlay } from '@toss/use-overlay';
import { useSearchStore, type Restaurant } from '../store/useSearchStore';
import { X, ChevronRight } from 'lucide-react';
import { REGION_DATA, PROVINCE_DISPLAY_NAMES } from '../data/constants/regions';
import { SearchHeader } from '../components/search/SearchHeader';
import { RegionSection } from '../components/search/RegionSection';
import { SearchBar } from '../components/search/SearchBar';
import { SearchResultSection } from '../components/search/SearchResultSection';
import { TossBannerAd } from '../components/common/TossBannerAd';
import { AD_CONFIG } from '../constants/adConfig';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

export const SearchPage: React.FC = () => {
    // 페이지 진입 시 스크롤 최상단
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
    const { showAd, isAdLoaded, isSupported } = useTossInterstitialAd(AD_CONFIG.INTERSTITIAL_ID);
    
    // 버튼을 비활성화할 지 판단
    const isLoadingAd = isSupported && !isAdLoaded;

    // [변경] useEffect 자동 검색 로직 삭제 (handleDistrictClick에서 직접 제어하여 중복/무한 호출 방지)
    // 이전: useEffect(() => { ... }, [...]);

    // 입력한 키워드 필터링
    const filteredResults = searchResults.filter(res =>
        res.name.includes(keyword.trim())
    );

    // 지역 선택 다이얼로그
    const openRegionPicker = () => {
        overlay.open(({ isOpen, close, exit }) => {
            const [step, setStep] = React.useState<'city' | 'district'>(selectedCity ? 'district' : 'city');
            const [tempCity, setTempCity] = React.useState<string>(selectedCity || '');
            
            // 다이얼로그 열려있을 때 배경 스크롤 차단
            useBodyScrollLock(isOpen);

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
                // 명시적으로 검색 호출
                searchRestaurants();
                handleClose();
            };

            return (
                <div
                    className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={handleClose}
                >
                    <div
                        className={`w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[32px] p-6 pb-12 sm:pb-8 space-y-6 flex flex-col transform transition-all duration-500 shadow-2xl h-[75vh] sm:h-[65vh] min-h-[500px] ${isOpen ? 'translate-y-0 sm:scale-100' : 'translate-y-full sm:scale-95'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-2 pt-2">
                            <div className="flex flex-col">
                                <span className="text-[24px] font-bold text-[#191F28] tracking-tight">
                                    {step === 'city' ? '어느 지역인가요?' : tempCity}
                                </span>
                                <span className="text-[14px] font-medium text-[#8B95A1] mt-1">
                                    {step === 'city' ? '주소를 찾기 위해 시/도를 선택해주세요' : '상세 시/군/구를 선택해주세요'}
                                </span>
                            </div>
                            <button onClick={handleClose} className="p-2.5 bg-[#F2F4F6] rounded-full text-[#8B95A1] active:scale-90 transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-hidden flex flex-col min-h-0 pt-2">
                            {step === 'city' ? (
                                <div className="grid grid-cols-3 gap-3 content-start overflow-y-auto pr-1 pb-10 custom-scrollbar">
                                    {Object.entries(PROVINCE_DISPLAY_NAMES).map(([key, name]) => (
                                        <button
                                            key={key}
                                            onClick={() => handleCityClick(name)}
                                            className="py-6 bg-[#F9FAFB] border border-[#F2F4F6] rounded-[24px] text-[16px] font-bold text-[#4E5968] active:bg-[#E8F3FF] active:text-[#3182F6] active:border-[#3182F6]/20 transition-all"
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col h-full overflow-hidden space-y-5">
                                    <button onClick={() => setStep('city')} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F2F4F6] rounded-full text-[13px] font-bold text-[#6B7684] self-start active:scale-95 transition-all">
                                        <ChevronRight className="w-4 h-4 rotate-180" /> 처음부터 다시 선택
                                    </button>
                                    <div className="grid grid-cols-3 gap-3 content-start overflow-y-auto pr-1 pb-10 flex-1 custom-scrollbar">
                                        {(() => {
                                            const provinceKey = Object.keys(PROVINCE_DISPLAY_NAMES).find(key => PROVINCE_DISPLAY_NAMES[key] === tempCity);
                                            return provinceKey ? REGION_DATA[provinceKey].map(r => (
                                                <button
                                                    key={`${provinceKey}-${r.id}`}
                                                    onClick={() => handleDistrictClick(r.name)}
                                                    className={`py-6 rounded-[22px] text-[15px] font-bold transition-all border ${selectedDistrict === r.name && selectedCity === tempCity ? 'bg-[#3182F6] text-white border-[#3182F6] shadow-lg shadow-blue-100' : 'bg-[#F9FAFB] text-[#4E5968] border-[#F2F4F6] active:bg-[#E8F3FF]'}`}
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
                                <p className="!text-[22px] !font-bold !leading-tight !text-[#191F28]">
                                    <span className="!font-semibold !text-[26px] !text-[#F04452]">{restaurant.name}</span>의<br />위생 적발 이력이 있어요
                                </p>
                                <p className="text-[15px] leading-relaxed text-[#8B95A1] font-medium">
                                    식품안전나라 데이터를 기반으로 확인된<br />행정처분 내역입니다.
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#F9FAFB] rounded-[24px] p-6 space-y-4 border border-[#F2F4F6]">
                            <div className="flex justify-between items-start">
                                <span className="text-[14px] font-bold text-[#4E5968]">최근 적발일</span>
                                <span className="text-[14px] font-medium text-[#191F28]">
                                    {(() => {
                                        const date = restaurant.lastInspection;
                                        if (date && date.length === 8) {
                                            return `${date.substring(0, 4)}년 ${parseInt(date.substring(4, 6))}월 ${parseInt(date.substring(6, 8))}일`;
                                        }
                                        return date || '정보 없음';
                                    })()}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[14px] font-bold text-[#4E5968] block">주요 위반 내용</span>
                                <div className="space-y-1.5">
                                    {restaurant.violations?.slice(0, 2).map((v, i) => (
                                        <div key={i} className="flex gap-2">
                                            <span className="text-[#F04452] shrink-0">•</span>
                                            <p className="text-[13px] font-medium text-[#4E5968] leading-relaxed line-clamp-2">
                                                {v.split(': ')[0]}
                                            </p>
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
                                {isLoadingAd ? '상세 내역 전체보기 (광고 로딩 중...)' : '광고 보고 상세 내역 전체보기'}
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

            <main className="flex-1 px-6 space-y-8 pb-32">
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

            {/* 메인 하단 고정 배너 광고 */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#F2F4F6] w-full max-w-lg mx-auto overflow-hidden">
                <TossBannerAd adGroupId={AD_CONFIG.BANNER_LIST_ID} height="96px" />
            </div>
        </div>
    );
};
