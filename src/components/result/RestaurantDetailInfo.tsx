import React from 'react';

import { Store, MapPin } from 'lucide-react';
import type { Restaurant } from '../../store/useSearchStore';

interface Props {
    restaurant: Restaurant;
}

export const RestaurantDetailInfo: React.FC<Props> = ({ restaurant }) => {
    return (
        <section className="space-y-3 mt-8">
            <div className="flex flex-col gap-1 px-1 mb-2">
                <h1 className="!text-[20px] !font-bold !text-[#191F28] !tracking-tight !leading-[1.4] break-keep font-['Pretendard_Variable']">
                    매장 상세 정보
                </h1>
            </div>

            <div className="bg-white border border-[#F2F4F6] rounded-[30px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-7">
                {/* 1. 업종 정보 */}
                <div className="flex items-start gap-5 group/item">
                    <div className="w-[34px] h-[34px] bg-white border-2 border-[#F2F4F6] rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm mt-0.5 group-hover/item:border-[#3182F6]/30 transition-colors">
                        <Store className="w-[16px] h-[16px] text-[#8B95A1]" />
                    </div>
                    <div className="flex flex-col gap-1 pt-1.5 w-full">
                        <span className="!text-[13px] !font-bold !text-[#8B95A1] uppercase tracking-wide">업종 분류</span>
                        <span className="!text-[17px] !font-bold !text-[#333D4B] bg-[#F9FAFB] px-3 py-2 rounded-xl mt-1 w-fit border border-[#F2F4F6]/50 shadow-sm">{restaurant.category}</span>
                    </div>
                </div>

                {/* 2. 소재지 정보 */}
                <div className="flex items-start gap-5 group/item">
                    <div className="w-[34px] h-[34px] bg-white border-2 border-[#F2F4F6] rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm mt-0.5 group-hover/item:border-[#3182F6]/30 transition-colors">
                        <MapPin className="w-[16px] h-[16px] text-[#8B95A1]" />
                    </div>
                    <div className="flex flex-col gap-1 pt-1.5 flex-1 p-0.5 w-full">
                        <span className="!text-[13px] !font-bold !text-[#8B95A1] uppercase tracking-wide">소재지 주소</span>
                        <div className="bg-[#F9FAFB] p-4 rounded-2xl border border-[#F2F4F6] mt-1 shadow-sm">
                            <p className="!text-[16px] !font-semibold !text-[#191F28] !leading-[1.6] break-keep">
                                {restaurant.address}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
