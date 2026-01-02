import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const mode = localStorage.getItem("darkMode") === "true";
    setDarkMode(mode);
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    window.location.reload();
  };

  const handleLogout = async () => {
    if (user?.email) {
      try {
        await fetch("http://localhost:8000/clear_pdfs", {
          method: "DELETE",
          headers: {
            email: user.email,
          },
        });
      } catch (err) {
        console.error("❌ Failed to clear PDFs:", err);
      }
    }
    localStorage.removeItem("user");
    navigate("/login");
  };

  const bgGradient = darkMode
    ? "bg-gradient-to-r from-gray-900 via-black to-gray-800"
    : "bg-gradient-to-r from-indigo-50 via-white to-pink-100";

  const textColor = darkMode ? "text-white" : "text-indigo-700";
  const nameColor = darkMode ? "text-gray-200" : "text-gray-700";
  const themeButton = darkMode
    ? "bg-gray-700 text-white hover:bg-gray-600"
    : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200";

  return (
    <nav
      className={`${bgGradient} border-b border-gray-300 shadow-sm px-4 sm:px-6 lg:px-10 py-3`}
    >
      <div className="flex flex-wrap items-center justify-between max-w-7xl mx-auto">
        <motion.h1
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={`text-2xl font-extrabold cursor-pointer ${textColor}`}
          onClick={() => navigate("/")}
        >
          Smart Assistant
        </motion.h1>

        <div className="flex items-center gap-3 mt-3 sm:mt-0">
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            onClick={toggleTheme}
            className={`text-lg px-3 py-1 rounded-lg ${themeButton} transition`}
          >
            {darkMode ? "☀️" : "🌙"}
          </motion.button>

          {user ? (
            <>
              <span className={`font-medium text-sm sm:text-base ${nameColor}`}>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => navigate("/dashboard")}
                  className={`text-lg px-3 py-1 rounded-lg ${themeButton} transition`}
                >
                  Dashbord
                </motion.button>
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                onClick={handleLogout}
                className={`text-lg px-4 py-1 rounded-lg ${themeButton} transition hover:bg-red-600 hover:text-white`}
              >
                Logout
              </motion.button>
              
            </>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/login")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm sm:text-base transition shadow"
            >
              Login
            </motion.button>
          )}
        </div>
      </div>
    </nav>
  );
}
