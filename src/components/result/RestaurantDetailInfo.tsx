import React from 'react';
import { Text } from '@toss/tds-mobile';
import { Info, MapPin } from 'lucide-react';
import type { Restaurant } from '../../store/useSearchStore';

interface Props {
    restaurant: Restaurant;
}

export const RestaurantDetailInfo: React.FC<Props> = ({ restaurant }) => {
    return (
        <section className="bg-white rounded-[28px] p-8 border border-[#F2F4F6] space-y-7 shadow-sm">
            <Text className="text-[17px] font-bold text-[#191F28] px-1">매장 상세 정보</Text>
            <div className="space-y-8 pt-2">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#F9FAFB] rounded-2xl text-[#8B95A1] shrink-0 border border-[#F2F4F6]">
                        <Info className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5 flex-1 overflow-hidden">
                        <Text className="text-[13px] font-bold text-[#8B95A1] block">업종</Text>
                        <Text className="text-[17px] font-bold text-[#191F28] break-all">{restaurant.category}</Text>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#F9FAFB] rounded-2xl text-[#8B95A1] shrink-0 border border-[#F2F4F6]">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                        <Text className="text-[13px] font-bold text-[#8B95A1] block">소재지</Text>
                        <Text className="text-[16px] font-bold text-[#4E5968] leading-[1.6] break-keep">{restaurant.address}</Text>
                    </div>
                </div>
            </div>
        </section>
    );
};
