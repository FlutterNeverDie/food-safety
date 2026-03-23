import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Bell } from 'lucide-react';
import { useSearchStore } from '../store/useSearchStore';

export const IntroPage: React.FC = () => {
    const navigate = useNavigate();
    const { clearRecentSearches, setKeyword, setSelectedCity, setSelectedDistrict } = useSearchStore();

    const handleStart = () => {
        // 검색 기록 초기화 (로컬 스토리지)
        clearRecentSearches();
        // 현재 텍스트 필드의 키워드 및 선택 지역 초기화
        setKeyword('');
        setSelectedCity('');
        setSelectedDistrict('');
        navigate('/search');
    };

    const APP_ICON_URL = 'https://static.toss.im/appsintoss/16823/76818715-d10a-47ac-9b72-d7b499147400.png';

    return (
        <div className="app-container bg-white flex flex-col justify-between overflow-hidden">
            {/* 상단 장식 요소 */}
            <div className="relative pt-20 px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-4"
                >
                    <div className="inline-flex items-center px-4 py-1.5 bg-[#E8F3FF] text-[#3182F6] rounded-full text-[13px] font-bold">
                        우리 가족을 위한 서비스
                    </div>
                    <h1 className="text-[32px] font-bold leading-tight text-[#191F28]">
                        알고 먹자<br />
                        <span className="text-[#3182F6]">여기 위생 어때요?</span>
                    </h1>
                    <p className="text-[17px] text-[#4E5968] font-medium leading-relaxed">
                        배달 앱에서 보던 그 식당,<br />
                        진짜 위생적인지 지금 바로 확인하세요.
                    </p>
                </motion.div>
            </div>

            {/* 중앙 아이콘/일러스트 영역 */}
            <div className="flex-1 flex items-center justify-center relative">
                <div className="relative w-64 h-64">
                    {/* 배경 원 애니메이션 */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                        className="absolute inset-0 bg-[#3182F6]/5 rounded-full"
                    />

                    {/* 메인 아이콘 */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="w-32 h-32 bg-white rounded-[40px] shadow-2xl shadow-blue-200 flex items-center justify-center overflow-hidden p-4">
                            <img src={APP_ICON_URL} alt="Logo" className="w-full h-full object-contain" />
                        </div>
                    </motion.div>

                    {/* 플로팅 요소들 */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center"
                    >
                        <Search className="w-8 h-8 text-[#FFBB00]" />
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                        className="absolute -bottom-2 -left-6 w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center"
                    >
                        <Bell className="w-7 h-7 text-[#F04452]" />
                    </motion.div>
                </div>
            </div>

            {/* 하단 버튼 영역 */}
            <div className="p-8 pb-12 space-y-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <button
                        onClick={handleStart}
                        className="w-full py-5 bg-[#3182F6] text-white rounded-[24px] font-bold text-[18px] active:scale-[0.98] transition-all shadow-xl shadow-blue-100"
                    >
                        시작하기
                    </button>
                    <p className="text-center text-[13px] text-[#8B95A1] mt-6 leading-relaxed">
                        별도의 가입 없이 식품안전나라의<br />
                        공공 데이터를 실시간으로 조회합니다.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
