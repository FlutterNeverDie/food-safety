import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Text } from '@toss/tds-mobile';
import { useOverlay } from '@toss/use-overlay';
import { useSearchStore, type Restaurant } from '../store/useSearchStore';
import { Search, Loader2, MapPin, ChevronRight, AlertCircle, CheckCircle2, X, Map, ChevronDown } from 'lucide-react';
import { REGION_DATA, PROVINCE_DISPLAY_NAMES } from '../data/constants/regions';

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

    // 검색 로직
    useEffect(() => {
        const timer = setTimeout(() => {
            if (keyword.length >= 2 && selectedCity && selectedDistrict) {
                searchRestaurants(keyword);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [keyword, searchRestaurants, selectedCity, selectedDistrict]);

    // 지역 선택 다이얼로그 (내부 상태 관리를 위한 래퍼 컴포넌트)
    const openRegionPicker = () => {
        overlay.open(({ isOpen, close, exit }) => {
            // 다이얼로그 내부에서만 쓰이는 임시 상태
            const [step, setStep] = useState<'city' | 'district'>(selectedCity ? 'district' : 'city');
            const [tempCity, setTempCity] = useState<string>(selectedCity || '');

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
                handleClose();
            };

            const resetAndGoBack = () => {
                setTempCity('');
                setStep('city');
            };

            return (
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                    onClick={handleClose}
                >
                    <div
                        className={`w-full max-w-md bg-white rounded-[32px] p-6 pb-8 space-y-6 flex flex-col transform transition-all duration-300 shadow-2xl h-[55vh] min-h-[420px] max-h-[600px] ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 헤더 */}
                        <div className="flex items-center justify-between px-2 shrink-0">
                            <div className="flex flex-col">
                                <Text className="text-[20px] font-bold text-[#191F28]">
                                    {step === 'city' ? '어느 지역인가요?' : tempCity}
                                </Text>
                                <Text className="text-[13px] font-medium text-[#8B95A1] mt-0.5">
                                    {step === 'city' ? '시/도를 선택해주세요' : '시/군/구를 선택해주세요'}
                                </Text>
                            </div>
                            <button onClick={handleClose} className="p-2 bg-[#F2F4F6] rounded-full text-[#8B95A1] active:scale-90 transition-transform">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* 선택 그리드 (스크롤 영영 및 높이 고정) */}
                        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                            {step === 'city' ? (
                                <div className="grid grid-cols-3 gap-3 overflow-y-auto pr-1 custom-scrollbar pb-2">
                                    {Object.entries(PROVINCE_DISPLAY_NAMES).map(([key, name]) => (
                                        <button
                                            key={key}
                                            onClick={() => handleCityClick(name)}
                                            className="py-5 px-1 bg-[#F2F4F6] rounded-[24px] text-[15px] font-bold text-[#4E5968] active:scale-95 active:bg-[#E5E8EB] transition-all"
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4 flex flex-col h-full overflow-hidden">
                                    <button
                                        onClick={resetAndGoBack}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F3FF] rounded-full text-[13px] font-bold text-[#3182F6] active:scale-95 transition-all ml-1 shrink-0 self-start"
                                    >
                                        <ChevronRight className="w-4 h-4 rotate-180" /> 처음부터 다시 선택
                                    </button>
                                    <div className="grid grid-cols-3 gap-3 overflow-y-auto pr-1 custom-scrollbar flex-1 pb-2">
                                        {(() => {
                                            const provinceKey = Object.keys(PROVINCE_DISPLAY_NAMES).find(
                                                key => PROVINCE_DISPLAY_NAMES[key] === tempCity
                                            );
                                            return provinceKey ? REGION_DATA[provinceKey].map(r => (
                                                <button
                                                    key={`${provinceKey}-${r.id}`}
                                                    onClick={() => handleDistrictClick(r.name)}
                                                    className={`py-5 px-1 rounded-[22px] text-[14px] font-bold transition-all active:scale-95 ${selectedDistrict === r.name && selectedCity === tempCity ? 'bg-[#3182F6] text-white shadow-md' : 'bg-[#F2F4F6] text-[#4E5968]'}`}
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

    const handleRestaurantClick = (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        addRecentSearch(restaurant.name);

        const isDanger = restaurant.status === '적발';
        overlay.open(({ isOpen, close, exit }) => {
            const handleClose = () => {
                close();
                setTimeout(() => { if (typeof exit === 'function') exit(); }, 300);
            };

            return (
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                    onClick={handleClose}
                >
                    <div
                        className={`w-full max-w-md bg-white rounded-[32px] p-8 pb-10 text-center space-y-8 transform transition-all duration-300 shadow-2xl ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-center">
                            <div className={`w-20 h-20 ${isDanger ? 'bg-[#FFF0F0]' : 'bg-[#E8F3FF]'} rounded-full flex items-center justify-center`}>
                                {isDanger ? <AlertCircle className="w-10 h-10 text-[#F04452]" /> : <Search className="w-8 h-8 text-[#3182F6]" />}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Text className="text-2xl font-bold leading-tight text-[#191F28]">
                                {isDanger ? '잠깐! 위생 적발 이력이\n발견된 식당이에요.' : '위생 이력을 확인 할까요?'}
                            </Text>
                            <Text className="text-[16px] leading-relaxed text-[#4E5968] font-medium">
                                {isDanger ? '안전한 식사를 위해 상세 내용을\n먼저 확인해보시는 건 어떨까요?' : '식약처 공공데이터를 기반으로\n위생 안전성을 체크합니다.'}
                            </Text>
                        </div>
                        <div className="space-y-3 pt-2">
                            <button
                                className="w-full py-5 bg-[#3182F6] text-white rounded-[22px] font-bold text-lg active:scale-[0.97] transition-all"
                                onClick={() => { handleClose(); navigate('/result'); }}
                            >
                                {isDanger ? '상세 내용 확인하기' : '확인하기'}
                            </button>
                            <button className="w-full py-4 text-[#8B95A1] font-bold" onClick={handleClose}>
                                {isDanger ? '닫기' : '취소'}
                            </button>
                        </div>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="app-container !bg-[#F9FAFB]">
            <div className="px-6 pt-20 pb-12 flex flex-col items-center text-center space-y-3 animate-fade-in-up">
                <Text className="text-[28px] font-bold leading-[1.3] text-[#191F28] tracking-tight">
                    어떤 식당의 위생이<br />궁금하신가요?
                </Text>
            </div>

            <main className="flex-1 px-6 space-y-8">
                {/* 1. 지역 선택 (가장 먼저 해야 함) */}
                <div className="animate-fade-in-up [animation-delay:50ms]">
                    <button
                        onClick={openRegionPicker}
                        className={`w-full flex items-center justify-between px-6 py-5 bg-white border rounded-[24px] shadow-sm active:scale-[0.98] transition-all ${selectedCity && selectedDistrict ? 'border-[#E5E8EB]' : 'border-[#3182F6] ring-4 ring-[#3182F6]/5'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${selectedCity ? 'bg-[#E8F3FF]' : 'bg-[#3182F6]/10'}`}>
                                <MapPin className={`w-5.5 h-5.5 ${selectedCity ? 'text-[#3182F6]' : 'text-[#3182F6]'}`} />
                            </div>
                            <div className="text-left">
                                <Text className={`text-[17px] font-bold ${selectedCity ? 'text-[#191F28]' : 'text-[#3182F6]'}`}>
                                    {selectedCity && selectedDistrict ? `${selectedCity} ${selectedDistrict}` : '어느 지역의 식당인가요?'}
                                </Text>
                            </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-[#B0B8C1]" />
                    </button>
                    {!selectedDistrict && (
                        <p className="mt-3 ml-4 text-[13px] font-bold text-[#3182F6] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> 검색 전 지역을 먼저 골라주세요
                        </p>
                    )}
                </div>

                {/* 2. 검색창 (지역 선택 전에는 비활성화) */}
                <div className="relative group animate-fade-in-up [animation-delay:100ms]">
                    <div className={`absolute inset-x-0 h-[68px] bg-white rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.04)] border transition-all duration-200 ${!selectedDistrict ? 'opacity-50 cursor-not-allowed border-transparent' : 'border-[#E5E8EB] group-focus-within:border-[#3182F6]'}`}></div>
                    <div className="relative flex items-center h-[68px] px-6 z-10 transition-opacity" style={{ opacity: selectedDistrict ? 1 : 0.4 }}>
                        <Search className={`w-6 h-6 mr-3 ${keyword ? 'text-[#3182F6]' : 'text-[#B0B8C1]'}`} />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder={selectedDistrict ? "식당 이름을 입력해주세요" : "지역을 먼저 골라주세요"}
                            value={keyword}
                            disabled={!selectedDistrict}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="flex-1 bg-transparent text-[17px] font-semibold text-[#191F28] placeholder:text-[#B0B8C1] outline-none"
                        />
                        {keyword.length > 0 && (
                            <button onClick={() => setKeyword('')} className="p-1.5 bg-[#B0B8C1]/20 rounded-full text-[#8B95A1] ml-2">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                        {isSearching && <Loader2 className="w-5 h-5 text-[#3182F6] animate-spin ml-2" />}
                    </div>
                </div>

                {/* 최근 검색어 / 결과 목록 (동일) */}
                {keyword.length === 0 ? (
                    <section className="space-y-6 animate-fade-in-up [animation-delay:150ms]">
                        <div className="flex justify-between items-center px-1">
                            <Text className="text-[17px] font-bold text-[#333D4B]">최근 생각하신 식당</Text>
                            {recentSearches.length > 0 && (
                                <button onClick={clearRecentSearches} className="text-[14px] font-bold text-[#3182F6]">모두 지우기</button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            {recentSearches.length > 0 ? (
                                recentSearches.map((name) => (
                                    <div key={name} className="flex items-center gap-1.5 px-5 py-3 bg-white border border-[#E5E8EB] rounded-full cursor-pointer active:scale-95 shadow-sm" onClick={() => setKeyword(name)}>
                                        <Text className="text-[15px] font-bold text-[#4E5968]">{name}</Text>
                                        <button onClick={(e) => { e.stopPropagation(); removeRecentSearch(name); }} className="text-[#B0B8C1]"><X className="w-3 h-3" /></button>
                                    </div>
                                ))
                            ) : (
                                <div className="w-full py-16 flex flex-col items-center justify-center bg-white rounded-[32px] border border-[#F2F4F6]">
                                    <Map className="w-10 h-10 text-[#E5E8EB] mb-4" />
                                    <p className="text-[#B0B8C1] font-bold text-center text-[14px]">지역을 선택하고<br />식당을 검색해보세요.</p>
                                </div>
                            )}
                        </div>
                    </section>
                ) : (
                    <section className="space-y-4 animate-fade-in-up">
                        <div className="flex items-center justify-between px-1">
                            <Text className="text-[14px] font-bold text-[#8B95A1]">{isSearching ? '조회 중...' : `검색 결과 ${searchResults.length}개`}</Text>
                        </div>
                        <div className="grid gap-3 pb-24">
                            {searchResults.map((res) => (
                                <div key={res.id} onClick={() => handleRestaurantClick(res)} className="p-6 bg-white border border-[#F2F4F6] rounded-[28px] flex items-center justify-between active:scale-[0.98] cursor-pointer shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-[#FFF0F0] rounded-[20px] flex items-center justify-center text-2xl">🚨</div>
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <Text className="text-[17px] font-bold text-[#191F28]">{res.name}</Text>
                                                <span className="text-[10px] font-bold text-[#3182F6] bg-blue-50 px-2 py-0.5 rounded-full">{res.category}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[#8B95A1]">
                                                <MapPin className="w-3 h-3" />
                                                <Text className="text-[13px] font-medium line-clamp-1">{res.address}</Text>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-[#D1D6DB]" />
                                </div>
                            ))}
                            {!isSearching && searchResults.length === 0 && (
                                <div className="py-24 text-center px-4 bg-white rounded-[32px] border border-[#F2F4F6]">
                                    <div className="w-20 h-20 bg-[#E8F8F0] rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="w-10 h-10 text-[#00D082]" />
                                    </div>
                                    <Text className="text-[20px] font-bold text-[#191F28]">안심 식당이에요!</Text>
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};
