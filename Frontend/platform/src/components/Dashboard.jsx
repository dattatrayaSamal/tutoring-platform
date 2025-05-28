import { useEffect, useState, useContext } from "react";
import axios from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchSessions = async () => {
      try {
        const res = await axios.get("/sessions");
        setSessions(res.data);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [user, navigate]);

  if (loading) return <div>Loading your dashboard...</div>;

  // Separate sessions by date
  const now = new Date();
  const upcomingSessions = sessions.filter(s => new Date(s.dateTime) >= now);
  const pastSessions = sessions.filter(s => new Date(s.dateTime) < now);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">
        {user.role === "student" ? "🎓 Student Dashboard" : "🧑‍🏫 Tutor Dashboard"}
      </h1>

      {user.role === "student" && (
        <>
          <a
            href="/find-tutors"
            className="inline-block mb-4 text-blue-600 underline"
          >
            📘 Book a New Session
          </a>

          <h2 className="text-xl font-medium mb-3">Upcoming Sessions:</h2>
          {upcomingSessions.length === 0 ? (
            <p>No upcoming sessions. Book one now!</p>
          ) : (
            <ul className="space-y-4">
              {upcomingSessions.map(session => (
                <li
                  key={session._id}
                  className="border p-4 rounded shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p><strong>Subject:</strong> {session.subject}</p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(session.dateTime).toLocaleString()}
                    </p>
                    <p><strong>Tutor:</strong> {session.tutor.name}</p>
                  </div>
                  {/* Add more buttons or info if needed */}
                </li>
              ))}
            </ul>
          )}

          <h2 className="text-xl font-medium mt-8 mb-3">Past Sessions:</h2>
          {pastSessions.length === 0 ? (
            <p>No past sessions yet.</p>
          ) : (
            <ul className="space-y-4">
              {pastSessions.map(session => (
                <li
                  key={session._id}
                  className="border p-4 rounded shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p><strong>Subject:</strong> {session.subject}</p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(session.dateTime).toLocaleString()}
                    </p>
                    <p><strong>Tutor:</strong> {session.tutor.name}</p>
                  </div>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => navigate(`/feedback/${session._id}`)}
                  >
                    Give Feedback
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {user.role === "tutor" && (
        <>
          <h2 className="text-xl font-medium mb-3">Upcoming Sessions:</h2>
          {upcomingSessions.length === 0 ? (
            <p>No sessions scheduled yet.</p>
          ) : (
            <ul className="space-y-4">
              {upcomingSessions.map(session => (
                <li
                  key={session._id}
                  className="border p-4 rounded shadow-sm"
                >
                  <p><strong>Subject:</strong> {session.subject}</p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(session.dateTime).toLocaleString()}
                  </p>
                  <p><strong>Student:</strong> {session.student.name}</p>
                </li>
              ))}
            </ul>
          )}

          <h2 className="text-xl font-medium mt-8 mb-3">Past Sessions:</h2>
          {pastSessions.length === 0 ? (
            <p>No past sessions yet.</p>
          ) : (
            <ul className="space-y-4">
              {pastSessions.map(session => (
                <li
                  key={session._id}
                  className="border p-4 rounded shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p><strong>Subject:</strong> {session.subject}</p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(session.dateTime).toLocaleString()}
                    </p>
                    <p><strong>Student:</strong> {session.student.name}</p>
                  </div>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => navigate(`/feedback/${session._id}`)}
                  >
                    Request Feedback
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
