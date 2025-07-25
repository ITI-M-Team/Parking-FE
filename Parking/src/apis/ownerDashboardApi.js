import API from '../api/axios';

const ownerDashboardApi = {
  /**
   * Fetches all dashboard data for the logged-in owner.
   */
  getDashboardData: async () => {
    try {
      // Use the new dedicated endpoint
      const response = await API.get('/owner/dashboard/');
      
      // DEBUG: Log the response
      console.log('🔧 Dashboard API Response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching owner dashboard data:', error);
      console.error('❌ Error response:', error.response?.data);
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
  /**
 * Fetches garage verification status
 */
    getGarageVerificationStatus: async (garageId) => {
      try {
        const response = await API.get(`/garages/${garageId}/verification-status/`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching verification status for garage ${garageId}:`, error);
        throw error;
      }
    },
    /**
     * Fetches detailed information for a specific garage
     */
    getGarageDetails: async (garageId) => {
      try {
        const response = await API.get(`/garages/${garageId}/`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching garage details for ${garageId}:`, error);
        throw error;
      }
    },
};

export default ownerDashboardApi;