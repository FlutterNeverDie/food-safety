import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';


export const ResultHeader: React.FC = () => {
    const navigate = useNavigate();
    
    return (
        <header className="px-6 py-4 flex items-center bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-[#F2F4F6]">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-[#8B95A1] active:scale-95 transition-transform">
                <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="flex-1 text-center font-bold text-[16px] text-[#191F28] mr-8">위생 적발 상세 내역</span>
        </header>
    );
};
