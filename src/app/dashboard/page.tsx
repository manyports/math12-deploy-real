"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface TestTaken {
  _id: string;
  topicId: {
    _id: string;
    topic: string;
    class: string;
    term: string;
  };
  score: number;
  totalQuestions: number;
  date: string;
}

export default function DashboardPage() {
  const [userTests, setUserTests] = useState<TestTaken[]>([]);
  const [loading, setLoading] = useState(true);
  const [logoutError, setLogoutError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserTests = async () => {
      try {
        const response = await axios.get('https://www.api.webdoors.tech/api/getUserTests', { withCredentials: true });
        setUserTests(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user tests:', error);
        setLoading(false);
      }
    };

    fetchUserTests();
  }, []);

  
  const logout = async () => {
    try {
      const response = await axios.get('https://www.api.webdoors.tech/api/logout', { withCredentials: true });
      if (response.status === 200) {
        router.push('/login');
      } else {
        console.log('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      console.log('An error occurred during logout. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between mx-4 md:mx-12 mt-8">
      <div className="flex-1 flex items-center justify-center flex-col mb-8">
        <div>
          <p className="font-bold text-2xl md:text-4xl text-blue-600 text-center">Добро пожаловать на личный кабинет.</p>
          <p className="text-gray-500 text-lg md:text-xl text-center">Здесь вы можете работать с нашей платформой :)</p>
        </div>
        <div className="flex flex-col md:flex-row gap-6 mt-6 w-full">
          <div className="bg-card text-card-foreground rounded-lg p-6 shadow-md w-full md:w-1/4 flex flex-col items-center justify-between">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 mb-4 text-blue-600">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
              <path d="m15 5 4 4"></path>
            </svg>
            <h2 className="text-2xl font-bold mb-4">Пройти тест</h2>
            <p className="mb-4 text-center">Продемонстрируйте свои знания и докажите свое академическое мастерство, пройдя наш тест.</p>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-100 text-blue-600 hover:bg-gray-200 h-10 px-4 py-2 border border-blue-600" onClick={() => window.location.href = "/test"}>
              🔥 начать
            </button>
          </div>
          <div className="bg-card text-card-foreground rounded-lg p-6 shadow-md w-full md:w-1/4 flex flex-col items-center justify-between">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 mb-4 text-blue-600">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" x2="9" y1="12" y2="12"></line>
            </svg>
            <h2 className="text-2xl font-bold mb-4 text-center">Выйти</h2>
            <p className="mb-4 text-center">Нажмите кнопку ниже, чтобы безопасно и надежно выйти из своей учетной записи.</p>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-100 text-blue-600 hover:bg-gray-200 h-10 px-4 py-2 border border-blue-600" onClick={logout}>
              👋 пока
            </button>
          </div>
          <div className="bg-card text-card-foreground rounded-lg shadow-md w-full md:w-1/4 p-6 flex flex-col items-center justify-between">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 mb-4 text-blue-600">
              <circle cx="12" cy="10" r="8"></circle>
              <circle cx="12" cy="10" r="3"></circle>
              <path d="M7 22h10"></path>
              <path d="M12 22v-4"></path>
            </svg>
            <h2 className="text-2xl font-bold mb-4">Спросить вопросы</h2>
            <p className="mb-4 text-center">Примите участие в увлекательной беседе с нашим интеллектуальным помощником MathAI и откройте для себя новое восприятие математики.</p>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-100 text-blue-600 hover:bg-gray-200 h-10 px-4 py-2 border border-blue-600" onClick={() => window.location.href = "/chats"}>
              💯 напиши
            </button>
          </div>
          <div className="bg-card text-card-foreground rounded-lg shadow-md w-full md:w-1/4 p-6 flex flex-col items-center justify-between">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 mb-4 text-blue-600">
              <circle cx="12" cy="10" r="8"></circle>
              <circle cx="12" cy="10" r="3"></circle>
              <path d="M7 22h10"></path>
              <path d="M12 22v-4"></path>
            </svg>
            <h2 className="text-2xl font-bold mb-4 text-center">Решение по картинкам</h2>
            <p className="mb-4 text-center">Сфотографируйте любую задачу по математике и ИИ решит ее за считанные секунды 😎</p>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-100 text-blue-600 hover:bg-gray-200 h-10 px-4 py-2 border border-blue-600" onClick={() => window.location.href = "/imagesolver"}>
              🎥 фотографируй
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div>
          <p className="font-bold text-2xl md:text-4xl text-blue-600">Ваши пройденные тесты</p>
        </div>
        <div className="mt-6 mb-6 overflow-auto max-h-96">
          <div className="border-t border-gray-200">
            {userTests.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {userTests.map((test) => (
                  <motion.li
                    key={test._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="px-4 py-4 sm:px-6 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-semibold text-blue-600 truncate">
                        {test.topicId.topic}
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {test.score} / {test.totalQuestions}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Класс: {test.topicId.class}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          Четверть: {test.topicId.term}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Дата: {new Date(test.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
                У вас пока нет пройденных тестов.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
