import React from 'react';
import { Text } from '@toss/tds-mobile';
import { ShieldCheck } from 'lucide-react';
import { ViolationCard } from './ViolationCard';
import { formatDate } from '../../utils/format';
import type { FoodSafetyRow } from '../../store/useSearchStore';

interface Props {
    records: FoodSafetyRow[] | undefined;
}

export const ViolationSection: React.FC<Props> = ({ records }) => {
    return (
        <section className="space-y-2">
            <div className="flex flex-col gap-1 px-1">
                <h1 className="!text-[20px] !font-bold !text-[#191F28] !tracking-tight !leading-[1.4] break-keep font-['Pretendard_Variable']">
                    위반 적발 상세 내역
                </h1>
            </div>

            <div className="space-y-4">
                {records && records.length > 0 ? (
                    records.map((row, idx) => (
                        <ViolationCard key={idx} row={row} formatDate={formatDate} />
                    ))
                ) : (
                    <div className="py-24 bg-white rounded-[24px] border border-[#F2F4F6] flex flex-col items-center justify-center space-y-4">
                        <div className="w-12 h-12 bg-[#F9FAFB] rounded-full flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 text-[#B0B8C1]" />
                        </div>
                        <Text className="text-[#B0B8C1] font-bold text-[16px]">깨끗한 매장입니다</Text>
                    </div>
                )}
            </div>
        </section>
    );
};
