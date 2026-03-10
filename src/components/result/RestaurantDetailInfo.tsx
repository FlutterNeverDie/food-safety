import React from 'react';
import { Text } from '@toss/tds-mobile';
import { Info, MapPin } from 'lucide-react';
import type { Restaurant } from '../../store/useSearchStore';

interface Props {
    restaurant: Restaurant;
}

export const RestaurantDetailInfo: React.FC<Props> = ({ restaurant }) => {
    return (
        <section className="space-y-4">
            <Text className="text-[14px] font-bold text-[#8B95A1] px-1 uppercase tracking-wider">매장 상세 정보</Text>
            <div className="bg-white rounded-[24px] overflow-hidden border border-[#F2F4F6]">
                <div className="px-6 py-5 flex items-center justify-between border-b border-[#F2F4F6]">
                    <div className="flex items-center gap-2.5">
                        <Info className="w-4 h-4 text-[#B0B8C1]" />
                        <Text className="text-[15px] font-medium text-[#4E5968]">업종</Text>
                    </div>
                    <Text className="text-[16px] font-bold text-[#191F28]">{restaurant.category}</Text>
                </div>
                <div className="px-6 py-5 space-y-2.5">
                    <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-[#B0B8C1]" />
                        <Text className="text-[15px] font-medium text-[#4E5968]">소재지</Text>
                    </div>
                    <Text className="text-[16px] font-bold text-[#191F28] leading-[1.6] break-keep">{restaurant.address}</Text>
                </div>
            </div>
        </section>
    );
};
