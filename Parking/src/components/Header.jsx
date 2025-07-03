import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-red-600 shadow-md p-4 flex justify-between items-center text-white dark:bg-red-700">
      <h1 className="text-2xl font-bold"> Smart Parking App</h1>
      <div className="space-x-4">
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-white text-red-600 font-semibold rounded hover:bg-gray-100"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="px-4 py-2 bg-red-800 text-white rounded hover:bg-red-900"
        >
          Sign Up
        </button>
      </div>
    </header>
  );
};

export default Header;
