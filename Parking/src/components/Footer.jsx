// import React from 'react';
// import { Facebook } from 'lucide-react';
// import hossam from "../assets/images/team/hossam.png";
// import mohamed from "../assets/images/team/mohamed.jpg";
// import ahmed from "../assets/images/team/Ahmed.png";
// import hazem from "../assets/images/team/hazem.png";

// function Footer({ darkMode }) {
//   return (
//     <footer className={`border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//         {/* Main content - single row layout */}
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
//           {/* Facebook Link - Compact */}
//           <a 
//             href="https://www.facebook.com/profile.php?id=61578781972704" 
//             target="_blank" 
//             rel="noopener noreferrer"
//             className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm transition-colors ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
//           >
//             <Facebook className="w-4 h-4" />
//             <span className="hidden sm:inline">Visit us on Facebook</span>
//             <span className="sm:hidden">Facebook</span>
//           </a>

//           {/* Developer Team - Compact horizontal layout */}
//           <div className="flex items-center gap-3">
//             <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} hidden md:block`}>
//               Team:
//             </span>
//             <div className="flex items-center gap-2">
//               {/* Developer 1 - Ahmed */}
//               <a
//                 href="https://www.linkedin.com/in/ahmed-mohamed251201/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="group flex items-center"
//                 title="Ahmed Mohamed"
//               >
//                 <div className={`w-7 h-7 rounded-full overflow-hidden border ${darkMode ? 'border-gray-600 group-hover:border-blue-400' : 'border-gray-300 group-hover:border-blue-600'} transition-colors`}>
//                   <img src={ahmed} alt="Ahmed" className="w-full h-full object-cover" />
//                 </div>
//               </a>

//               {/* Developer 2 - Esraa */}
//               <a
//                 href="https://www.linkedin.com/in/esraa-anwer-050712236/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="group flex items-center"
//                 title="Esraa Anwer"
//               >
//                 <div className={`w-7 h-7 rounded-full overflow-hidden border ${darkMode ? 'border-gray-600 group-hover:border-blue-400' : 'border-gray-300 group-hover:border-blue-600'} transition-colors`}>
//                   <img src="/team/dev2.jpg" alt="Esraa" className="w-full h-full object-cover" />
//                 </div>
//               </a>

//               {/* Developer 3 - Fatma */}
//               <a
//                 href="https://www.linkedin.com/in/fatma-mosaad-8b033323a/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="group flex items-center"
//                 title="Fatma Mosaad"
//               >
//                 <div className={`w-7 h-7 rounded-full overflow-hidden border ${darkMode ? 'border-gray-600 group-hover:border-blue-400' : 'border-gray-300 group-hover:border-blue-600'} transition-colors`}>
//                   <img src="/team/dev3.jpg" alt="Fatma" className="w-full h-full object-cover" />
//                 </div>
//               </a>

//               {/* Developer 4 - Hazem */}
//               <a
//                 href="https://www.linkedin.com/in/hazem-helal-634034225/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="group flex items-center"
//                 title="Hazem Helal"
//               >
//                 <div className={`w-7 h-7 rounded-full overflow-hidden border ${darkMode ? 'border-gray-600 group-hover:border-blue-400' : 'border-gray-300 group-hover:border-blue-600'} transition-colors`}>
//                   <img src={hazem} alt="Hazem" className="w-full h-full object-cover" />
//                 </div>
//               </a>

//               {/* Developer 5 - Hossam */}
//               <a
//                 href="https://hossamkoky599.github.io/My-Portfolio/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="group flex items-center"
//                 title="Hossam Koky"
//               >
//                 <div className={`w-7 h-7 rounded-full overflow-hidden border ${darkMode ? 'border-gray-600 group-hover:border-blue-400' : 'border-gray-300 group-hover:border-blue-600'} transition-colors`}>
//                   <img src={hossam} alt="Hossam" className="w-full h-full object-cover" />
//                 </div>
//               </a>

//               {/* Developer 6 - Mohamed */}
//               <a
//                 href="https://www.linkedin.com/in/mohamed-silaya1532/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="group flex items-center"
//                 title="Mohamed Silaya"
//               >
//                 <div className={`w-7 h-7 rounded-full overflow-hidden border ${darkMode ? 'border-gray-600 group-hover:border-blue-400' : 'border-gray-300 group-hover:border-blue-600'} transition-colors`}>
//                   <img src={mohamed} alt="Mohamed" className="w-full h-full object-cover" />
//                 </div>
//               </a>
//             </div>
//           </div>

//           {/* Copyright - Inline on larger screens */}
//           <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center sm:text-right`}>
//             © {new Date().getFullYear()} Parkly
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }


// export default Footer;

import React from 'react';
import { Facebook } from 'lucide-react';
import hossam from "../assets/images/team/hossam.png";
import mohamed from "../assets/images/team/mohamed.jpg";
import ahmed from "../assets/images/team/Ahmed.png";
import hazem from "../assets/images/team/hazem.png";

function Footer({ darkMode }) {
  return (
    <footer className={`border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Main content - single row layout */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Facebook Link - Compact */}
          <a 
            href="https://www.facebook.com/profile.php?id=61578781972704" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm transition-colors ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
          >
            <Facebook className="w-4 h-4" />
            <span className="hidden sm:inline">Visit us on Facebook</span>
            <span className="sm:hidden">Facebook</span>
          </a>

          {/* Social Handle - Center */}
          <div className="flex items-center">
             <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-2`}>
              © {new Date().getFullYear()} Parkly
            </div>
          </div>

          {/* Team Photos and Copyright */}
          <div className="flex items-center gap-3">
            {/* Developer Team - Compact horizontal layout */}
            <div className="flex items-center gap-2">
              {/* Developer 1 - Ahmed */}
              <a
                href="https://www.linkedin.com/in/ahmed-mohamed251201/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center"
                title="Ahmed Mohamed"
              >
                <div className={`w-7 h-7 rounded-full overflow-hidden border ${darkMode ? 'border-gray-600 group-hover:border-blue-400' : 'border-gray-300 group-hover:border-blue-600'} transition-colors`}>
                  <img src={ahmed} alt="Ahmed" className="w-full h-full object-cover" />
                </div>
              </a>

              {/* Developer 2 - Esraa */}
              <a
                href="https://www.linkedin.com/in/esraa-anwer-050712236/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center"
                title="Esraa Anwer"
              >
                <div className={`w-7 h-7 rounded-full overflow-hidden border ${darkMode ? 'border-gray-600 group-hover:border-blue-400' : 'border-gray-300 group-hover:border-blue-600'} transition-colors`}>
                  <img src="/team/dev2.jpg" alt="Esraa" className="w-full h-full object-cover" />
                </div>
              </a>

              {/* Developer 3 - Fatma */}
              <a
                href="https://www.linkedin.com/in/fatma-mosaad-8b033323a/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center"
                title="Fatma Mosaad"
              >
                <div className={`w-7 h-7 rounded-full overflow-hidden border ${darkMode ? 'border-gray-600 group-hover:border-blue-400' : 'border-gray-300 group-hover:border-blue-600'} transition-colors`}>
                  <img src="/team/dev3.jpg" alt="Fatma" className="w-full h-full object-cover" />
                </div>
              </a>

              {/* Developer 4 - Hazem */}
              <a
                href="https://www.linkedin.com/in/hazem-helal-634034225/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center"
                title="Hazem Helal"
              >
                <div className={`w-7 h-7 rounded-full overflow-hidden border ${darkMode ? 'border-gray-600 group-hover:border-blue-400' : 'border-gray-300 group-hover:border-blue-600'} transition-colors`}>
                  <img src={hazem} alt="Hazem" className="w-full h-full object-cover" />
                </div>
              </a>

              {/* Developer 5 - Hossam */}
              <a
                href="https://hossamkoky599.github.io/My-Portfolio/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center"
                title="Hossam Koky"
              >
                <div className={`w-7 h-7 rounded-full overflow-hidden border ${darkMode ? 'border-gray-600 group-hover:border-blue-400' : 'border-gray-300 group-hover:border-blue-600'} transition-colors`}>
                  <img src={hossam} alt="Hossam" className="w-full h-full object-cover" />
                </div>
              </a>

              {/* Developer 6 - Mohamed */}
              <a
                href="https://www.linkedin.com/in/mohamed-silaya1532/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center"
                title="Mohamed Silaya"
              >
                <div className={`w-7 h-7 rounded-full overflow-hidden border ${darkMode ? 'border-gray-600 group-hover:border-blue-400' : 'border-gray-300 group-hover:border-blue-600'} transition-colors`}>
                  <img src={mohamed} alt="Mohamed" className="w-full h-full object-cover" />
                </div>
              </a>
            </div>

            {/* Copyright */}
          
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;