import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const mode = localStorage.getItem("darkMode") === "true";
    setDarkMode(mode);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/upload");
      } else {
        setMessage("❌ " + data.detail);
      }
    } catch {
      setMessage("❌ Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const bgGradient = darkMode
    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
    : "bg-gradient-to-br from-blue-100 via-white to-pink-100";

  const cardBg = darkMode
    ? "bg-gray-900 text-white border-gray-700"
    : "bg-white text-gray-800 border-gray-100";
  const inputBg = darkMode
    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
    : "bg-gray-100 border-gray-300";
  const textColor = darkMode ? "text-white" : "text-gray-800";
  const subTextColor = darkMode ? "text-gray-400" : "text-gray-600";

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 ${bgGradient}`}
    >
      <motion.div
        className={`p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md border ${cardBg}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2
          className={`text-2xl sm:text-3xl font-bold text-center mb-6 ${
            darkMode ? "text-white" : "text-blue-700"
          }`}
        >
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputBg}`}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputBg}`}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white py-3 rounded-lg text-base sm:text-lg transition`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm font-medium text-red-500">
            {message}
          </p>
        )}
        <p className={`mt-4 text-center ${subTextColor}`}>
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </a>
        </p>
      </motion.div>
    </div>
  );
}
