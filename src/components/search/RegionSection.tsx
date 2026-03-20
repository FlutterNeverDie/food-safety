import React from 'react';

import { MapPin, ChevronDown } from 'lucide-react';

interface Props {
    selectedCity: string;
    selectedDistrict: string;
    onOpenPicker: () => void;
}

export const RegionSection: React.FC<Props> = ({ selectedCity, selectedDistrict, onOpenPicker }) => {
    return (
        <div className="animate-fade-in-up [animation-delay:100ms]">
            <button
                onClick={onOpenPicker}
                className={`w-full group flex items-center gap-4 px-6 py-4 bg-white border border-[#F2F4F6] rounded-[28px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-all duration-300 ${!selectedDistrict ? 'ring-2 ring-[#3182F6]/5' : ''}`}
            >
                {/* 좌측 원형 아이콘 베이스 */}
                <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${selectedCity ? 'bg-[#E8F3FF]' : 'bg-[#F2F4F6]'}`}>
                    <MapPin className={`w-5.5 h-5.5 ${selectedCity ? 'text-[#3182F6]' : 'text-[#B0B8C1]'}`} />
                </div>

                {/* 중앙 지역명 */}
                <div className="flex-1 text-left">
                    <span className={`text-[17px] font-semibold tracking-tight ${selectedCity ? 'text-[#191F28]' : 'text-[#3182F6]'}`}>
                        {selectedCity && selectedDistrict ? `${selectedCity} ${selectedDistrict}` : '어느 지역의 식당인가요?'}
                    </span>
                </div>

                {/* 우측 화살표 */}
                <ChevronDown className="w-5 h-5 text-[#D1D6DB] group-hover:translate-y-0.5 transition-transform" />
            </button>

            {!selectedDistrict && (
                <div className="mt-4 px-5 py-2.5 bg-[#F2F4F6] rounded-2xl flex items-center gap-2 self-start ml-2 opacity-80">
                    <div className="w-1 h-1 bg-[#8B95A1] rounded-full" />
                    <span className="text-[13px] font-semibold text-[#8B95A1]">지역을 선택하면 검색이 시작됩니다</span>
                </div>
            )}
        </div>
    );
};
