import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import React from "react";
import BookDetails from "./component/bookdetails.jsx";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="p-6 bg-blue-50 rounded-lg shadow-lg">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-4">
          Book Review
        </h1>
        <BookDetails />
      </div>
    </div>
  );
}

export default App;
