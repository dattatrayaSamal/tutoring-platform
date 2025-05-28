import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from '../services/api';

export default function BookSession() {
  const { tutorId } = useParams();
  const [tutor, setTutor] = useState(null);
  const [subject, setSubject] = useState('');
  const [dateTime, setDateTime] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const res = await axios.get(`/users/${tutorId}`);
        setTutor(res.data);
      } catch (err) {
        console.error('Error fetching tutor:', err);
      }
    };
    fetchTutor();
  }, [tutorId]);

  const handleBook = async () => {
    if (!subject || !dateTime) return alert("Please fill in all fields");

    try {
      const res = await axios.post('/sessions', {
        tutor: tutorId,
        subject,
        dateTime,
        status: 'scheduled',
      });

      alert('Session booked successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Failed to book session');
    }
  };

  if (!tutor) return <div>Loading tutor details...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Book a Session with {tutor.name}</h2>

      <label className="block mb-2">Subject</label>
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-4"
        placeholder="e.g. Mathematics"
      />

      <label className="block mb-2">Date & Time</label>
      <input
        type="datetime-local"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-4"
      />

      <button
        onClick={handleBook}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
      >
        Book Session
      </button>
    </div>
  );
}
