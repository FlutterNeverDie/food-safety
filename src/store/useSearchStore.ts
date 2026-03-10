import { create } from 'zustand';

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  distance: string;
  status: '매우 우수' | '우수' | '정보 없음' | '적발';
  lastInspection?: string;
  violations?: string[];
}

interface SearchStore {
  keyword: string;
  setKeyword: (keyword: string) => void;
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  recommendations: Restaurant[];
  recentSearches: string[];
  addRecentSearch: (name: string) => void;
  removeRecentSearch: (name: string) => void;
  clearRecentSearches: () => void;
}

const STORAGE_KEY = 'toss-delivery-recent-searches';

export const useSearchStore = create<SearchStore>((set) => ({
  keyword: '',
  recentSearches: JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'),
  setKeyword: (keyword) => set({ keyword }),
  selectedRestaurant: null,
  setSelectedRestaurant: (restaurant) => set({ selectedRestaurant: restaurant }),
  addRecentSearch: (name) => set((state) => {
    const updated = [name, ...state.recentSearches.filter(s => s !== name)].slice(0, 5);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return { recentSearches: updated };
  }),
  removeRecentSearch: (name) => set((state) => {
    const updated = state.recentSearches.filter(s => s !== name);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return { recentSearches: updated };
  }),
  clearRecentSearches: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ recentSearches: [] });
  },
  // 이미지 1 기반 추천 리스트 데이터
  recommendations: [
    { id: '1', name: '맛있는 마라탕 본점', category: '중식', distance: '0.8km', status: '매우 우수', lastInspection: '2024.05.15' },
    { id: '2', name: '치즈폭탄 피자클럽', category: '양식', distance: '1.2km', status: '우수', lastInspection: '2024.03.10' },
    { id: '3', name: '육즙가득 수제버거', category: '패스트푸드', distance: '2.5km', status: '정보 없음' },
    { id: '4', name: '할머니 보쌈&족발', category: '한식', distance: '0.5km', status: '매우 우수', lastInspection: '2024.05.01' },
    { id: '5', name: '불량 떡볶이 동대문점', category: '분식', distance: '1.0km', status: '적발', lastInspection: '2023.12.20', violations: ['위생 취급 기준 위반', '유통기한 경과 보관'] },
  ],
}));
