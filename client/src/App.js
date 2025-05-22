import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './Components/Index';
import Documentation from './Components/Documentation';
import './Components/style.css';
import Home from './Components/Home';

function App() {
  return (
    <BrowserRouter>
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
