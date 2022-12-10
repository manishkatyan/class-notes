import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./page/NotFound";
import "./App.css";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
