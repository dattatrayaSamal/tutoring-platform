import { useState, useEffect } from 'react';
import axios from '../services/api';
import { useAuth } from '../context/Authcontext';

export default function Analytics() {
  const { user } = useAuth();
  const [platformStats, setPlatformStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [platformRes, userRes] = await Promise.all([
          axios.get('/analytics/summary'),
          axios.get(`/analytics/user/${user.id}`)
        ]);
        setPlatformStats(platformRes.data);
        setUserStats(userRes.data);
      } catch (err) {
        setError('Failed to fetch analytics data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  if (loading) return <div>Loading analytics...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Platform Statistics */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Platform Statistics</h2>
          <div className="space-y-3">
            <p><span className="font-medium">Total Users:</span> {platformStats?.totalUsers || 0}</p>
            <p><span className="font-medium">Total Sessions:</span> {platformStats?.totalSessions || 0}</p>
            <p><span className="font-medium">Total Feedbacks:</span> {platformStats?.totalFeedbacks || 0}</p>
            <p><span className="font-medium">Average Rating:</span> {platformStats?.averageRating?.toFixed(1) || 'N/A'}</p>
          </div>
        </div>

        {/* User Statistics */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Your Statistics</h2>
          <div className="space-y-3">
            {user.role === 'student' ? (
              <p><span className="font-medium">Sessions Attended:</span> {userStats?.sessionsAsStudent || 0}</p>
            ) : (
              <p><span className="font-medium">Sessions Conducted:</span> {userStats?.sessionsAsTutor || 0}</p>
            )}
            <p><span className="font-medium">Feedbacks Received:</span> {userStats?.feedbackCount || 0}</p>
            <p><span className="font-medium">Your Average Rating:</span> {userStats?.averageRating?.toFixed(1) || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Additional charts can be added here */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Session History</h2>
        {/* Placeholder for chart */}
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
          <p className="text-gray-500">Session history chart will be displayed here</p>
        </div>
      </div>
    </div>
  );
}