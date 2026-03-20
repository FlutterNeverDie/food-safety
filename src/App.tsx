import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OverlayProvider } from '@toss/use-overlay';

import { IntroPage } from './pages/IntroPage';
import { SearchPage } from './pages/SearchPage';
import { ResultPage } from './pages/ResultPage';

const App: React.FC = () => {
  return (
    <>
      <OverlayProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/result" element={<ResultPage />} />
          </Routes>
        </BrowserRouter>
      </OverlayProvider>
    </>
  );
};

export default App;

