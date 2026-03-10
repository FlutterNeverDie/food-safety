/**
 * YYYYMMDD 형식의 날짜 문자열을 YYYY년 M월 D일 형식으로 변환합니다.
 */
export const formatDate = (dateStr?: string) => {
    if (!dateStr || dateStr.length !== 8) return dateStr || '정보 없음';
    return `${dateStr.substring(0, 4)}년 ${parseInt(dateStr.substring(4, 6))}월 ${parseInt(dateStr.substring(6, 8))}일`;
};
