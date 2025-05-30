import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <nav className="bg-indigo-700 text-white px-6 py-4 shadow-lg">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <div className="text-xl font-bold">Online Learning App</div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-4 items-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="hover:bg-indigo-500 px-4 py-2 rounded transition"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="hover:bg-indigo-500 px-4 py-2 rounded transition"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden mt-4 flex flex-col space-y-2 px-6">
          <button
            onClick={() => {
              navigate("/dashboard");
              setIsOpen(false);
            }}
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded transition"
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              navigate("/profile");
              setIsOpen(false);
            }}
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded transition"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
