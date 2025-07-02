import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center dark:bg-gray-800">
      <h1 className="text-2xl font-bold text-red-600">🚗 Smart Parking App</h1>
      <div className="space-x-4">
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
        >
          Sign Up
        </button>
      </div>
    </header>
  );
};

export default Header;
