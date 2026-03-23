import { create } from 'zustand';

const API_KEY = 'd2ca129c719a43bca51a';

export interface FoodSafetyRow {
  PRCSCITYPOINT_BSSHNM: string; // 업소명
  ADDR: string; // 소재지도로명주소
  INDUTY_CD_NM: string; // 업종명
  DSPS_DCSNDT: string; // 처분결정일자
  DSPS_TYPECD_NM: string; // 처분명칭
  DSPSCN: string; // 처분내용
  VILTCN: string; // 위반내용
  LCNS_NO: string; // 인허가번호
  LAST_UPDT_DTM: string; // 최종수정일시
}

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  address: string;
  status: '매우 우수' | '우수' | '정보 없음' | '적발';
  lastInspection?: string;
  violations?: string[];
  raw?: FoodSafetyRow[]; // 이력 전체 저장용
}



interface SearchStore {
  keyword: string;
  setKeyword: (keyword: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  searchResults: Restaurant[];
  isSearching: boolean;
  searchRestaurants: () => Promise<void>;
  recentSearches: string[];
  addRecentSearch: (name: string) => void;
  removeRecentSearch: (name: string) => void;
  clearRecentSearches: () => void;
}

const STORAGE_KEY = 'toss-delivery-recent-searches';

export const useSearchStore = create<SearchStore>((set, get) => ({
  keyword: '',
  recentSearches: JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'),
  setKeyword: (keyword) => set({ keyword }),
  selectedCity: '',
  setSelectedCity: (city) => set({ selectedCity: city, selectedDistrict: '' }),
  selectedDistrict: '',
  setSelectedDistrict: (district) => set({ selectedDistrict: district }),
  selectedRestaurant: null,
  setSelectedRestaurant: (restaurant) => set({ selectedRestaurant: restaurant }),
  searchResults: [],
  isSearching: false,
  searchRestaurants: async () => {
    const { selectedCity, selectedDistrict } = get();
    if (!selectedDistrict) {
      set({ searchResults: [] });
      return;
    }



    set({ isSearching: true });
    try {
      // 롤백: 1000개로 다시 조정 및 https 유지
      const fetchUrl = `https://openapi.foodsafetykorea.go.kr/api/${API_KEY}/I2630/json/1/1000`;
      

      const response = await fetch(fetchUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.I2630?.row) {
        let rows: FoodSafetyRow[] = data.I2630.row;

        // 롤백: 이전 주소 필터링 로직
        if (selectedCity || selectedDistrict) {
          rows = rows.filter(row => {
            if (!row.ADDR) return false;
            const matchCity = selectedCity ? row.ADDR.includes(selectedCity) : true;
            const matchDistrict = selectedDistrict ? row.ADDR.includes(selectedDistrict) : true;
            return matchCity && matchDistrict;
          });
        }

        const grouped = rows.reduce((acc: Record<string, FoodSafetyRow[]>, char) => {
          const name = char.PRCSCITYPOINT_BSSHNM;
          if (!acc[name]) acc[name] = [];
          acc[name].push(char);
          return acc;
        }, {});

        const results: Restaurant[] = Object.entries(grouped).map(([name, history], index) => {
          const lastHistory = history[0];
          return {
            id: `api-${index}`,
            name: name,
            category: lastHistory.INDUTY_CD_NM,
            address: lastHistory.ADDR,
            status: '적발',
            lastInspection: lastHistory.DSPS_DCSNDT,
            violations: history.map(h => `${h.DSPS_TYPECD_NM}: ${h.VILTCN}`),
            raw: history
          };
        });

        set({ searchResults: results });
      } else {
        set({ searchResults: [] });
      }
    } catch (error: any) {
      console.error('API Fetch Error:', error);
      set({ searchResults: [] });
    } finally {
      set({ isSearching: false });
    }
  },
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
}));
