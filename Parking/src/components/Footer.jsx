import React from "react";

const Footer = () => {
  return (
    <footer className="bg-red-600 dark:bg-red-700 text-center p-4 text-sm text-white">
      &copy; {new Date().getFullYear()} Smart Parking App — All rights reserved.
    </footer>
  );
};

export default Footer;
