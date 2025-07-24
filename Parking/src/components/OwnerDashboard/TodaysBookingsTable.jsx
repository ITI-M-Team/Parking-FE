
// import React from 'react';
// import { format } from 'date-fns';

// function TodaysBookingsTable({ darkMode, bookings }) {
//   if (!bookings || bookings.length === 0) {
//     return (
//       <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
//         <h3 className="text-lg font-semibold mb-4">Today's Bookings</h3>
//         <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No bookings for today.</p>
//       </div>
//     );
//   }

//   return (
//     <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
//       <h3 className="text-lg font-semibold mb-4">Today's Bookings</h3>
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//           <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
//             <tr>
//               <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
//                 Booking ID
//               </th>
//               <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
//                 Driver Email
//               </th>
//               <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
//                 Spot Number
//               </th>
//               <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
//                 Arrival Time
//               </th>
//               <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
//                 Estimated Cost
//               </th>
//               <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
//                 Status
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//             {bookings.map((booking) => (
//               <tr key={booking.id}>
//                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
//                   {booking.id}
//                 </td>
//                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
//                   {booking.driver_email}
//                 </td>
//                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
//                   {booking.parking_spot_slot_number}
//                 </td>
//                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
//                   {format(new Date(booking.estimated_arrival_time), 'MMM dd, yyyy HH:mm')}
//                 </td>
//                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
//                   {/* ${booking.estimated_cost.toFixed(2)} */}
//                 </td>
//                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
//                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                     booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
//                     booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                     'bg-gray-100 text-gray-800'
//                   }`}>
//                     {booking.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default TodaysBookingsTable;

import React from 'react';
import { format } from 'date-fns';

function TodaysBookingsTable({ darkMode, bookings }) {
  // دالة لعرض "N/A" لو القيمة غير موجودة
  const renderValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>N/A</span>;
    }
    return value;
  };

  // دالة لتنسيق الوقت
  const formatBookingTime = (time) => {
    if (!time) return renderValue(null);
    try {
      return format(new Date(time), 'p'); // تنسيق الوقت: "4:30 PM"
    } catch (error) {
      return renderValue(null);
    }
  };

  return (
    <div className={`p-4 rounded-lg shadow-md h-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className="text-lg font-semibold mb-4">Today's Bookings</h3>
      {!bookings || bookings.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>No bookings for today.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-4 py-2 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Driver</th>
                <th className={`px-4 py-2 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Time</th>
                <th className={`px-4 py-2 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Cost</th>
                <th className={`px-4 py-2 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{renderValue(booking.driver_username)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{formatBookingTime(booking.created_at)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    {booking.actual_cost ? `$${parseFloat(booking.actual_cost).toFixed(2)}` : renderValue(null)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === 'completed' || booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'cancelled' || booking.status === 'expired' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TodaysBookingsTable;
