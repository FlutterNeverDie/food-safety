import React from 'react';
import { Text } from '@toss/tds-mobile';
import { AlertCircle } from 'lucide-react';

export const SearchHeader: React.FC = () => {
    return (
        <div className="px-7 pt-20 pb-12 flex flex-col items-start text-left space-y-6 animate-fade-in-up">
            {/* 이미지 기반 리뉴얼 배지 */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white rounded-[20px] border border-[#F2F4F6] shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                <div className="w-6 h-6 bg-[#F04452] rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(240,68,82,0.2)]">
                    <AlertCircle className="w-3.5 h-3.5 text-white" />
                </div>
                <Text className="text-[14px] font-semibold text-[#4E5968] tracking-tight">공공데이터 기반 위생 적발 이력</Text>
            </div>

            <div className="space-y-4">
                <h1 className="text-[32px] font-semibold leading-[1.2] text-[#191F28] tracking-[-0.05em] font-['Pretendard_Variable']">
                    지금 가려는 식당,<br />
                    <span className="text-[#3182F6]">위생은 안전한가요?</span>
                </h1>
                <p className="text-[15px] text-[#8B95A1] font-medium leading-relaxed tracking-tight opacity-90">
                    식품의약품안전처 데이터를 바탕으로<br />
                    과거 단속 이력을 실시간으로 확인해 드립니다.
                </p>
            </div>
        </div>
    );
};
