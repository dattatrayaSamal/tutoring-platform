import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Ensure this hook is properly imported
import onlineImage from "../assets/OnlineLearning-amico.png";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const { user, login, loading: authLoading } = useAuth();  // Using the login function from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Set loading to true on form submit
    setError("");  // Clear previous error message

    try {
      console.log('Form data:', form);
      await login(form);  // Call the login function from AuthContext
      console.log("Login successful, navigating to dashboard...");
    } catch (err) {
      setLoading(false);  // Stop loading on error
      console.error('Login error:', err);
      setError(err.response?.data?.message || "Login failed, please try again.");
    }
  };


  useEffect(() => {
    console.log("User in useEffect:", user);
    if (user) {
      navigate("/dashboard");  
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left side background image */}
      <div
        className="h-64 md:h-auto bg-no-repeat bg-center bg-contain md:bg-cover"
        style={{ backgroundImage: `url(${onlineImage})` }}
      ></div>

      {/* Right side form container */}
      <div className="w-full h-full flex items-center justify-center bg-white px-4 py-8 md:p-10">
        <div className="w-full max-w-sm">
          <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-800 mb-5">
            Login
          </h2>

          {/* Error message */}
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 p-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              value={form.email} // Controlled input
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 p-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              value={form.password} // Controlled input
              required
            />

            <button
              type="submit"
              disabled={loading || authLoading} // Disable button when loading
              className={`w-full py-2.5 text-sm rounded-md font-medium transition duration-300 ${loading || authLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            >
              {loading || authLoading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-sm text-gray-600 mt-2">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-blue-600 font-semibold hover:underline"
              >
                Register here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
