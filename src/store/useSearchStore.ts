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

export const MOCK_GANGNAM_DATA: Restaurant[] = [
  {
    id: 'mock-1',
    name: '힙마라 강남본점',
    category: '일반음식점',
    address: '서울특별시 강남구 테헤란로 999999 (역삼동, 1층)',
    status: '적발',
    lastInspection: '20251120',
    violations: ['영업정지 15일: 식품의 위생적 취급기준 위반(조리장 위생불량)'],
    raw: [{ PRCSCITYPOINT_BSSHNM: '힙마라 강남본점', ADDR: '서울특별시 강남구 테헤란로 123 (역삼동, 1층)', INDUTY_CD_NM: '일반음식점', DSPS_DCSNDT: '20251120', DSPS_TYPECD_NM: '영업정지 15일', DSPSCN: '영업정지 15일 (2025.11.25~2025.12.09)', VILTCN: '식품의 위생적 취급기준 위반(조리장 위생불량)', LCNS_NO: '201900001', LAST_UPDT_DTM: '2025-11-21' }]
  },
  {
    id: 'mock-2',
    name: '그릭바이브 청담점',
    category: '휴게음식점',
    address: '서울특별시 강남구 도산대로 456 (청담동)',
    status: '적발',
    lastInspection: '20251015',
    violations: ['과태료 처분: 건강진단 미실시(종업원 2명)'],
    raw: [
      { PRCSCITYPOINT_BSSHNM: '그릭바이브 청담점', ADDR: '서울특별시 강남구 도산대로 456 (청담동)', INDUTY_CD_NM: '휴게음식점', DSPS_DCSNDT: '20251015', DSPS_TYPECD_NM: '과태료 처분', DSPSCN: '과태료 50만원', VILTCN: '건강진단 미실시(종업원 2명)', LCNS_NO: '202100002', LAST_UPDT_DTM: '2025-10-16' },
      { PRCSCITYPOINT_BSSHNM: '그릭바이브 청담점', ADDR: '서울특별시 강남구 도산대로 456 (청담동)', INDUTY_CD_NM: '휴게음식점', DSPS_DCSNDT: '20240510', DSPS_TYPECD_NM: '시정명령', DSPSCN: '시정명령', VILTCN: '영업장 면적 무단 변경', LCNS_NO: '202100002', LAST_UPDT_DTM: '2024-05-11' }
    ]
  },
  {
    id: 'mock-3',
    name: '수제버거팩토리 신사점',
    category: '일반음식점',
    address: '서울특별시 강남구 강남대로 152길 11 (신사동)',
    status: '적발',
    lastInspection: '20250810',
    violations: ['시정명령: 유통기한 경과제품 보관(치즈 등 2종)'],
    raw: [{ PRCSCITYPOINT_BSSHNM: '수제버거팩토리 신사점', ADDR: '서울특별시 강남구 강남대로 152길 11 (신사동)', INDUTY_CD_NM: '일반음식점', DSPS_DCSNDT: '20250810', DSPS_TYPECD_NM: '시정명령', DSPSCN: '시정명령', VILTCN: '유통기한 경과제품 보관(치즈 등 2종)', LCNS_NO: '202300003', LAST_UPDT_DTM: '2025-08-11' }]
  }
];

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

    // [Mock 분기점] 배너 캡쳐를 위해 강남구 지정 시 즉시 목업 데이터 반환
    if (selectedDistrict === '강남구' || selectedCity === '강남구') {
      set({ isSearching: true });
      setTimeout(() => {
        set({ searchResults: MOCK_GANGNAM_DATA, isSearching: false });
      }, 300); // 자연스런 로딩 연출용 딜레이
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
