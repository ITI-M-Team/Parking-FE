
// import React from 'react';
// import { ParkingSquare } from 'lucide-react';

// function ParkingSpotList({ darkMode, spots }) {
//   if (!spots || spots.length === 0) {
//     return (
//       <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
//         <h3 className="text-lg font-semibold mb-4">Parking Spots Overview</h3>
//         <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No parking spots defined for this garage.</p>
//       </div>
//     );
//   }

//   const availableCount = spots.filter(spot => spot.status === 'available').length;
//   const occupiedCount = spots.filter(spot => spot.status === 'occupied').length;
//   const reservedCount = spots.filter(spot => spot.status === 'reserved').length;

//   return (
//     <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
//       <h3 className="text-lg font-semibold mb-4">Parking Spots Overview</h3>

//       {/* Status Summary */}
//       <div className="flex items-center space-x-4 mb-6 text-sm font-medium">
//         <span className="flex items-center">
//           <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span> Available ({availableCount})
//         </span>
//         <span className="flex items-center">
//           <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span> Occupied ({occupiedCount})
//         </span>
//         <span className="flex items-center">
//           <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span> Reserved ({reservedCount})
//         </span>
//       </div>

//       {/* Spots Grid */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//         {spots.map(spot => (
//           <div
//             key={spot.id}
//             className={`p-4 rounded-lg flex flex-col items-center justify-center text-center transition-colors
//               ${spot.status === 'available' ? (darkMode ? 'bg-green-900/30 border border-green-600' : 'bg-green-100 border border-green-300') : ''}
//               ${spot.status === 'occupied' ? (darkMode ? 'bg-red-900/30 border border-red-600' : 'bg-red-100 border border-red-300') : ''}
//               ${spot.status === 'reserved' ? (darkMode ? 'bg-yellow-900/30 border border-yellow-600' : 'bg-yellow-100 border border-yellow-300') : ''}
//             `}
//           >
//             <ParkingSquare className={`w-8 h-8 mb-2 ${
//               spot.status === 'available' ? 'text-green-500' :
//               spot.status === 'occupied' ? 'text-red-500' :
//               'text-yellow-500'
//             }`} />
//             <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//               {spot.slot_number}
//             </p>
//             <p className={`text-xs capitalize ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//               {spot.status}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default ParkingSpotList;
import React from 'react';
import { ParkingSquare } from 'lucide-react';

function ParkingSpotList({ darkMode, spots }) {
  if (!spots || spots.length === 0) {
    return (
      <div className="text-center py-10">
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No parking spots to display for this page.</p>
      </div>
    );
  }

  // Status Summary can be calculated from all spots, not just the current page if needed
  // For simplicity, we can remove it from here or pass all spots as another prop.
  // Let's keep it simple and remove it for now.

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {spots.map(spot => (
        <div
          key={spot.id}
          className={`p-4 rounded-lg flex flex-col items-center justify-center text-center transition-colors
            ${spot.status === 'available' ? (darkMode ? 'bg-green-900/30 border border-green-600' : 'bg-green-100 border border-green-300') : ''}
            ${spot.status === 'occupied' ? (darkMode ? 'bg-red-900/30 border border-red-600' : 'bg-red-100 border border-red-300') : ''}
            ${spot.status === 'reserved' ? (darkMode ? 'bg-yellow-900/30 border border-yellow-600' : 'bg-yellow-100 border border-yellow-300') : ''}
          `}
        >
          <ParkingSquare className={`w-8 h-8 mb-2 ${
            spot.status === 'available' ? 'text-green-500' :
            spot.status === 'occupied' ? 'text-red-500' :
            'text-yellow-500'
          }`} />
          <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {spot.slot_number}
          </p>
          <p className={`text-xs capitalize ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {spot.status}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ParkingSpotList;
