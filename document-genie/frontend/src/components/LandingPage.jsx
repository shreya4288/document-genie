import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const bgGradient = darkMode
    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
    : "bg-gradient-to-br from-blue-100 via-white to-pink-100";

  const textColor = darkMode ? "text-white" : "text-gray-800";
  const subTextColor = darkMode ? "text-gray-300" : "text-gray-600";
  const sectionBg = darkMode ? "bg-gray-900" : "bg-white";

  return (
    <div className={`min-h-screen ${bgGradient} flex flex-col`}>
      <header className="flex flex-wrap justify-between items-center px-6 sm:px-10 py-5">
        <motion.h1
          className={`text-xl sm:text-2xl font-bold ${
            darkMode ? "text-white" : "text-blue-700"
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          SmartDoc Assistant
        </motion.h1>
        <motion.button
          onClick={toggleDarkMode}
          className={`mt-2 sm:mt-0 ${
            darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"
          } px-4 py-2 rounded-lg transition`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </motion.button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center py-10 sm:py-14">
        <motion.h2
          className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${textColor} max-w-4xl leading-tight`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Learn Smarter with{" "}
          <span className="text-blue-600">SmartDoc Assistant</span>
        </motion.h2>
        <motion.p
          className={`mt-5 sm:mt-6 text-base sm:text-lg ${subTextColor} max-w-2xl`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Upload your PDFs, ask questions, generate flashcards, and take quizzes
          — all in one AI-powered learning assistant designed to supercharge
          your understanding.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row items-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <motion.button
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-base sm:text-lg transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
          <motion.a
            href="#features"
            className={`w-full sm:w-auto text-center border px-6 py-3 rounded-lg text-base sm:text-lg transition ${
              darkMode
                ? "border-blue-400 text-blue-400 hover:bg-gray-700"
                : "border-blue-600 text-blue-600 hover:bg-blue-50"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.a>
        </motion.div>
      </main>

      <section
        id="features"
        className={`${sectionBg} py-10 px-4 sm:px-6 lg:px-8 transition-colors`}
      >
        <h3
          className={`text-2xl sm:text-3xl font-semibold text-center ${textColor} mb-8 sm:mb-10`}
        >
          Features
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          <FeatureCard
            title="Chat with PDFs"
            description="Ask questions directly from your uploaded documents. Get page-specific, context-aware answers instantly."
            icon="📄"
            delay={0.1}
            darkMode={darkMode}
          />
          <FeatureCard
            title="Flashcard & Quiz Generation"
            description="Automatically generate flashcards and quizzes from your content. Review key concepts and test your knowledge seamlessly."
            icon="🧠"
            delay={0.2}
            darkMode={darkMode}
          />
          <FeatureCard
            title="Track Learning Progress"
            description="Get personalized learning reports based on your interactions, quiz scores, and flashcard reviews — all private and secure."
            icon="📊"
            delay={0.3}
            darkMode={darkMode}
          />
        </div>
      </section>

      <footer className="bg-blue-600 text-white text-center text-sm sm:text-base py-3 mt-auto">
        Built with ❤️ for intelligent document interaction. © 2025 SmartDoc
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, icon, delay = 0, darkMode }) {
  return (
    <motion.div
      className={`p-6 rounded-xl shadow hover:shadow-lg transition duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-800"
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h4 className="text-lg sm:text-xl font-semibold mb-2">{title}</h4>
      <p className="text-sm sm:text-base">{description}</p>
    </motion.div>
  );
}
