
import instance from './config';

const getAuthHeaders = () => {
  const storedToken = localStorage.getItem("authTokens") || sessionStorage.getItem("authTokens");
  const token = storedToken ? JSON.parse(storedToken).access : null;

  if (token) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }
  return {};
};

const ownerDashboardApi = {
  getDashboardData: async () => {
    try {
      const response = await instance.get('/owner/dashboard/', getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error fetching owner dashboard data:', error);
      throw error;
    }
  },

  updateSpotAvailability: async (garageId, newAvailableSpotsCount) => {
    try {
      const response = await instance.put(
        `/owner/garages/${garageId}/update-spots/`,
        { new_available_spots_count: newAvailableSpotsCount },
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating spot availability for garage ${garageId}:`, error);
      throw error;
    }
  },
};

export default ownerDashboardApi;
