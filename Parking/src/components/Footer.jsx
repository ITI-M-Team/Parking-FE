import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-center p-4 text-sm text-gray-600 dark:text-gray-300">
      &copy; {new Date().getFullYear()} Smart Parking App — All rights reserved.
    </footer>
  );
};

export default Footer;
