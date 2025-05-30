import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../services/api';
import { useAuth } from '../context/Authcontext';

export default function FeedbackForm() {
  const { sessionId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    rating: 5,
    comment: '',
    session: sessionId
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/feedbacks', {
        ...form,
        to: user.role === 'student' ? form.tutor : form.student
      });
      navigate(`/sessions/${sessionId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Leave Feedback</h2>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Rating (1-5)</label>
          <select
            value={form.rating}
            onChange={(e) => setForm({...form, rating: parseInt(e.target.value)})}
            className="w-full border p-2 rounded"
            required
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} star{num !== 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block font-medium mb-1">Comments</label>
          <textarea
            value={form.comment}
            onChange={(e) => setForm({...form, comment: e.target.value})}
            className="w-full border p-2 rounded"
            rows="4"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}