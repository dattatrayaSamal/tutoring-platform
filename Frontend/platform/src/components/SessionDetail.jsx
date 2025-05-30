import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../services/api';
import { useAuth } from '../context/Authcontext';

export default function SessionDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get(`/sessions/${id}`);
        setSession(res.data);
      } catch (err) {
        setError('Failed to fetch session details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await axios.put(`/sessions/${id}`, { status: newStatus });
      setSession(res.data);
    } catch (err) {
      setError('Failed to update session status');
      console.error(err);
    }
  };

  if (loading) return <div>Loading session details...</div>;
  if (!session) return <div>Session not found</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Session Details</h2>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Subject:</h3>
          <p>{session.subject}</p>
        </div>
        
        <div>
          <h3 className="font-semibold">Date & Time:</h3>
          <p>{new Date(session.dateTime).toLocaleString()}</p>
        </div>
        
        <div>
          <h3 className="font-semibold">Status:</h3>
          <p className="capitalize">{session.status}</p>
        </div>
        
        <div>
          <h3 className="font-semibold">
            {user.role === 'student' ? 'Tutor' : 'Student'}:
          </h3>
          <p>{user.role === 'student' ? session.tutor?.name : session.student?.name}</p>
        </div>
        
        {session.notes && (
          <div>
            <h3 className="font-semibold">Notes:</h3>
            <p>{session.notes}</p>
          </div>
        )}
      </div>

      <div className="mt-6 space-x-4">
        {session.status === 'scheduled' && (
          <>
            <button
              onClick={() => handleStatusChange('cancelled')}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancel Session
            </button>
            
            {user.role === 'student' && (
              <button
                onClick={() => navigate(`/messages/${session._id}`)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Message Tutor
              </button>
            )}
          </>
        )}
        
        {session.status === 'completed' && !session.rating && user.role === 'student' && (
          <button
            onClick={() => navigate(`/feedback/${session._id}`)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Leave Feedback
          </button>
        )}
      </div>
    </div>
  );
}