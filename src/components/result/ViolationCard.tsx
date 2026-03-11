import React from 'react';
import { Text } from '@toss/tds-mobile';
import { Calendar, FileText, Gavel, History } from 'lucide-react';
import type { FoodSafetyRow } from '../../store/useSearchStore';

interface Props {
    row: FoodSafetyRow;
    formatDate: (dateStr?: string) => string;
}

export const ViolationCard: React.FC<Props> = ({ row, formatDate }) => {
    const violationDate = row.VILTCN.match(/\d{8}/)?.[0];

    return (
        <div className="bg-white border border-[#F2F4F6] rounded-[28px] p-7 space-y-8 shadow-sm">
            {/* 메인 헤더: 처분명 강조 */}
            <div className="space-y-2 px-1">
                <Text className="text-[22px] font-bold text-[#191F28] block tracking-tight">
                    {row.DSPS_TYPECD_NM}
                </Text>
                <div className="flex items-center gap-1.5 text-[#B0B8C1]">
                    <Calendar className="w-4 h-4" />
                    <Text className="text-[14px] font-medium">{formatDate(row.DSPS_DCSNDT)} 처분 확정</Text>
                </div>
            </div>

            {/* 정보 리스트 (Toss Detail Style) */}
            <div className="space-y-7 pt-2">
                {/* 1. 위반 일자 */}
                {violationDate && (
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-[#F9FAFB] rounded-full flex items-center justify-center shrink-0 border border-[#F2F4F6]">
                            <History className="w-5 h-5 text-[#8B95A1]" />
                        </div>
                        <div className="flex flex-col gap-1 pt-0.5">
                            <Text className="text-[13px] font-bold text-[#B0B8C1] block uppercase tracking-tight">적발 시점</Text>
                            <Text className="text-[16px] font-bold text-[#4E5968] block">{formatDate(violationDate)}</Text>
                        </div>
                    </div>
                )}

                {/* 2. 위반 내용 */}
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#F9FAFB] rounded-full flex items-center justify-center shrink-0 border border-[#F2F4F6]">
                        <FileText className="w-5 h-5 text-[#8B95A1]" />
                    </div>
                    <div className="flex flex-col gap-1 pt-0.5 flex-1 p-0.5">
                        <Text className="text-[13px] font-bold text-[#B0B8C1] block uppercase tracking-tight">상세 위반 내용</Text>
                        <Text className="text-[16px] font-bold text-[#333D4B] block leading-relaxed break-keep">
                            {row.VILTCN.replace(/^\(\d{8}\)/, '').trim()}
                        </Text>
                    </div>
                </div>

                {/* 3. 최종 처분 */}
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#F2F3FF] rounded-full flex items-center justify-center shrink-0 border border-[#E8F3FF]">
                        <Gavel className="w-5 h-5 text-[#3182F6]" />
                    </div>
                    <div className="flex flex-col gap-1.5 pt-0.5 flex-1 p-0.5">
                        <Text className="text-[13px] font-bold text-[#3182F6] block uppercase tracking-tight">상세 처분 결과</Text>
                        <Text className="text-[18px] font-extrabold text-[#191F28] block leading-tight">
                            {row.DSPSCN}
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
};
