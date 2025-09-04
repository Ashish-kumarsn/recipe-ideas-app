import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../src/pages/Home";
import RecipeDetails from "../src/pages/RecipeDetails";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />

          {/* Recipe Details Page */}
          <Route path="/recipe/:id" element={<RecipeDetails />} />

          {/* 404 - Page Not Found */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center h-screen">
                <h1 className="text-2xl font-bold text-red-500">
                  404 - Page Not Found
                </h1>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
