import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="px-6 py-12 text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* About Section */}
        <section className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to Smart Parking App</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Your smart solution to finding nearby parking spots, booking them in real-time,
            and managing your garage efficiently — all in one platform.
          </p>
          <button
            onClick={() => navigate("/manual")}
            className="mt-6 px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600"
          >
            How it Works
          </button>
        </section>

        {/* Contact Section */}
        <section className="text-center">
          <h3 className="text-2xl font-semibold mb-2">Contact Us</h3>
          <p>Email: <a href="mailto:support@smartparking.com" className="text-blue-500">support@smartparking.com</a></p>
          <p>Phone: +20 123 456 7890</p>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Home;
