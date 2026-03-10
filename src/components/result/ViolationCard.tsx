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
        <div className="group relative bg-white border border-[#F2F4F6] rounded-[36px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] active:scale-[0.98] transition-all duration-200">
            {/* 상단 강조 배너 (처분 결과) */}
            <div className="bg-gradient-to-r from-[#FFF0F0] to-white px-8 py-5 flex items-center justify-between border-b border-[#F2F4F6]/50">
                <div className="flex flex-col gap-1">
                    <Text className="text-[12px] font-extrabold text-[#F04452] uppercase tracking-[0.05em]">행정처분 결과</Text>
                    <Text className="text-[20px] font-extrabold text-[#191F28]">{row.DSPS_TYPECD_NM}</Text>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/60 backdrop-blur-sm rounded-lg border border-[#F2F4F6] text-[#8B95A1]">
                        <Calendar className="w-3.5 h-3.5" />
                        <Text className="text-[13px] font-bold">{formatDate(row.DSPS_DCSNDT)}</Text>
                    </div>
                </div>
            </div>
            
            <div className="p-8 space-y-9">
                {/* 타임라인 스타일의 적발 정보 */}
                <div className="relative pl-6 space-y-8">
                    {/* 상하 연결 선 */}
                    <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-gradient-to-b from-[#F04452] via-[#F2F4F6] to-[#3182F6] rounded-full" />
                    
                    {/* 1. 위반 내용 섹션 */}
                    <div className="relative space-y-4">
                        <div className="absolute -left-[30px] top-1 w-3 h-3 bg-white border-2 border-[#F04452] rounded-full shadow-[0_0_0_4px_#FFF0F0]" />
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <Text className="text-[15px] font-bold text-[#8B95A1]">위반 내용</Text>
                                {violationDate && (
                                    <span className="text-[11px] font-bold text-[#B0B8C1] border border-[#F2F4F6] px-1.5 py-0.5 rounded-md">
                                        {formatDate(violationDate)} 적발
                                    </span>
                                )}
                            </div>
                            <div className="bg-[#F9FAFB] p-6 rounded-[24px] border border-[#F2F4F6]">
                                <Text className="text-[17px] text-[#333D4B] leading-relaxed font-bold break-keep">
                                    {row.VILTCN.replace(/^\(\d{8}\)/, '').trim()}
                                </Text>
                            </div>
                        </div>
                    </div>

                    {/* 2. 처분 결과 섹션 */}
                    <div className="relative space-y-4">
                        <div className="absolute -left-[30px] top-1 w-3 h-3 bg-white border-2 border-[#3182F6] rounded-full shadow-[0_0_0_4px_#E8F3FF]" />
                        <div className="flex flex-col gap-3">
                            <Text className="text-[15px] font-bold text-[#8B95A1]">상세 처분</Text>
                            <div className="px-1">
                                <Text className="text-[20px] text-[#191F28] font-extrabold leading-tight">{row.DSPSCN}</Text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
