import React from 'react';
import { Facebook } from 'lucide-react';
import hossam from "../assets/images/team/hossam.png";
import mohamed from "../assets/images/team/mohamed.jpg";
import ahmed from "../assets/images/team/Ahmed.png";
import hazem from "../assets/images/team/hazem.png";

function Footer({ darkMode }) {
  return (
    <footer className={`border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main content row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-6">
          {/* Facebook Link - now on the left */}
          <a 
            href="https://www.facebook.com/profile.php?id=61578781972704" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
          >
            <Facebook className="w-5 h-5" />
            <span>Visit us on Facebook</span>
          </a>

          {/* Developer Team - now on the right */}
          <div className="flex flex-col items-center">
            <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Development Team
            </h3>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4">
              {/* Developer 1 */}
              <a
                href="https://www.linkedin.com/in/ahmed-mohamed251201/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-center group"
              >
                <div className={`w-10 h-10 rounded-full overflow-hidden border-2 ${darkMode ? 'border-gray-600 group-hover:border-blue-400' : 'border-gray-300 group-hover:border-blue-600'} transition-colors`}>
                  <img src={ahmed} alt="Ahmed" className="w-full h-full object-cover" />
                </div>
                <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-600 group-hover:text-blue-600'}`}>Ahmed</span>
              </a>

              {/* Developer 2 */}
              <a
                href="https://www.linkedin.com/in/esraa-anwer-050712236/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-center group"
              >
                <div className={`w-10 h-10 rounded-full overflow-hidden border-2 ${darkMode ? 'border-gray-600 group-hover:border-blue-400' : 'border-gray-300 group-hover:border-blue-600'} transition-colors`}>
                  <img src="/team/dev2.jpg" alt="Esraa" className="w-full h-full object-cover" />
                </div>
                <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-600 group-hover:text-blue-600'}`}>Esraa</span>
              </a>

              {/* Developer 3 */}
              <a
                href="https://www.linkedin.com/in/fatma-mosaad-8b033323a/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-center group"
              >
                <div className={`w-10 h-10 rounded-full overflow-hidden border-2 ${darkMode ? 'border-gray-600 group-hover:border-blue-400' : 'border-gray-300 group-hover:border-blue-600'} transition-colors`}>
                  <img src="/team/dev3.jpg" alt="Fatma" className="w-full h-full object-cover" />
                </div>
                <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-600 group-hover:text-blue-600'}`}>Fatma</span>
              </a>

              {/* Developer 4 */}
              <a
                href="https://www.linkedin.com/in/hazem-helal-634034225/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-center group"
              >
                <div className={`w-10 h-10 rounded-full overflow-hidden border-2 ${darkMode ? 'border-gray-600 group-hover:border-blue-400' : 'border-gray-300 group-hover:border-blue-600'} transition-colors`}>
                  <img src={hazem} alt="Hazem" className="w-full h-full object-cover" />
                </div>
                <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-600 group-hover:text-blue-600'}`}>Hazem</span>
              </a>

              {/* Developer 5 */}
              <a
                href="https://hossamkoky599.github.io/My-Portfolio/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-center group"
              >
                <div className={`w-10 h-10 rounded-full overflow-hidden border-2 ${darkMode ? 'border-gray-600 group-hover:border-blue-400' : 'border-gray-300 group-hover:border-blue-600'} transition-colors`}>
                  <img src={hossam} alt="Hossam" className="w-full h-full object-cover" />
                </div>
                <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-600 group-hover:text-blue-600'}`}>Hossam</span>
              </a>

              {/* Developer 6 */}
              <a
                href="https://www.linkedin.com/in/mohamed-silaya1532/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-center group"
              >
                <div className={`w-10 h-10 rounded-full overflow-hidden border-2 ${darkMode ? 'border-gray-600 group-hover:border-blue-400' : 'border-gray-300 group-hover:border-blue-600'} transition-colors`}>
                  <img src={mohamed} alt="Mohamed" className="w-full h-full object-cover" />
                </div>
                <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-600 group-hover:text-blue-600'}`}>Mohamed</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright - Centered below everything */}
        <div className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-6`}>
          © {new Date().getFullYear()} Parkly. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;