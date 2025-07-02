import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Manual = () => {
  return (
    <>
      <Header />
      <div className="px-6 py-12 text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-8">How to Use the Smart Parking App</h1>

        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">🔐 1. Sign Up / Log In</h2>
            <p>
              Choose your role as <strong>Driver</strong> or <strong>Garage Owner</strong>, provide email and password, and complete verification by uploading the required documents (Driver's License, Car License, or National ID).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">📍 2. Book a Parking Spot</h2>
            <p>
              Drivers can search based on destination, view available garages and rates, and select a specific spot to reserve.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">📱 3. QR Code Access</h2>
            <p>
              After booking, a QR code is generated. Scan it at the garage gate to check-in and check-out.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">💸 4. Payment & Wallet</h2>
            <p>
              Payment can be done manually or through the app’s wallet. Top-up your wallet and track your history from your dashboard.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">📊 5. Manage Dashboard</h2>
            <p>
              Drivers see reservations and payment history. Garage owners can add spots, set prices, and view reservations.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Manual;
