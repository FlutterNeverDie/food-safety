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
        <div className="bg-white border border-[#F2F4F6] rounded-[32px] p-8 space-y-7 shadow-[0_8px_20px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col gap-5 pb-5 border-b border-[#F2F4F6]">
                <div className="flex items-center justify-between">
                    <div className="px-3.5 py-1.5 bg-[#FFF0F0] text-[#F04452] rounded-xl text-[13px] font-bold tracking-tight">
                        {row.DSPS_TYPECD_NM}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <Text className="text-[11px] font-bold text-[#B0B8C1] uppercase tracking-wider text-right">처분 확정일</Text>
                        <div className="flex items-center gap-1.5 text-[#8B95A1]">
                            <Calendar className="w-3.5 h-3.5" />
                            <Text className="text-[14px] font-bold">{formatDate(row.DSPS_DCSNDT)}</Text>
                        </div>
                    </div>
                </div>
                
                {/* 적발일 정보 별도 표시 */}
                {row.VILTCN.match(/^\(\d{8}\)/) && (
                    <div className="flex items-center gap-2 px-1">
                        <span className="text-[12px] font-bold text-[#4E5968] bg-[#F2F4F6] px-2.5 py-1 rounded-lg">적발 시점</span>
                        <Text className="text-[14px] font-medium text-[#4E5968]">
                            {formatDate(violationDate)}
                        </Text>
                    </div>
                )}
            </div>
            
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#F04452] rounded-full" />
                    <Text className="text-[15px] font-bold text-[#8B95A1]">위반 내용</Text>
                </div>
                <div className="bg-[#F9FAFB] p-6 rounded-[24px] border border-[#F2F4F6]/50">
                    <Text className="text-[16px] text-[#4E5968] leading-relaxed font-semibold break-keep">
                        {row.VILTCN.replace(/^\(\d{8}\)/, '').trim()}
                    </Text>
                </div>
            </div>

            <div className="space-y-4 pt-1">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#3182F6] rounded-full" />
                    <Text className="text-[15px] font-bold text-[#8B95A1]">처분 결과</Text>
                </div>
                <div className="px-1">
                    <Text className="text-[18px] text-[#191F28] font-bold leading-relaxed">{row.DSPSCN}</Text>
                </div>
            </div>
        </div>
    );
};
