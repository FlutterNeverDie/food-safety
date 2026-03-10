import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Text, TextField } from '@toss/tds-mobile';
import { useOverlay } from '@toss/use-overlay';
import { useSearchStore, type Restaurant } from '../store/useSearchStore';
import { Search } from 'lucide-react';

export const SearchPage: React.FC = () => {
    const {
        keyword,
        setKeyword,
        recommendations,
        setSelectedRestaurant,
        recentSearches,
        addRecentSearch,
        removeRecentSearch,
        clearRecentSearches
    } = useSearchStore();
    const navigate = useNavigate();
    const overlay = useOverlay();

    const handleRestaurantClick = (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        addRecentSearch(restaurant.name); // 상호명 로컬스토리지 저장

        if (restaurant.status === '적발') {
            // 이미지 4: 적발 시 티징 오버레이 (광고 유도)
            overlay.open(({ isOpen, close }) => (
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={close}
                >
                    <div
                        className="w-full max-w-[320px] rounded-[32px] bg-white p-8 text-center space-y-8 transform transition-transform"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-center pt-2">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                                <span className="text-3xl">⚠️</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Text className="text-xl font-bold leading-snug">잠깐! 이 식당에서<br />위생 적발 이력이 발견되었어요.</Text>
                            <Text color="grey600" className="text-sm">3초만 투자하면 내 입으로 들어갈<br />음식의 진실을 알 수 있어요</Text>
                        </div>
                        <button
                            className="w-full py-4 bg-[#3182F6] text-white rounded-2xl font-bold text-lg active:bg-blue-700 transition-colors"
                            onClick={() => {
                                // 광고 시청 시뮬레이션
                                setTimeout(() => {
                                    close();
                                    navigate('/result');
                                }, 3000);
                            }}
                        >
                            광고 보고 결과 확인하기
                        </button>
                    </div>
                </div>
            ));
        } else {
            // 이미지 2: 일반 확인 다이얼로그 (정보 확인 여부)
            overlay.open(({ isOpen, close }) => (
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-10 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={close}
                >
                    <div
                        className="bg-white rounded-[32px] p-8 w-full max-w-[320px] space-y-8 text-center shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-center pt-2">
                            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                                <span className="text-2xl">🛡️</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Text className="text-xl font-bold">위생 적발 이력을 확인 할까요?</Text>
                            <Text color="grey600" className="text-sm">식약처 공공데이터를 기반으로<br />최근 1년간의 기록을 확인합니다.</Text>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button
                                className="w-full py-4 bg-[#3182F6] text-white rounded-2xl font-bold active:bg-blue-700 transition-colors"
                                onClick={() => { close(); navigate('/result'); }}
                            >
                                확인하기
                            </button>
                            <button
                                className="w-full py-4 bg-[#F2F4F6] text-[#4E5968] rounded-2xl font-bold active:bg-gray-200 transition-colors"
                                onClick={close}
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            ));
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center px-6">
            <div className="w-full max-w-md pt-24 space-y-12">
                <header className="space-y-4">
                    <Text className="text-[32px] font-bold leading-tight tracking-tight">
                        어떤 배달 식당의<br />
                        위생이 궁금하신가요?
                    </Text>
                    <Text color="grey600" className="text-lg">
                        식당 이름을 입력하면<br />
                        최근 위생 점검 결과를 알려드려요.
                    </Text>
                </header>

                <div className="relative flex items-center group">
                    <TextField
                        variant="line"
                        placeholder="식당 상호명 입력 (예: 마라탕)"
                        value={keyword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
                        className="w-full h-16 text-xl bg-[#F9FAFB] rounded-2xl px-6 border-none focus:ring-2 focus:ring-[#3182F6] transition-all"
                    />
                    <Search className="absolute right-6 text-[#B0B8C1] w-6 h-6 pointer-events-none group-focus-within:text-[#3182F6] transition-colors" />
                </div>

                {/* 최근 검색어 섹션 (검색어가 없을 때만 노출) */}
                {keyword.length === 0 && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center">
                            <Text className="text-lg font-bold">최근 검색한 식당</Text>
                            {recentSearches.length > 0 && (
                                <button
                                    onClick={clearRecentSearches}
                                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    지우기
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {recentSearches.length > 0 ? (
                                recentSearches.map((name) => (
                                    <div
                                        key={name}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-[#F2F4F6] rounded-full group cursor-pointer hover:bg-[#E5E8EB] transition-all"
                                        onClick={() => setKeyword(name)}
                                    >
                                        <Text className="text-sm font-medium text-[#4E5968]">{name}</Text>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeRecentSearch(name);
                                            }}
                                            className="text-[#B0B8C1] hover:text-[#8B95A1] transition-colors"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="w-full py-20 flex flex-col items-center justify-center space-y-6">
                                    <div className="w-32 h-32 bg-[#F2F4F6] rounded-full flex items-center justify-center">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 18L12 12M12 8L12.01 8" stroke="#B0B8C1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="12" cy="12" r="9" stroke="#B0B8C1" strokeWidth="2" />
                                        </svg>
                                    </div>
                                    <Text className="text-[#B0B8C1] text-base">배달 앱에 등록된 업체명을 입력해보세요</Text>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 검색 결과 리스트 (검색어가 입력될 때만 노출) */}
                {keyword.length > 0 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Text color="grey600" className="text-sm font-bold ml-1">검색 결과</Text>
                        <div className="space-y-3">
                            {recommendations.filter(res => res.name.includes(keyword)).map((res) => (
                                <div
                                    key={res.id}
                                    onClick={() => handleRestaurantClick(res)}
                                    className="flex items-center justify-between p-5 bg-[#F9FAFB] rounded-[24px] cursor-pointer hover:bg-[#F2F4F6] active:scale-[0.98] transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-gray-50">
                                            {res.category === '중식' ? '🥢' : res.category === '양식' ? '🍕' : res.category === '패스트푸드' ? '🍔' : '🍱'}
                                        </div>
                                        <div>
                                            <Text className="text-lg font-bold">{res.name}</Text>
                                            <Text color="grey500" className="text-sm mt-0.5">{res.category} • {res.distance}</Text>
                                        </div>
                                    </div>
                                    <div className="text-[#B0B8C1]">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7 15L12 10L7 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                            {recommendations.filter(res => res.name.includes(keyword)).length === 0 && (
                                <div className="py-12 text-center space-y-2">
                                    <Text className="text-lg font-bold text-gray-300">검색 결과가 없어요</Text>
                                    <Text className="text-sm text-gray-300">식당 이름을 다시 확인해주세요</Text>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
