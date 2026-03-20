import React from 'react';

import { Calendar, AlertCircle, ShieldAlert, History } from 'lucide-react';
import type { FoodSafetyRow } from '../../store/useSearchStore';

interface Props {
    row: FoodSafetyRow;
    formatDate: (dateStr?: string) => string;
}

export const ViolationCard: React.FC<Props> = ({ row, formatDate }) => {
    const violationDate = row.VILTCN.match(/\d{8}/)?.[0];

    return (
        <div className="group relative bg-white border border-[#F2F4F6] rounded-[30px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] active:scale-[0.985] transition-transform duration-300">
            {/* 메인 부분 컨테이너 */}
            <div className="space-y-6 pl-1">
                {/* 헤더: 확정 날짜 뱃지 */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F9FAFB] rounded-xl border border-[#F2F4F6] w-fit">
                    <Calendar className="w-4 h-4 text-[#8B95A1]" />
                    <span className="!text-[14px] !font-bold !text-[#4E5968] tracking-tight">{formatDate(row.DSPS_DCSNDT)} 확정 처분록</span>
                </div>

                {/* 타임라인 레이아웃 */}
                <div className="relative space-y-7 ml-1 mt-6">
                    {/* 타임라인 뒷배경 선 (점선에서 깔끔한 실선으로 교체) */}
                    <div className="absolute left-[16px] top-4 bottom-4 w-[2px] bg-[#F2F4F6] rounded-full" />

                    {/* 1. 적발 시점 */}
                    {violationDate && (
                        <div className="relative flex items-start gap-5 group/item">
                            <div className="w-[34px] h-[34px] bg-white border-2 border-[#F2F4F6] rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm mt-0.5 group-hover/item:border-[#3182F6]/30 transition-colors">
                                <History className="w-[16px] h-[16px] text-[#8B95A1]" />
                            </div>
                            <div className="flex flex-col gap-1 pt-1.5 w-full">
                                <span className="!text-[13px] !font-bold !text-[#8B95A1] uppercase tracking-wide">적발 일자</span>
                                <span className="!text-[17px] !font-bold !text-[#333D4B] bg-[#F9FAFB] px-3 py-2 rounded-xl mt-1 w-fit border border-[#F2F4F6]/50 shadow-sm">{formatDate(violationDate)}</span>
                            </div>
                        </div>
                    )}

                    {/* 2. 위반 항목 (빨간색 라인/아이콘 제거하고 좀 더 간결한 톤 앤 매너로 변경) */}
                    <div className="relative flex items-start gap-5 group/item">
                        <div className="w-[34px] h-[34px] bg-[#FFF0F0] border-[2.5px] border-white rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm mt-0.5 group-hover/item:border-[#FFE0E0] transition-colors">
                            <AlertCircle className="w-[16px] h-[16px] text-[#F04452]" strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col gap-1 w-full pt-1.5">
                            <span className="!text-[13px] !font-bold !text-[#F04452] uppercase tracking-wide">위반 항목</span>
                            <div className="bg-[#FFF8F8] p-4 rounded-2xl border border-[#FFE0E0]/60 mt-1 shadow-sm">
                                <p className="!text-[16px] !font-semibold !text-[#191F28] !leading-[1.6] break-keep">
                                    {row.VILTCN.replace(/^\(\d{8}\)/, '').trim()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 3. 최종 처분결과 */}
                    <div className="relative flex items-start gap-5 group/item pb-1">
                        <div className="w-[34px] h-[34px] bg-[#F04452] border-[2.5px] border-white rounded-full flex items-center justify-center shrink-0 z-10 shadow-[0_4px_12px_rgba(240,68,82,0.25)] mt-0.5 group-hover/item:scale-110 transition-transform">
                            <ShieldAlert className="w-[16px] h-[16px] text-white" strokeWidth={2} />
                        </div>
                        <div className="flex flex-col gap-1.5 pt-1.5 w-full">
                            <span className="!text-[13px] !font-bold !text-[#F04452] uppercase tracking-wide">최종 처분 명칭</span>
                            <div className="mt-0.5">
                                <p className="!text-[22px] !font-bold !text-[#F04452] !leading-[1.3] break-keep tracking-[-0.02em]">
                                    {row.DSPSCN}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
