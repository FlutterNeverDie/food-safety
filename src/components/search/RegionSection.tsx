import React from 'react';
import { Text } from '@toss/tds-mobile';
import { MapPin, ChevronDown, CheckCircle2 } from 'lucide-react';

interface Props {
    selectedCity: string;
    selectedDistrict: string;
    onOpenPicker: () => void;
}

export const RegionSection: React.FC<Props> = ({ selectedCity, selectedDistrict, onOpenPicker }) => {
    return (
        <div className="animate-fade-in-up [animation-delay:50ms]">
            <button
                onClick={onOpenPicker}
                className={`w-full flex items-center justify-between px-6 py-5 bg-white border rounded-[24px] shadow-sm active:scale-[0.98] transition-all ${selectedCity && selectedDistrict ? 'border-[#E5E8EB]' : 'border-[#3182F6] ring-4 ring-[#3182F6]/5'}`}
            >
                <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${selectedCity ? 'bg-[#E8F3FF]' : 'bg-[#3182F6]/10'}`}>
                        <MapPin className={`w-5.5 h-5.5 ${selectedCity ? 'text-[#3182F6]' : 'text-[#3182F6]'}`} />
                    </div>
                    <div className="text-left">
                        <Text className={`text-[17px] font-semibold ${selectedCity ? 'text-[#191F28]' : 'text-[#3182F6]'}`}>
                            {selectedCity && selectedDistrict ? `${selectedCity} ${selectedDistrict}` : '어느 지역의 식당인가요?'}
                        </Text>
                    </div>
                </div>
                <ChevronDown className="w-5 h-5 text-[#B0B8C1]" />
            </button>
            {!selectedDistrict && (
                <p className="mt-3 ml-4 text-[13px] font-semibold text-[#3182F6] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 검색 전 지역을 먼저 골라주세요
                </p>
            )}
        </div>
    );
};
