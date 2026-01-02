import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function GenerateFlashcards() {
  const [darkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flippedCards, setFlippedCards] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));

  const toggleFlip = (idx) => {
    setFlippedCards((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const bgGradient = darkMode
    ? "bg-gradient-to-br from-gray-900 via-black to-gray-800"
    : "bg-gradient-to-br from-blue-100 via-white to-pink-100";

  const textColor = darkMode ? "text-white" : "text-gray-800";
  const cardBg = darkMode
    ? "bg-gray-900 text-white border-gray-700"
    : "bg-white text-gray-800 border-gray-200";

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/generate-flashcards?email=${
            user.email
          }`,
          { method: "POST" }
        );
        const data = await res.json();
        const parsed =
          typeof data.response === "string"
            ? JSON.parse(data.response)
            : data.response;
        setFlashcards(parsed || []);
      } catch (err) {
        console.error("❌ Failed to fetch flashcards:", err);
        alert("Something went wrong while generating flashcards.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [user.email]);

  return (
    <div className={`min-h-screen px-4 sm:px-6  lg:px-8 py-10 ${bgGradient}`}>
      <motion.h2
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`text-3xl font-bold mb-8 text-center ${
          darkMode ? "text-white" : "text-indigo-700"
        }`}
      >
        📚 Flashcards
      </motion.h2>

      {loading && (
        <motion.p
          className="text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Loading flashcards...
        </motion.p>
      )}

      {!loading && flashcards.length > 0 && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {flashcards.map((card, idx) => {
            const flipped = flippedCards[idx];
            return (
              <motion.div
                key={idx}
                className="perspective"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  onClick={() => toggleFlip(idx)}
                  className={`relative w-full h-40 sm:h-48 rounded-3xl border shadow-md ${cardBg} cursor-pointer transform-style preserve-3d transition-transform duration-500`}
                  animate={{ rotateY: flipped ? 180 : 0 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center p-4 backface-hidden">
                    <p className="font-semibold text-lg text-center">
                      Q: {card.question}
                    </p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center p-4 backface-hidden transform rotateY-180">
                    <p className="text-sm text-center">A: {card.answer}</p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {!loading && flashcards.length === 0 && (
        <p className={`${textColor} text-lg mt-6`}>No flashcards available.</p>
      )}
    </div>
  );
}
