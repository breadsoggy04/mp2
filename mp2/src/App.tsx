import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import List from './Modules/list';
import Gallery from './Modules/gallery';
import Detail from './Modules/detail';
import './App.css';

function App() {
  return (
    <Router basename="/mp2">
      <header>
        <h1 className="appTitle">NASA Explorer</h1> 
        <nav className="navbar">
          <Link to="/">Search</Link>
          <Link to="/gallery">Gallery</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/detail/:id" element={<Detail />} />
      </Routes>
    </Router>
  );
}

export default App;