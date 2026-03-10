import React from 'react';
import { Text } from '@toss/tds-mobile';

interface Props {
    name: string;
}

export const RestaurantNameSection: React.FC<Props> = ({ name }) => {
    return (
        <div className="space-y-3 px-1 pt-4">
            <Text className="text-[40px] font-bold text-[#191F28] leading-[1.1] tracking-tighter break-all">
                {name}
            </Text>
            <Text className="text-[17px] font-medium text-[#8B95A1] leading-relaxed">
                식약처 단속 데이터에 의해 행정처분 이력이<br />확인된 매장입니다.
            </Text>
        </div>
    );
};
