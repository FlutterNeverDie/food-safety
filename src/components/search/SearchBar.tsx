import React from 'react';
import { Search, Loader2, X } from 'lucide-react';

interface Props {
    keyword: string;
    setKeyword: (val: string) => void;
    isSearching: boolean;
    selectedDistrict: string;
    inputRef: React.RefObject<HTMLInputElement | null>;
}

export const SearchBar: React.FC<Props> = ({ keyword, setKeyword, isSearching, selectedDistrict, inputRef }) => {
    return (
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
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            inputRef.current?.blur();
                        }
                    }}
                    className="flex-1 bg-transparent text-[17px] font-semibold text-[#191F28] placeholder:text-[#B0B8C1] outline-none"
                />
                {keyword.length > 0 && (
                    <button onClick={() => setKeyword('')} className="p-1.5 bg-[#B0B8C1]/20 rounded-full text-[#8B95A1] ml-2">
                        <X className="w-3.5 h-3.5" />
                    </button> // X 버튼
                )}
                {isSearching && <Loader2 className="w-5 h-5 text-[#3182F6] animate-spin ml-2" />}
            </div>
        </div>
    );
};
