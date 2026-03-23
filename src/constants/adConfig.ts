/**
 * 토스 인앱 광고 2.0 실제 광고 ID 설정 파일
 * 
 * 토스 개발자 센터(https://developers.toss.im/)에서 발급받은 
 * 실제 광고 그룹 ID(adGroupId)를 아래 항목에 입력해주세요.
 */

export const AD_CONFIG = {
    // 1. 리워드 광고 (식당 클릭 시 상세 페이지 진입 전 노출)
    // REWARD_ID: 'ait-ad-test-rewarded-id', // 실제 ID로 교체하세요

    REWARD_ID: 'ait.v2.live.7569a189634c451d',

    // 전면 광고 (매장 상세 보기 전 노출)
    INTERSTITIAL_ID: 'ait.v2.live.df59f9d1ea3544eb',

    // 2. 배너 광고 - 문구 강조형 (검색 화면 최하단 고정 띠 배너)
    // BANNER_LIST_ID: 'ait-ad-test-banner-id', // 실제 ID로 교체하세요
    BANNER_LIST_ID: 'ait.v2.live.6d71e9b248db4d48',

    // 3. 배너 광고 - 이미지 강조형 (검색 리스트 사이 & 상세 화면 중단 카드)
    // BANNER_FEED_ID: 'ait-ad-test-native-image-id', // 실제 ID로 교체하세요
    BANNER_FEED_ID: 'ait.v2.live.d2c28016fd234c3f',
};
