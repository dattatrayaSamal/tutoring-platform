import { useEffect, useState } from 'react';
import axios from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function MatchTutors() {
  const [tutors, setTutors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await axios.get('/match/tutors');
        setTutors(res.data);
      } catch (err) {
        console.error('Failed to fetch tutors:', err);
      }
    };
    fetchTutors();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Matched Tutors</h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {tutors.map((tutor) => (
          <div
            key={tutor._id}
            className="p-4 bg-white shadow rounded-lg space-y-2 border"
          >
            <h3 className="text-lg font-semibold">{tutor.name}</h3>
            <p className="text-sm text-gray-600">Subjects: {tutor.subjects.join(', ')}</p>
            <p className="text-sm">Rating: {tutor.rating || 'Not rated'}</p>
            <p className="text-sm text-gray-500">
              Available: {tutor.availability?.join(', ') || 'N/A'}
            </p>
            <button
              onClick={() => navigate(`/book-session/${tutor._id}`)}
              className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Book Session
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
