import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

import Index from './Components/Index';
import Documentation from './Components/Documentation';
import './Components/style.css';
import Home from './Components/Home';

// ✅ Initialize Google Analytics with your tracking ID
const TRACKING_ID = 'G-Z7CY7DRL3B';
ReactGA.initialize(TRACKING_ID);

// ✅ Track page views on route change
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AnalyticsTracker />
      <div className="App">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/index" element={<Index />} />
          <Route path="/documentation" element={<Documentation />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
