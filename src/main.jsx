import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Timer from './pages/Timer.jsx';
import './styles/Base.css';
import './styles/Cronometro.css';
import './styles/Equipes.css';
import './styles/Warnings.css';
import './styles/Modals.css';
import './styles/Desafios.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/timer" element={<Timer />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);