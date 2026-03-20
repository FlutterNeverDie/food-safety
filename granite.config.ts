import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
    appName: 'clean-check', // 토스 개발자 센터에 등록할 앱 ID
    outdir: 'dist',                // 빌드 결과물이 저장되는 폴더
    brand: {
        displayName: '여기 위생 어때요?',
        primaryColor: '#3182F6',
        icon: 'https://static.toss.im/appsintoss/16823/76818715-d10a-47ac-9b72-d7b499147400.png',
    },
    web: {
        commands: {
            build: 'npm run build',
            dev: 'npm run dev',
        },
        port: 5173,
    },
    webViewProps: {
        type: 'partner',
    },
    permissions: [],

});
