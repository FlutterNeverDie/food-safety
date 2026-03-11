import React from 'react';
import { Text } from '@toss/tds-mobile';
import { AlertCircle } from 'lucide-react';

export const SearchHeader: React.FC = () => {
    return (
        <div className="px-6 pt-16 pb-10 flex flex-col items-center text-center space-y-4 animate-fade-in-up">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF0F0] rounded-full shadow-sm">
                <AlertCircle className="w-3.5 h-3.5 text-[#F04452]" />
                <Text className="text-[12px] font-bold text-[#F04452]">식약처 위생 적발 이력 데이터</Text>
            </div>
            <Text className="text-[28px] font-semibold leading-[1.3] text-[#191F28] tracking-tight font-['Pretendard_Variable']">
                어떤 식당의 위생이<br />궁금하신가요?
            </Text>
            <Text className="text-[14px] text-[#8B95A1] font-medium">
                과거에 단속된 적이 있는 식당만 검색됩니다.
            </Text>
        </div>
    );
};
