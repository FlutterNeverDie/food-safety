import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OverlayProvider } from '@toss/use-overlay';
import { TDSMobileProvider } from '@toss/tds-mobile';
import { IntroPage } from './pages/IntroPage';
import { SearchPage } from './pages/SearchPage';
import { ResultPage } from './pages/ResultPage';

const App: React.FC = () => {
  // TDSMobileProvider에 필요한 필수 정보 모킹 (다크모드 지원, iOS 여부 등)
  const mockUserAgent = {
    isIos: false,
    isAndroid: true,
    isMobile: true,
    isToss: true,
    darkMode: false,
    textScale: 1,
  };

  return (
    <TDSMobileProvider userAgent={mockUserAgent as any}>
      <OverlayProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/result" element={<ResultPage />} />
          </Routes>
        </BrowserRouter>
      </OverlayProvider>
    </TDSMobileProvider>
  );
};

export default App;

