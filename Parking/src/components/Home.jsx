import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import bgImage from "../assets/images/background-home.png"; // Update if you renamed

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex flex-col min-h-screen bg-cover bg-center text-white"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">


        <main className="flex-grow px-4 sm:px-8 md:px-12 py-12 flex flex-col items-center justify-center text-center">
          {/* About Section */}
          <section className="mb-16 max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-md">
              Welcome to Smart Parking App
            </h2>
            <p className="text-lg md:text-xl leading-relaxed drop-shadow">
              Your smart solution to finding nearby parking spots, booking them in real-time,
              and managing your garage efficiently — all in one platform.
            </p>
            <button
              onClick={() => navigate("/manual")}
              className="mt-8 px-6 py-3 bg-red-500 text-white text-lg rounded-lg shadow hover:bg-red-600 transition"
            >
              How it Works
            </button>
          </section>

          {/* Contact Section */}
          <section className="max-w-xl">
            <h3 className="text-2xl font-semibold mb-4 drop-shadow">Contact Us</h3>
            <p>
              Email:{" "}
              <a
                href="mailto:appparking653@gmail.com"
                className="text-teal-300 underline hover:text-teal-200"
              >
                appparking653@gmail.com
              </a>
            </p>
          </section>
        </main>


      </div>
    </div>
  );
};

export default Home;
