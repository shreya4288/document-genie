import { useState, useEffect, useRef } from "react";
import { Typewriter } from "react-simple-typewriter";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Loader from "./Loader";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  useEffect(() => {
    const mode = localStorage.getItem("darkMode") === "true";
    setDarkMode(mode);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading, currentAnswer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newUserMessage = { role: "user", content: input };
    const updatedChat = [...chatHistory, newUserMessage];

    setChatHistory(updatedChat);
    setLoading(true);
    setCurrentAnswer("");
    setInput("");

    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: input,
          top_k: 3,
          history: updatedChat.filter((msg) => msg.role === "user"),
        }),
      });

      const data = await res.json();
      setCurrentAnswer(data.answer);
    } catch (err) {
      setCurrentAnswer("❌ Failed to fetch response. Please try again.");
    }

    setLoading(false);
  };

  const handleTypeEnd = () => {
    if (currentAnswer) {
      setChatHistory((prev) => [
        ...prev,
        { role: "bot", content: currentAnswer },
      ]);
      setCurrentAnswer("");
    }
  };

  const handleGenerateQuiz = () => {
    navigate("/quiz");
  };

  const handleGenerateFlashcards = () => {
    navigate("/flashcards");
  };

  const bgGradient = darkMode
    ? "bg-gradient-to-br from-gray-900 via-black to-gray-800"
    : "bg-gradient-to-br from-blue-100 via-white to-pink-100";

  const cardBg = darkMode
    ? "bg-gray-900 text-white border-gray-700"
    : "bg-white text-gray-800 border-gray-200";
  const bubbleUser = darkMode
    ? "bg-blue-700 text-white"
    : "bg-blue-600 text-white";
  const bubbleBot = darkMode
    ? "bg-gray-800 text-white"
    : "bg-gray-100 text-gray-800";
  const inputBg = darkMode
    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
    : "bg-white border-gray-300";
  const iconColor = darkMode ? "text-white" : "text-blue-700";

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 ${bgGradient}`}
    >
      <motion.div
        className={`w-full max-w-4xl rounded-3xl shadow-2xl border ${cardBg} p-6 sm:p-10 transition-all flex flex-col h-full max-h-[90vh]`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          className={`text-3xl sm:text-4xl font-bold text-center mb-6 ${iconColor}`}
        >
          Smart Document Assistant
        </h1>

        <div className="flex-1 overflow-y-auto mb-6 space-y-4 px-1 sm:px-3 scrollbar-thin scrollbar-thumb-blue-400">
          {chatHistory.map((msg, idx) => (
            <motion.div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.03 }}
            >
              <div
                className={`rounded-2xl px-4 py-3 max-w-[85%] text-base shadow-md ${
                  msg.role === "user"
                    ? `${bubbleUser} rounded-br-none`
                    : `${bubbleBot} rounded-bl-none`
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div
                className={`${bubbleBot} px-4 py-3 max-w-[85%] shadow-md rounded-2xl animate-pulse`}
              >
                <Loader />
              </div>
            </div>
          )}

          {!loading && currentAnswer && (
            <div className="flex justify-start">
              <div
                className={`${bubbleBot} px-4 py-3 max-w-[85%] shadow-md rounded-2xl rounded-bl-none`}
              >
                <Typewriter
                  words={[currentAnswer]}
                  typeSpeed={20}
                  onLoopDone={handleTypeEnd}
                  onType={() => {}}
                />
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 mb-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up question..."
            className={`flex-1 px-5 py-4 text-lg rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg}`}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-4 rounded-xl text-lg font-medium transition w-full sm:w-auto"
          >
            {loading ? "..." : "Ask"}
          </button>
        </form>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            onClick={handleGenerateQuiz}
            className="flex-1 py-4 text-lg font-medium text-white rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm hover:shadow-md"
          >
            Generate Questions
          </button>
          <button
            onClick={handleGenerateFlashcards}
            className="flex-1 py-4 text-lg font-medium text-white rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm hover:shadow-md"
          >
            Generate Flashcards
          </button>
        </div>
      </motion.div>
    </div>
  );
}
