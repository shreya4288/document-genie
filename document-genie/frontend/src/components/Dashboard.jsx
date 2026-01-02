import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [progress, setProgress] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [weakTopicStats, setWeakTopicStats] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const mode = localStorage.getItem("darkMode") === "true";
    setDarkMode(mode);

    const fetchProgress = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/progress/${user.email}`
      );
      const data = await res.json();
      setProgress(data.progress);
    };
    fetchProgress();
  }, []);

  useEffect(() => {
    const topicMap = {};
    progress.forEach((entry) => {
      if (entry.activity_type === "quiz" && entry.weak_topics) {
        entry.weak_topics.forEach((topicObj) => {
          const { topic, incorrect, total } = topicObj;
          if (!topicMap[topic]) topicMap[topic] = { incorrect: 0, total: 0 };
          topicMap[topic].incorrect += incorrect;
          topicMap[topic].total += total;
        });
      }
    });
    setWeakTopicStats(topicMap);
  }, [progress]);

  const quizData = progress
    .filter((p) => p.activity_type === "quiz")
    .map((entry) => ({
      date: new Date(entry.timestamp).toLocaleDateString(),
      score: entry.score,
      total: entry.total_questions,
    }));

  const pieData = Object.entries(weakTopicStats).map(([topic, stats]) => ({
    name: topic,
    value: stats.incorrect,
  }));

  const COLORS = [
    "#6366F1", // Indigo-500
    "#F472B6", // Pink-400
    "#34D399", // Emerald-400
    "#FBBF24", // Amber-400
    "#60A5FA", // Blue-400
    "#A78BFA", // Purple-400
    "#F87171", // Red-400
    "#10B981", // Green-500
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const bgClass = darkMode
    ? "bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white"
    : "bg-gradient-to-br from-indigo-100 via-white to-pink-100 text-gray-800";

  const axisStyle = {
    fill: darkMode ? "#cbd5e1" : "#334155",
    fontSize: 14,
  };

  const gridStroke = darkMode ? "#374151" : "#e5e7eb";

  const tooltipContentStyle = {
    backgroundColor: darkMode ? "#1f2937" : "#f9fafb",
    borderColor: darkMode ? "#4b5563" : "#d1d5db",
    borderRadius: 8,
    padding: 10,
    color: darkMode ? "#f9fafb" : "#111827",
    fontSize: 14,
  };

  return (
    <motion.div
      className={`min-h-screen px-4 sm:px-8 py-10 ${bgClass}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold mb-2">📊 Your Learning Dashboard</h2>
        <p
          className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}
        >
          👋 Welcome back,{" "}
          <span className="font-semibold">{user?.name || "User"}</span>!
        </p>
      </motion.div>

      {quizData.length === 0 ? (
        <motion.p
          className="text-center text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          No quiz activity yet.
        </motion.p>
      ) : (
        <div className="flex flex-col gap-12 max-w-6xl mx-auto w-full">
          {/* Line Chart */}
          <motion.div
            className={`rounded-2xl shadow-lg p-6 border ${
              darkMode
                ? "bg-gray-900 border-gray-700"
                : "bg-white border-gray-300"
            }`}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <h3
              className={`text-2xl font-semibold mb-4 ${
                darkMode ? "text-indigo-400" : "text-indigo-600"
              }`}
            >
              📈 Quiz Score Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={quizData}>
                <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  stroke={axisStyle.fill}
                  tick={{ ...axisStyle }}
                />
                <YAxis
                  domain={[0, 10]}
                  stroke={axisStyle.fill}
                  tick={{ ...axisStyle }}
                />
                <Tooltip contentStyle={tooltipContentStyle} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            className={`rounded-2xl shadow-lg p-6 border ${
              darkMode
                ? "bg-gray-900 border-gray-700"
                : "bg-white border-gray-300"
            }`}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <h3
              className={`text-2xl font-semibold mb-4 ${
                darkMode ? "text-emerald-400" : "text-emerald-600"
              }`}
            >
              🎯 Accuracy Per Quiz
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={quizData}>
                <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  stroke={axisStyle.fill}
                  tick={{ ...axisStyle }}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke={axisStyle.fill}
                  tick={{ ...axisStyle }}
                />
                <Tooltip contentStyle={tooltipContentStyle} />
                <Bar
                  dataKey={(d) => (d.score / d.total) * 100}
                  fill="#10b981"
                  name="Accuracy (%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Weak Topics Table */}
          {Object.keys(weakTopicStats).length > 0 && (
            <motion.div
              className={`rounded-2xl shadow-lg p-6 border ${
                darkMode
                  ? "bg-gray-900 border-gray-700"
                  : "bg-white border-gray-300"
              }`}
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <h3
                className={`text-2xl font-semibold mb-4 ${
                  darkMode ? "text-rose-400" : "text-rose-600"
                }`}
              >
                📉 Persistent Weak Topics
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left table-auto border-collapse">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Topic</th>
                      <th className="px-4 py-2">Incorrect</th>
                      <th className="px-4 py-2">Total</th>
                      <th className="px-4 py-2">Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(weakTopicStats)
                      .sort((a, b) => b[1].incorrect - a[1].incorrect)
                      .map(([topic, { incorrect, total }]) => {
                        const accuracy = (
                          ((total - incorrect) / total) *
                          100
                        ).toFixed(1);
                        return (
                          <tr key={topic} className="border-t">
                            <td className="px-4 py-2">{topic}</td>
                            <td className="px-4 py-2">{incorrect}</td>
                            <td className="px-4 py-2">{total}</td>
                            <td className="px-4 py-2 font-semibold">
                              <span
                                className={`${
                                  accuracy < 60
                                    ? "text-red-500"
                                    : accuracy < 80
                                    ? "text-yellow-500"
                                    : "text-green-600"
                                }`}
                              >
                                {accuracy}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Pie Chart */}
          {pieData.length > 0 && (
            <motion.div
              className={`rounded-2xl shadow-lg p-6 border ${
                darkMode
                  ? "bg-gray-900 border-gray-700"
                  : "bg-white border-gray-300"
              }`}
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <h3
                className={`text-2xl font-semibold mb-4 ${
                  darkMode ? "text-yellow-300" : "text-yellow-600"
                }`}
              >
                🍩 Weak Topics Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie dataKey="value" data={pieData} outerRadius={100} label>
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip contentStyle={tooltipContentStyle} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>
      )}

      <motion.div
        className="mt-12 text-center"
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.03 }}
      >
        <button
          onClick={() => navigate("/chat")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition"
        >
          Back to Chat
        </button>
      </motion.div>
    </motion.div>
  );
}
