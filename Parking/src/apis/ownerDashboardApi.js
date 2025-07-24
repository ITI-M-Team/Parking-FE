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
// ==================================================================
//  File: src/apis/ownerDashboardApi.js
// ==================================================================

import API from '../api/axios';

const ownerDashboardApi = {
  /**
   * Fetches all dashboard data for the logged-in owner.
   */
  getDashboardData: async () => {
    try {
      const response = await API.get('/owner/dashboard/');
      return response.data;
    } catch (error) {
      console.error('Error fetching owner dashboard data:', error);
      throw error;
    }
  },

  /**
   * Updates the number of available spots for a specific garage.
   */
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

  /**
   * Sends a request to generate and email a weekly report.
   */
  sendWeeklyReport: async (garageId, email) => {
    try {
      // THE FIX IS HERE: Ensure there are no leading spaces in the URL.
      // Correct URL: '/reports/weekly/'
      const response = await API.post('/reports/weekly/', {
        garage_id: garageId,
        email: email,
      });
      return response.data;
    } catch (error) {
      console.error('Error sending weekly report:', error);
      throw error;
    }
  },
};

export default ownerDashboardApi;
