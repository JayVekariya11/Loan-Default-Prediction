import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import HomePage from './pages/HomePage';
import PredictPage from './pages/PredictPage';
import DatasetPage from './pages/DatasetPage';
import ModelPage from './pages/ModelPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', backgroundColor: '#0B0F19', fontFamily: 'Inter, system-ui, sans-serif', position: 'relative' }}>

        {/* Persistent animated background blobs */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div className="animate-blob" style={{
            position: 'absolute', top: '-10%', left: '-5%',
            width: '55%', height: '55%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)',
            filter: 'blur(80px)', borderRadius: '50%',
          }} />
          <div className="animate-blob animation-delay-2000" style={{
            position: 'absolute', top: '40%', right: '-5%',
            width: '50%', height: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.16) 0%, transparent 70%)',
            filter: 'blur(80px)', borderRadius: '50%',
          }} />
          <div className="animate-blob animation-delay-4000" style={{
            position: 'absolute', bottom: '-10%', left: '25%',
            width: '50%', height: '50%',
            background: 'radial-gradient(circle, rgba(244,63,94,0.14) 0%, transparent 70%)',
            filter: 'blur(80px)', borderRadius: '50%',
          }} />
        </div>

        {/* Navbar */}
        <Navbar />

        {/* Pages */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/predict" element={<PredictPage />} />
            <Route path="/dataset" element={<DatasetPage />} />
            <Route path="/model" element={<ModelPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
