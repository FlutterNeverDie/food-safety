# AppsInToss SDK 2.0 업데이트 및 배포 트러블슈팅 가이드

이 문서는 "배달 위생 지킴이 (clean-check)" 프로젝트를 개발하는 다른 AI 에이전트들을 위한 가이드 문서입니다. 개발 과정에서 발생할 수 있는 AppsInToss SDK 버전 이슈와 배포 명령어 에러의 원인 및 해결 방법에 대해 정리되어 있습니다.

---

## 🛑 1. SDK 버전 이슈: "지원하지 않는 번들이에요"
토스 개발자 센터(웹뷰 앱인앱 환경)에 배포 후 심사 또는 테스트 과정에서 **"지원하지 않는 번들이에요. 최신 SDK를 사용해주세요"** 라는 오류가 발생할 수 있습니다.

### 원인
* 프로젝트에서 사용 중인 토스 앱인앱 SDK(`@apps-in-toss/web-framework`) 버전의 문제.
* 구버전(예: 1.9.0)으로 빌드 된 번들을 더 이상 토스 서버에서 수용하지 않을 때 발생합니다. 

### 해결 방법
`package.json` 의 `@apps-in-toss/web-framework` 버전을 **2.0 이상 (예: 2.0.6)** 으로 강제 업데이트 합니다.

```bash
# 터미널에서 아래 명령어 실행
npm install @apps-in-toss/web-framework@2.0.6
```

---

## 🛑 2. 배포(Deploy) 시점 이슈 (Granite Deprecation & Cache)

SDK 최신 버전을 적용하고 터미널에서 기존 방식(`npx granite build && npx ait deploy`)으로 배포할 때 다음과 같은 에러가 릴레이로 연달아 발생할 수 있습니다.

1. **`granite build` is no longer supported for web projects. Please use `ait build` instead.** (문법 만료)
2. **이미 해당 앱 번들이 업로드되어 있어요 (Code: 4097)** (캐시/버전 충돌)
3. **최대 대기시간을 초과했어요. / Canceled** (Toss 서버 타임아웃 오류)

### 원인
* 구 방식인 `granite build` 스크립트의 지원이 종료되었습니다.
* 개발 테스트 도중 기존 번들의 해시(Hash)가 토스 배포 서버 내부 캐시와 충돌하여, 같은 파일을 올린 것으로 간주해 반려(4097 에러)하거나 네트워크 지연(Timeout)을 일으켰습니다.

### 해결 방법
`package.json`의 `scripts` 에 등록된 `deploy` 명령어를 캐시 초기화를 동반한 **`ait build` 기반의 강제 클린(Clean) 배포 스크립트**로 완전히 교체합니다.

**✅ 수정 내용 (`package.json`)**
1. `"version"` 값을 기존 대비 무조건 +1 단계 올립니다. (예: `"0.0.1"` -> `"0.0.2"`). 새 버전을 인식시켜 충돌(4097)을 회피합니다.
2. 배포 스크립트를 다음과 같이 수정하여 기존 찌꺼기를 완전히 지웁니다 (`rm -rf ...`).

```json
  "version": "0.0.2",
  "scripts": {
    "deploy": "rm -rf .granite dist *.ait && npx ait build && npx ait deploy"
  }
```

이제 `npm run deploy` 명령어를 입력하면,
1. 기존 빌드 폴더(`.granite`, `dist`)와 압축본(`*.ait`)이 제거됩니다.
2. 새롭게 `npx ait build` 가 현재 코드를 묶습니다.
3. 충돌 없이 `npx ait deploy` 명령을 통해 토스 개발자 센터로 깔끔하게 전송됩니다.
