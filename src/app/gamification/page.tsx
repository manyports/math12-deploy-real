"use client";

import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface LeaderboardItem {
  userId: string;
  username: string;
  streak: number;
}

interface UserStreak {
  streak: number;
  lastUpdateDate: string;
}

export default function GamificationPage() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [userStreak, setUserStreak] = useState<UserStreak | null>(null);
  const [loading, setLoading] = useState(false);
  const [specialTestId, setSpecialTestId] = useState<string | null>(null);
  const [testCompleted, setTestCompleted] = useState(false);

  useEffect(() => {
    fetchLeaderboardAndStreak();
    fetchLatestSpecialTest();
    checkDailyTestStatus();
    console.log("Fetching data...");
  }, []);

  const checkDailyTestStatus = async () => {
    try {
      const response = await axios.get(
        "https://www.api.math12.studio/api/checkDailyTestStatus",
        { withCredentials: true }
      );
      setTestCompleted(response.data.completed);
    } catch (error) {
      console.error("Error checking daily test status:", error);
    }
  };

  const fetchLeaderboardAndStreak = async () => {
    try {
      const leaderboardResponse = await axios.get<LeaderboardItem[]>(
        "https://www.api.math12.studio/api/leaderboard",
        { withCredentials: true }
      );
      setLeaderboard(leaderboardResponse.data);

      const streakResponse = await axios.get<UserStreak>(
        "https://www.api.math12.studio/api/getUserStreak",
        { withCredentials: true }
      );
      setUserStreak(streakResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchLatestSpecialTest = async () => {
    try {
      const response = await axios.get(
        "https://www.api.math12.studio/api/getDailyTest",
        { withCredentials: true }
      );
      setSpecialTestId(response.data.id);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("Error fetching latest special test:", error);
      }
    }
  };

  const handleStartSpecialTest = async () => {
    setLoading(true);
    try {
      if (specialTestId) {
        router.push(`/special-test/${specialTestId}`);
      } else {
        throw new Error("No special test available");
      }
    } catch (error) {
      console.error("Error starting special test:", error);
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b py-12 px-4 sm:px-6 lg:px-8 mt-12"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className="text-4xl md:text-6xl font-extrabold text-center text-blue-600 mb-12"
        >
          Математический Челлендж
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-blue-600 text-white p-6">
              <h2 className="text-2xl font-bold">Ваша серия побед</h2>
            </div>
            <div className="w-full flex justify-center">
              <div className="w-1/2 my-2"></div>
            </div>
            <div className="p-6 flex flex-col justify-center items-center">
              <p className="text-5xl font-bold text-center text-blue-600">
                {userStreak?.streak || 0}
              </p>
              <p className="text-center mt-2 text-gray-600">огоньков 🔥</p>
              {userStreak && (
                <p className="text-center mt-2 text-sm text-gray-500">
                  Последнее обновление:{" "}
                  {new Date(userStreak.lastUpdateDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-blue-600 text-white p-6">
              <h2 className="text-2xl font-bold">Таблица лидеров</h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {leaderboard.slice(0, 5).map((player, index) => (
                <li
                  key={player.userId}
                  className="flex justify-between items-center p-4"
                >
                  <span className="font-semibold">
                    {index + 1}. {player.username}
                  </span>
                  <span className="text-blue-600 font-bold">
                    {player.streak} 🔥
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-blue-500 rounded-xl shadow-lg p-8 text-white"
        >
          <h2 className="text-3xl font-bold mb-4 text-center">
            Готовы к вызову?
          </h2>
          <p className="text-center mb-6 text-xl">
            Пройдите особенный тест с вопросами из разных четвертей и классов!
            (Сброс каждый день в 9:05 утра по Астане)
          </p>
          <div className="flex justify-center">
            <button
              className="bg-white text-blue-600 font-bold py-3 px-6 rounded-full hover:bg-blue-100 transition duration-300 disabled:opacity-50 text-lg"
              onClick={handleStartSpecialTest}
              disabled={loading || !specialTestId || testCompleted}
            >
              {loading
                ? "Загрузка..."
                : testCompleted
                ? "Тест уже пройден"
                : "Начать особенный тест"}
            </button>
          </div>
        </motion.div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg font-semibold text-blue-600">
              Загрузка теста...
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
