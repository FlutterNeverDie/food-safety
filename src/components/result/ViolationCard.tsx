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
        <div className="group relative bg-white border border-[#F2F4F6] rounded-[32px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] active:scale-[0.985] transition-all duration-300">
            {/* 상단 장식적인 인디케이터 */}
            <div className="absolute top-0 left-12 w-12 h-1 bg-[#F04452] rounded-b-full opacity-80" />

            <div className="space-y-10">
                {/* 메인 헤더: 중복된 처분명 제거 및 날짜 정보만 표시 */}
                <div className="px-0.5">
                    <div className="flex items-center gap-2 text-[#8B95A1]">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F9FAFB] rounded-xl border border-[#F2F4F6]">
                            <Calendar className="w-4 h-4 text-[#B0B8C1]" />
                            <Text className="text-[14px] font-bold">{formatDate(row.DSPS_DCSNDT)} 처분 확정</Text>
                        </div>
                    </div>
                </div>

                {/* 타임라인 기반 리스트 */}
                <div className="relative space-y-9">
                    {/* 수직 타임라인 연결 점선 */}
                    <div className="absolute left-[19px] top-10 bottom-10 w-[1.5px] bg-dashed-line opacity-20 bg-gradient-to-b from-[#F2F4F6] via-[#D1D8E0] to-[#F2F4F6]" />

                    {/* 1. 적발 시점 */}
                    {violationDate && (
                        <div className="relative flex items-start gap-5 group/item">
                            <div className="w-10 h-10 bg-white border-2 border-[#F9FAFB] rounded-[14px] flex items-center justify-center shrink-0 shadow-sm z-10 transition-transform group-hover/item:scale-110">
                                <History className="w-5 h-5 text-[#8B95A1]" />
                            </div>
                            <div className="flex flex-col gap-1.5 pt-0.5">
                                <Text className="text-[12px] font-bold text-[#B0B8C1] block uppercase tracking-tight">적발 시점</Text>
                                <Text className="text-[17px] font-bold text-[#4E5968] block">{formatDate(violationDate)} 적발</Text>
                            </div>
                        </div>
                    )}

                    {/* 2. 위반 내용 */}
                    <div className="relative flex items-start gap-5 group/item">
                        <div className="w-10 h-10 bg-white border-2 border-[#F9FAFB] rounded-[14px] flex items-center justify-center shrink-0 shadow-sm z-10 transition-transform group-hover/item:scale-110">
                            <FileText className="w-5 h-5 text-[#8B95A1]" />
                        </div>
                        <div className="flex flex-col gap-1.5 pt-0.5 flex-1 max-w-[calc(100%-60px)]">
                            <Text className="text-[12px] font-bold text-[#B0B8C1] block uppercase tracking-tight">위반 항목</Text>
                            <div className="bg-[#F9FAFB]/50 p-4 rounded-2xl border border-[#F2F4F6] mt-1">
                                <Text className="text-[16px] font-bold text-[#333D4B] block leading-relaxed break-keep">
                                    {row.VILTCN.replace(/^\(\d{8}\)/, '').trim()}
                                </Text>
                            </div>
                        </div>
                    </div>

                    {/* 3. 최종 처분 */}
                    <div className="relative flex items-start gap-5 group/item">
                        <div className="w-10 h-10 bg-[#FFF0F0] rounded-[14px] flex items-center justify-center shrink-0 shadow-lg shadow-red-50 z-10 transition-transform group-hover/item:scale-110 border border-[#FFE0E0]">
                            <Gavel className="w-5 h-5 text-[#F04452]" />
                        </div>
                        <div className="flex flex-col gap-1.5 pt-0.5 flex-1 p-0.5">
                            <Text className="text-[12px] font-bold text-[#F04452] block uppercase tracking-tight">처분 결과</Text>
                            <div className="mt-1">
                                <Text className="text-[19px] font-semibold text-[#F04452] block leading-tight">
                                    {row.DSPSCN}
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
