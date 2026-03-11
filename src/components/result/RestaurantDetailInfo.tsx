import React from 'react';
import { Text } from '@toss/tds-mobile';
import { Info, MapPin } from 'lucide-react';
import type { Restaurant } from '../../store/useSearchStore';

interface Props {
    restaurant: Restaurant;
}

export const RestaurantDetailInfo: React.FC<Props> = ({ restaurant }) => {
    return (
        <section className="space-y-2">
            <div className="flex flex-col gap-1 px-1">
                <h1 className="!text-[20px] !font-bold !text-[#191F28] !tracking-tight !leading-[1.4] break-keep font-['Pretendard_Variable']">
                    매장 상세 정보
                </h1>
            </div>

            <div className="bg-white border border-[#F2F4F6] rounded-[32px] p-8 space-y-9 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                {/* 1. 업종 정보 */}
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#F9FAFB] rounded-[14px] flex items-center justify-center shrink-0 border border-[#F2F4F6]">
                        <Info className="w-5 h-5 text-[#8B95A1]" />
                    </div>
                    <div className="flex flex-col gap-1.5 pt-0.5">
                        <Text className="!text-[14px] !font-semibold !text-[#8B95A1] block tracking-tight">업종 분류</Text>
                        <Text className="!text-[18px] !font-semibold !text-[#333D4B] block mt-0.5">{restaurant.category}</Text>
                    </div>
                </div>

                {/* 2. 소재지 정보 */}
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#F9FAFB] rounded-[14px] flex items-center justify-center shrink-0 border border-[#F2F4F6]">
                        <MapPin className="w-5 h-5 text-[#8B95A1]" />
                    </div>
                    <div className="flex flex-col gap-1.5 pt-0.5 flex-1 p-0.5">
                        <Text className="!text-[14px] !font-semibold !text-[#8B95A1] block tracking-tight">소재지 주소</Text>
                        <Text className="!text-[18px] !font-medium !text-[#191F28] block !leading-[1.5] mt-0.5 break-keep">
                            {restaurant.address}
                        </Text>
                    </div>
                </div>
            </div>
        </section>
    );
};
