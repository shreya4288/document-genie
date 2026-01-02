import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

export default function UploadPDF() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const mode = localStorage.getItem("darkMode") === "true";
    setDarkMode(mode);
  }, []);

  const handleUpload = async () => {
    if (!file) return setMessage("❌ Please select a PDF to upload");

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.email) return setMessage("❌ User not logged in");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8000/upload/", {
        method: "POST",
        headers: {
          email: user.email,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setMessage("✅ " + data.message);
      setTimeout(() => navigate("/chat"), 1500);
    } catch (err) {
      setMessage("❌ Upload failed. Try again.");
    }

    setLoading(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleUpload();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [file]);

  const bgGradient = darkMode
    ? "bg-gradient-to-br from-gray-900 via-black to-gray-800"
    : "bg-gradient-to-br from-blue-100 via-white to-pink-100";

  const cardBg = darkMode
    ? "bg-gray-900 text-white border-gray-700"
    : "bg-white text-gray-800 border-gray-200";
  const buttonBase = "w-full py-3 rounded-xl text-lg font-medium transition";
  const success = message.startsWith("✅");

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 ${bgGradient}`}
    >
      <div
        className={`w-full max-w-md rounded-3xl shadow-2xl border ${cardBg} p-8`}
      >
        <h2
          className={`text-3xl font-bold text-center mb-6 ${
            darkMode ? "text-white" : "text-blue-700"
          }`}
        >
          Upload Your PDF
        </h2>

        <label
          className={`block cursor-pointer border-2 border-dashed  rounded-xl text-center p-6  transition ${
            darkMode
              ? "bg-gray-800 border-gray-600 hover:bg-gray-700"
              : "bg-blue-50 border-blue-300 hover:bg-blue-100"
          }`}
        >
          <span
            className={`font-medium text-lg ${
              darkMode ? "text-white " : "text-blue-700"
            }`}
          >
            {file ? file.name : "Click here to choose a PDF file"}
          </span>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
        </label>

        <button
          onClick={handleUpload}
          disabled={loading}
          className={`${buttonBase} mt-6 ${
            loading
              ? "bg-blue-400 cursor-not-allowed text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "Uploading..." : "Upload & Process"}
        </button>

        {loading && (
          <div className="mt-6 flex justify-center items-center">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-blue-600 dark:text-white font-medium text-sm">
              Processing your request...
            </span>
          </div>
        )}

        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              success ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
