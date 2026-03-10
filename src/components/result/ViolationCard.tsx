import React from 'react';
import { Text } from '@toss/tds-mobile';
import { Calendar } from 'lucide-react';
import type { FoodSafetyRow } from '../../store/useSearchStore';

interface Props {
    row: FoodSafetyRow;
    formatDate: (dateStr?: string) => string;
}

export const ViolationCard: React.FC<Props> = ({ row, formatDate }) => {
    const violationDate = row.VILTCN.match(/\d{8}/)?.[0];

    return (
        <div className="bg-white border border-[#F2F4F6] rounded-[24px] p-7 space-y-7 shadow-sm transition-all active:bg-[#F9FAFB]">
            {/* 1. 처분명 및 날짜 */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <Text className="text-[20px] font-bold text-[#191F28]">{row.DSPS_TYPECD_NM}</Text>
                    <div className="flex items-center gap-1 text-[#B0B8C1]">
                        <Calendar className="w-3.5 h-3.5" />
                        <Text className="text-[13px] font-medium">{formatDate(row.DSPS_DCSNDT)} 처분</Text>
                    </div>
                </div>
                {violationDate && (
                    <Text className="text-[13px] font-medium text-[#8B95A1]">
                        {formatDate(violationDate)} 적발된 기록입니다
                    </Text>
                )}
            </div>
            
            {/* 2. 상세 정보 영역 (깔끔한 리스트 스타일) */}
            <div className="space-y-6 pt-1">
                <div className="space-y-2.5">
                    <Text className="text-[13px] font-bold text-[#B0B8C1] uppercase tracking-tight">상세 위반 내용</Text>
                    <div className="px-1">
                        <Text className="text-[16px] text-[#4E5968] font-bold leading-[1.6] break-keep">
                            {row.VILTCN.replace(/^\(\d{8}\)/, '').trim()}
                        </Text>
                    </div>
                </div>

                <div className="h-[1px] bg-[#F2F4F6]" />

                <div className="space-y-2.5">
                    <Text className="text-[13px] font-bold text-[#B0B8C1] uppercase tracking-tight">최종 처분 결과</Text>
                    <div className="px-1 text-[#3182F6]">
                        <Text className="text-[18px] font-extrabold leading-tight">{row.DSPSCN}</Text>
                    </div>
                </div>
            </div>
        </div>
    );
};
