// import instance from './config';

// const getAuthHeaders = () => {
//   const storedToken = localStorage.getItem("authTokens") || sessionStorage.getItem("authTokens");
//   const token = storedToken ? JSON.parse(storedToken).access : null;

//   if (token) {
//     return {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     };
//   }
//   return {};
// };

// const ownerDashboardApi = {
//   // Get data for the owner's dashboard
//   getDashboardData: async () => {
//     try {
//       const response = await instance.get('/owner/dashboard/', getAuthHeaders());
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching owner dashboard data:', error);
//       throw error;
//     }
//   },

//   // Update the number of available spots in a garage
//   updateSpotAvailability: async (garageId, newAvailableSpotsCount) => {
//     try {
//       const response = await instance.put(
//         `/owner/garages/${garageId}/update-spots/`,
//         { new_available_spots_count: newAvailableSpotsCount },
//         getAuthHeaders()
//       );
//       return response.data;
//     } catch (error) {
//       console.error(`Error updating spot availability for garage ${garageId}:`, error);
//       throw error;
//     }
//   },

//   // Send the weekly report (PDF or email) to a specific address
//   sendWeeklyReport: async (garageId, email) => {
//     try {
//       const response = await instance.post(
//         '/reports/weekly/',
//         { garage_id: garageId, email },
//         getAuthHeaders()
//       );
//       return response.data;
//     } catch (error) {
//       console.error('Error sending weekly report:', error);
//       throw error;
//     }
//   },
// };

// export default ownerDashboardApi;

// src/apis/ownerDashboard.js
import API from '../api/axios'; // ← غير من './config' إلى '../api/axios'

const getAuthHeaders = () => {
  // مفيش داعي نضيف الـ Authorization هنا، API.interceptors هيعمله تلقائيًا
  return {}; // يمكن تحذف الدالة دي كمان لو مش مستخدمها
};

const ownerDashboardApi = {
  getDashboardData: async () => {
    try {
      const response = await API.get('/owner/dashboard/'); // مش بحتج headers
      return response.data;
    } catch (error) {
      console.error('Error fetching owner dashboard data:', error);
      throw error;
    }
  },

  updateSpotAvailability: async (garageId, newAvailableSpotsCount) => {
    try {
      const response = await API.put(
        `/owner/garages/${garageId}/update-spots/`,
        { new_available_spots_count: newAvailableSpotsCount }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating spot availability for garage ${garageId}:`, error);
      throw error;
    }
  },

  sendWeeklyReport: async (garageId, email) => {
    try {
      const response = await API.post(
        '/reports/weekly/',
        { garage_id: garageId, email }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending weekly report:', error);
      throw error;
    }
  },
};

export default ownerDashboardApi;