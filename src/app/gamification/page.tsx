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

export default function MathChallengePage() {
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
      console.error("Error fetching latest special test:", error);
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
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-black mb-12">
          Математический Челлендж
        </h1>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-black mb-4">
              Ваша серия побед
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-4xl font-bold text-blue-600">
                {userStreak?.streak || 0}
              </span>
              <span className="text-sm text-gray-500">
                Последнее обновление:{" "}
                {userStreak?.lastUpdateDate
                  ? new Date(userStreak.lastUpdateDate).toLocaleDateString()
                  : "Н/Д"}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-black mb-4">
              Таблица лидеров
            </h2>
            <ul className="space-y-2">
              {leaderboard.slice(0, 5).map((player, index) => (
                <li
                  key={player.userId}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-black">
                    {index + 1}. {player.username}
                  </span>
                  <span className="font-medium text-blue-600">
                    {player.streak}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-black mb-4">
              Ежедневный вызов
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Пройдите особый тест с вопросами из разных четвертей и классов.
              Обновляется каждый день в 9:05 утра по Астане.
            </p>
            <button
              onClick={handleStartSpecialTest}
              disabled={loading || !specialTestId || testCompleted}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Загрузка..."
                : testCompleted
                ? "Тест уже пройден"
                : "Начать тест"}
            </button>
          </motion.div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-sm font-medium text-black">
              Загрузка теста...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
