import { useEffect, useState, useContext } from "react";
import axios from "../services/api";
import { AuthContext } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  AcademicCapIcon,
  CalendarIcon,
  UserIcon,
  UserGroupIcon,
} from "@heroicons/react/20/solid";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Toggle demo mode
  const DEMO_MODE = true;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (DEMO_MODE) {
      const staticSessions = [
        {
          _id: "session1",
          subject: "Mathematics",
          dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
          tutor: { name: "Prof. John Doe" },
          student: { name: "Jane Smith" },
        },
        {
          _id: "session2",
          subject: "Physics",
          dateTime: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(), // 2 days ago
          tutor: { name: "Dr. Alice Johnson" },
          student: { name: "Jane Smith" },
        },
        {
          _id: "session3",
          subject: "History",
          dateTime: new Date(
            Date.now() - 4 * 24 * 60 * 60 * 1000
          ).toISOString(), // 4 days ago
          tutor: { name: "Mr. Arjun Mehta" },
          student: { name: "Jane Smith" },
        },
      ];

      const staticTutors = [
        {
          _id: "tutor1",
          name: "Prof. John Doe",
          specialization: "Mathematics",
        },
        {
          _id: "tutor3",
          name: "Ms. Sarah Lee",
          specialization: "Chemistry",
        },
        {
          _id: "tutor4",
          name: "Mr. Arjun Mehta",
          specialization: "Biology",
        },
      ];

      setSessions(staticSessions);
      setTutors(staticTutors);
      setLoading(false);
    } else {
      const fetchSessionsAndTutors = async () => {
        try {
          const sessionRes = await axios.get("/sessions", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setSessions(sessionRes.data);

          const tutorRes = await axios.get("/users/tutors", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setTutors(tutorRes.data);
        } catch (err) {
          console.error("Failed to fetch sessions or tutors:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchSessionsAndTutors();
    }
  }, [navigate]);

  if (loading) return <div>Loading your dashboard...</div>;

  const now = new Date();
  const upcomingSessions = sessions.filter((s) => new Date(s.dateTime) >= now);
  const pastSessions = sessions.filter((s) => new Date(s.dateTime) < now);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 min-h-screen">
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto bg-white shadow-lg rounded-lg mt-10">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">
          {user.role === "student"
            ? "🎓 Student Dashboard"
            : "🧑‍🏫 Tutor Dashboard"}
        </h1>

        {/* Student Dashboard */}
        {user.role === "student" && (
          <>
            <div className="flex items-center gap-2 text-xl font-medium mb-4">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
              <span>Select a Tutor</span>
            </div>
            {tutors.length === 0 ? (
              <p>No tutors available right now. Please check again later.</p>
            ) : (
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutors.map((tutor) => (
                  <div
                    key={tutor._id}
                    className="border p-5 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    <div className="flex flex-col items-center">
                      <UserIcon className="h-12 w-12 text-blue-500 mb-4" />
                      <p className="font-semibold text-lg text-center">
                        {tutor.name}
                      </p>
                      <p className="text-sm text-gray-600 text-center">
                        Specialization: {tutor.specialization}
                      </p>
                      <a
                        href={`/book-session/${tutor._id}`}
                        className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                      >
                        Book a Session
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upcoming Sessions */}
            <div className="mt-10">
              <div className="flex items-center gap-2 text-xl font-medium mb-4">
                <CalendarIcon className="h-6 w-6 text-green-600" />
                <span>Upcoming Sessions</span>
              </div>
              {upcomingSessions.length === 0 ? (
                <p>No upcoming sessions. Book one now!</p>
              ) : (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session._id}
                      className="border p-4 rounded-lg shadow bg-green-50"
                    >
                      <p>
                        <strong>📘 Subject:</strong> {session.subject}
                      </p>
                      <p>
                        <strong>📅 Date:</strong>{" "}
                        {new Date(session.dateTime).toLocaleString()}
                      </p>
                      <p>
                        <strong>🧑‍🏫 Tutor:</strong> {session.tutor.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past Sessions */}
            <div className="mt-10">
              <div className="flex items-center gap-2 text-xl font-medium mb-4">
                <CalendarIcon className="h-6 w-6 text-gray-600" />
                <span>Past Sessions</span>
              </div>
              {pastSessions.length === 0 ? (
                <p>No past sessions yet.</p>
              ) : (
                <div className="space-y-4">
                  {pastSessions.map((session) => (
                    <div
                      key={session._id}
                      className="border p-4 rounded-lg shadow bg-gray-100"
                    >
                      <p>
                        <strong>📘 Subject:</strong> {session.subject}
                      </p>
                      <p>
                        <strong>📅 Date:</strong>{" "}
                        {new Date(session.dateTime).toLocaleString()}
                      </p>
                      <p>
                        <strong>🧑‍🏫 Tutor:</strong> {session.tutor.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Tutor Dashboard */}
        {user.role === "tutor" && (
          <>
            <div className="mt-10">
              <div className="flex items-center gap-2 text-xl font-medium mb-4">
                <CalendarIcon className="h-6 w-6 text-green-600" />
                <span>Upcoming Sessions</span>
              </div>
              {upcomingSessions.length === 0 ? (
                <p>No sessions scheduled yet.</p>
              ) : (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session._id}
                      className="border p-4 rounded-lg shadow bg-green-50"
                    >
                      <p>
                        <strong>📘 Subject:</strong> {session.subject}
                      </p>
                      <p>
                        <strong>📅 Date:</strong>{" "}
                        {new Date(session.dateTime).toLocaleString()}
                      </p>
                      <p>
                        <strong>👨‍🎓 Student:</strong> {session.student.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-10">
              <div className="flex items-center gap-2 text-xl font-medium mb-4">
                <CalendarIcon className="h-6 w-6 text-gray-600" />
                <span>Past Sessions</span>
              </div>
              {pastSessions.length === 0 ? (
                <p>No past sessions yet.</p>
              ) : (
                <div className="space-y-4">
                  {pastSessions.map((session) => (
                    <div
                      key={session._id}
                      className="border p-4 rounded-lg shadow bg-gray-100"
                    >
                      <p>
                        <strong>📘 Subject:</strong> {session.subject}
                      </p>
                      <p>
                        <strong>📅 Date:</strong>{" "}
                        {new Date(session.dateTime).toLocaleString()}
                      </p>
                      <p>
                        <strong>👨‍🎓 Student:</strong> {session.student.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {/* Footer */}
      <footer className="mt-16 border-t pt-6 text-center text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} Peer Tutoring Platform. All rights
          reserved.
        </p>
        <div className="flex justify-center gap-4 mt-2 text-blue-600">
          <a href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:underline">
            Terms of Service
          </a>
          <a href="/contact" className="hover:underline">
            Contact Us
          </a>
        </div>
      </footer>
    </div>
  );
}
