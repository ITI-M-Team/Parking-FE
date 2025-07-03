import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Manual = () => {
  const sections = [
    {
      title: "1. Register and Verify Your Account",
      content: (
        <>
          Start by selecting your role: <strong>Driver</strong> or <strong>Garage Owner</strong>.
          You’ll need to upload verification documents:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>Drivers</strong>: Driver's License & Car License</li>
            <li><strong>Garage Owners</strong>: National ID</li>
            <li>Account status will be “Pending Verification” until approved.</li>
          </ul>
        </>
      ),
    },
    {
      title: "2. Login & Manage Your Session",
      content: (
        <>
          Log in with your email and password. Use “Remember Me” to stay signed in.
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>Drivers</strong> are taken to their dashboard.</li>
            <li><strong>Garage Owners</strong> go to their management panel.</li>
          </ul>
        </>
      ),
    },
    {
      title: "3. Book a Parking Spot (Driver)",
      content: (
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Use the map to find garages near your location or search destination.</li>
          <li>View hourly rates, ratings, and availability.</li>
          <li>Select a spot, pick arrival time, and click “Book Now.”</li>
          <li>Booking confirmation shows a timer and booking summary.</li>
        </ul>
      ),
    },
    {
      title: "4. Use QR Code for Access",
      content: (
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>After booking, a unique QR code is generated.</li>
          <li>Scan at garage gate to check-in/out.</li>
          <li>Status and times are updated automatically.</li>
        </ul>
      ),
    },
    {
      title: "5. Make Payments & Manage Wallet",
      content: (
        <>
          <p className="font-medium mb-1">Drivers:</p>
          <ul className="list-disc list-inside mb-3 space-y-1">
            <li>Top-up using Visa, Fawry, Vodafone Cash, etc.</li>
            <li>Pay bookings automatically from wallet.</li>
            <li>View all transactions in your wallet page.</li>
          </ul>
          <p className="font-medium mb-1">Garage Owners:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Track revenue and active bookings.</li>
            <li>Request payouts to bank accounts.</li>
          </ul>
        </>
      ),
    },
    {
      title: "6. Manage Your Dashboard",
      content: (
        <>
          <p className="font-medium mb-1">Drivers:</p>
          <ul className="list-disc list-inside mb-3 space-y-1">
            <li>Track bookings and history.</li>
            <li>Cancel bookings (with possible penalty).</li>
            <li>Rate garages after visits.</li>
          </ul>
          <p className="font-medium mb-1">Garage Owners:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Add/manage garages and pricing.</li>
            <li>Monitor live occupancy.</li>
            <li>View reviews and adjust availability.</li>
          </ul>
        </>
      ),
    },
    {
      title: "7. Reset Your Password",
      content: (
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Click “Forgot Password” on the login page.</li>
          <li>Choose email or phone for OTP delivery.</li>
          <li>Enter OTP, then set a new password.</li>
        </ul>
      ),
    },
    {
      title: "8. Profile & Settings",
      content: (
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Update your name and phone.</li>
          <li>Change your password.</li>
          <li>Switch between Light and Dark Mode.</li>
        </ul>
      ),
    },
    {
      title: "9. Security & Notifications",
      content: (
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>All data is encrypted and securely stored.</li>
          <li>You’ll be notified about bookings, receipts, and verification updates.</li>
        </ul>
      ),
    },
    {
      title: "10. Admin & Employee Roles",
      content: (
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li><strong>Admins</strong> verify uploaded documents and activate accounts.</li>
          <li><strong>Employees</strong> scan QR codes at gates and track entries/exits.</li>
        </ul>
      ),
    },
  ];

  return (
    <>
      <Header />
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12"> User Guide: Smart Parking App</h1>
          <div className="space-y-10">
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400 mb-3">
                  {section.title}
                </h2>
                <div className="text-base leading-relaxed">{section.content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Manual;
