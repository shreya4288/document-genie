import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const mode = localStorage.getItem("darkMode") === "true";
    setDarkMode(mode);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        navigate("/login");
      } else {
        setMessage("❌ " + data.detail);
      }
    } catch {
      setMessage("❌ Signup failed.");
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
  const subTextColor = darkMode ? "text-gray-400" : "text-gray-600";

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 ${bgGradient} transition-colors duration-500`}
    >
      <motion.div
        className={`w-full max-w-md p-6 sm:p-8 lg:p-10 rounded-2xl shadow-2xl border ${cardBg}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2
          className={`text-2xl sm:text-3xl font-bold text-center mb-6 ${
            darkMode ? "text-white" : "text-blue-700"
          }`}
        >
          Sign Up
        </h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputBg}`}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputBg}`}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
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
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm font-medium text-red-500">
            {message}
          </p>
        )}
        <p className={`mt-4 text-center ${subTextColor}`}>
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Log in
          </a>
        </p>
      </motion.div>
    </div>
  );
}
