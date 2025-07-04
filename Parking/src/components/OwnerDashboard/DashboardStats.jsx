
import React from 'react';
import { DollarSign, Car, ParkingSquare } from 'lucide-react';

function DashboardStats({ darkMode, garageData }) {
  if (!garageData) {
    return null;
  }

  const totalSpots = garageData.occupied_spots_count + garageData.available_spots_count + garageData.reserved_spots_count;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Daily Revenue Card */}
      <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Daily Revenue</h3>
          <DollarSign className="w-6 h-6 text-green-500" />
        </div>
        <p className="text-3xl font-bold">
          ${garageData.today_revenue ? garageData.today_revenue.toFixed(2) : '0.00'}
        </p>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Revenue from confirmed bookings today
        </p>
      </div>

      {/* Available Spots Card */}
      <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Available Spots</h3>
          <ParkingSquare className="w-6 h-6 text-blue-500" />
        </div>
        <p className="text-3xl font-bold">
          {garageData.available_spots_count} / {totalSpots}
        </p>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Free parking spots right now
        </p>
      </div>

      {/* Occupied Spots Card */}
      <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Occupied Spots</h3>
          <Car className="w-6 h-6 text-red-500" />
        </div>
        <p className="text-3xl font-bold">
          {garageData.occupied_spots_count} / {totalSpots}
        </p>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Spots currently in use
        </p>
      </div>
    </div>
  );
}

export default DashboardStats;
