
import React, { useState } from 'react';
import ownerDashboardApi from '../../apis/ownerDashboardApi';

function UpdateSpotsForm({ darkMode, garageId, onUpdateSuccess }) {
  const [newSpotsCount, setNewSpotsCount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!garageId) {
      setError('Garage ID is missing.');
      setLoading(false);
      return;
    }

    const count = parseInt(newSpotsCount, 10);
    if (isNaN(count) || count < 0) {
      setError('Please enter a valid non-negative number for available spots.');
      setLoading(false);
      return;
    }

    try {
      await ownerDashboardApi.updateSpotAvailability(garageId, count);
      setSuccess('Available spots updated successfully!');
      setNewSpotsCount('');
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (err) {
      console.error('Failed to update spots:', err);
      setError(err.response?.data?.detail || 'Failed to update available spots. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <h3 className="text-lg font-semibold mb-4">Adjust Available Spots</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="newSpots" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            New Available Spots Count:
          </label>
          <input
            type="number"
            id="newSpots"
            value={newSpotsCount}
            onChange={(e) => setNewSpotsCount(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'border-gray-300 text-gray-900 focus:ring-blue-500'
            }`}
            placeholder="e.g., 10"
            min="0"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
        <button
          type="submit"
          className={`w-full px-4 py-2 rounded-md font-semibold transition-colors ${
            loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Spots'}
        </button>
      </form>
    </div>
  );
}

export default UpdateSpotsForm;
