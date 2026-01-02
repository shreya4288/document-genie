import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const mode = localStorage.getItem("darkMode") === "true";
    setDarkMode(mode);
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/generate-quiz?email=${
            user.email
          }`,
          { method: "POST" }
        );
        const data = await res.json();
        if (Array.isArray(data.response)) {
          setQuestions(data.response);
        } else if (typeof data.response === "string") {
          const parsed = JSON.parse(data.response);
          if (Array.isArray(parsed)) setQuestions(parsed);
        }
      } catch (err) {
        console.error("Quiz fetch error:", err);
      }
    };
    fetchQuestions();
  }, []);

  const handleOptionChange = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };
  const handleSubmit = async () => {
    let sc = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) sc++;
    });
    setScore(sc);
    setSubmitted(true);

    const topicStats = {};
    questions.forEach((q, idx) => {
      const topic = q.topic || "General";
      if (!topicStats[topic]) topicStats[topic] = { total: 0, incorrect: 0 };
      topicStats[topic].total++;
      if (answers[idx] !== q.answer) topicStats[topic].incorrect++;
    });

    const weakTopics = Object.entries(topicStats)
      .filter(([_, val]) => val.incorrect > 0)
      .map(([topic, val]) => ({
        topic,
        incorrect: val.incorrect,
        total: val.total,
      }));

    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/save-quiz-progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          score: sc,
          total_questions: questions.length,
          correct_answers: sc,
          weak_topics: weakTopics,
        }),
      });
    } catch (err) {
      console.error("Failed to save progress", err);
    }
  };
  

  const bgGradient = darkMode
    ? "bg-gradient-to-br from-gray-900 via-black to-gray-800"
    : "bg-gradient-to-br from-indigo-100 via-white to-pink-100";

  const cardBg = darkMode
    ? "bg-gray-900 text-white border-gray-700"
    : "bg-white text-gray-800 border-gray-200";

  const textPrimary = darkMode ? "text-white" : "text-gray-800";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-600";

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center px-4 py-10 sm:px-6 lg:px-8 ${bgGradient}`}
    >
      <motion.h2
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`text-3xl sm:text-4xl font-bold mb-8 ${
          darkMode ? "text-white" : "text-indigo-700"
        }`}
      >
        🧠 Quiz Time!
      </motion.h2>

      <AnimatePresence mode="wait">
        {!submitted && (
          <motion.div
            key="quiz"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, scale: 0.95 }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.15 },
              },
            }}
            className="w-full max-w-3xl space-y-8"
          >
            {questions.length === 0 ? (
              <motion.p
                className={`text-lg ${textSecondary}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Loading questions...
              </motion.p>
            ) : (
              <>
                {questions.map((q, idx) => (
                  <motion.div
                    key={idx}
                    className={`p-6 rounded-3xl border shadow-md ${cardBg}`}
                    variants={fadeUp}
                  >
                    <p className="font-semibold text-lg sm:text-xl mb-4">
                      {idx + 1}. {q.question}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => (
                        <label key={oIdx} className="block cursor-pointer">
                          <input
                            type="radio"
                            name={`q-${idx}`}
                            value={opt}
                            checked={answers[idx] === opt}
                            onChange={() => handleOptionChange(idx, opt)}
                            className="mr-2"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  className="text-center"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <button
                    onClick={handleSubmit}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition"
                  >
                    Submit Quiz
                  </button>
                </motion.div>
              </>
            )}
          </motion.div>
        )}

        {submitted && (
          <motion.div
            key="report"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-10 w-full max-w-4xl"
          >
            <p className="text-2xl font-semibold text-center text-pink-600 dark:text-pink-300 mb-6">
               You scored {score} out of {questions.length}
            </p>

            <div className={`rounded-2xl p-6 mb-8 border shadow-md ${cardBg}`}>
              <h3 className="text-xl font-bold mb-4">📋 Detailed Report</h3>
              <ul className="space-y-4">
                {questions.map((q, idx) => {
                  const isCorrect = answers[idx] === q.answer;
                  return (
                    <li
                      key={idx}
                      className={`rounded-xl p-4 border ${
                        isCorrect
                          ? "border-green-400 bg-green-50 dark:bg-green-900 text-black"
                          : "border-red-400 bg-red-50 dark:bg-red-900 text-black"
                      }`}
                    >
                      <p className="font-medium">
                        {idx + 1}. {q.question}
                      </p>
                      <p>
                        Your answer:{" "}
                        <span className="font-semibold">{answers[idx]}</span>{" "}
                        {isCorrect ? "✅" : "❌"}
                      </p>
                      {!isCorrect && (
                        <>
                          <p>
                            Correct answer:{" "}
                            <span className="font-semibold text-green-600 dark:text-green-300">
                              {q.answer}
                            </span>
                          </p>
                          {q.explanation && (
                            <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                              💡 {q.explanation}
                            </p>
                          )}
                        </>
                      )}
                      {q.topic && (
                        <p className="text-sm italic mt-1 text-indigo-500">
                          Topic: {q.topic}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {(() => {
              const topicStats = {};
              questions.forEach((q, idx) => {
                const topic = q.topic || "General";
                if (!topicStats[topic])
                  topicStats[topic] = { total: 0, incorrect: 0 };
                topicStats[topic].total++;
                if (answers[idx] !== q.answer) topicStats[topic].incorrect++;
              });
              const weakTopics = Object.entries(topicStats)
                .filter(([_, val]) => val.incorrect > 0)
                .sort((a, b) => b[1].incorrect - a[1].incorrect);

              return (
                <div className={`rounded-2xl p-6 border shadow-md ${cardBg}`}>
                  <h3 className="text-xl font-bold mb-4">📉 Weak Areas</h3>
                  {weakTopics.length === 0 ? (
                    <p className="text-green-600 dark:text-green-300">
                      Great job! You got everything right. 🎉
                    </p>
                  ) : (
                    <ul className="list-disc list-inside space-y-1">
                      {weakTopics.map(([topic, { total, incorrect }]) => (
                        <li key={topic}>
                          <span className="font-semibold">{topic}</span>:{" "}
                          {incorrect} out of {total} incorrect
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })()}

            <motion.div
              className="text-center mt-8"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              <button
                onClick={() => navigate("/chat")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition"
              >
                Back to Chat
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
