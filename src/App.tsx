import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OverlayProvider } from '@toss/use-overlay';
import { SearchPage } from './pages/SearchPage';
import { ResultPage } from './pages/ResultPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <OverlayProvider>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </OverlayProvider>
    </BrowserRouter>
  );
};

export default App;
