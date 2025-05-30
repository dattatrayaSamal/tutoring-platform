import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';  // Import AuthContext
import axios from '../services/api';
import onlineImage from '../assets/OnlineLearning-amico.png';

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register, loading } = useContext(AuthContext); // Access register function and loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Register the user
      await register(form);  // Use the register function from AuthContext

      // Navigate to dashboard after successful registration
      navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div
        className="h-64 md:h-auto bg-no-repeat bg-center bg-contain md:bg-cover"
        style={{ backgroundImage: `url(${onlineImage})` }}
      ></div>

      <div className="w-full h-full flex items-center justify-center bg-white px-4 py-8 md:p-10">
        <div className="w-full max-w-sm">
          <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-800 mb-5">
            Register
          </h2>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border border-gray-300 p-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 p-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 p-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <select
              className="w-full border border-gray-300 p-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="student">Student</option>
              <option value="tutor">Tutor</option>
            </select>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2.5 text-sm rounded-md font-medium hover:bg-green-700 transition duration-300"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="text-center text-sm text-gray-600 mt-2">
              Already have an account?{" "}
              <a
                href="/"
                className="text-green-600 font-semibold hover:underline"
              >
                Login here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
