import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import NotFound from './page/NotFound';
import './App.css';
import AppHeader from './components/Header';
import AppFooter from './components/Footer';
function App() {
  return (
    <Router>
      <Layout>
        <AppHeader />
        <Routes>
          <Route path='/' element={<NotFound />} />
        </Routes>
        <AppFooter />
      </Layout>
    </Router>
  );
}

export default App;
