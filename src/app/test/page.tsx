"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import { useRouter } from 'next/navigation';
import { FaSearch, FaChalkboardTeacher, FaCalendarAlt, FaBookOpen, FaExclamationTriangle } from 'react-icons/fa';

interface Topic {
  _id: string;
  class: string;
  topic: string;
  term: string;
}

export default function Test() {
  const router = useRouter();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    axios.get('https://math12-backend-production.up.railway.app/api/topics', { withCredentials: true })
      .then(response => {
        setTopics(response.data);
      })
      .catch(error => console.error('Error fetching topics:', error));
  }, []);

  const filteredTopics = topics.filter(topic =>
    topic.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.term.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClick = (id: string) => {
    setSelectedTopic(id === selectedTopic ? null : id);
  };

  const openTest = (topic: Topic) => {
    router.push(`/test/${topic._id}`);
  };

  return (
    <div className="min-h-screen py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 sm:mb-12 text-center text-blue-600 tracking-tight">
          Математические тесты
        </h1>
        <div className="mb-6 sm:mb-8 relative">
          <input
            type="text"
            placeholder="Поиск по теме, классу или четверти..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 sm:py-3 pl-10 sm:pl-12 text-base sm:text-lg border-2 border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out"
          />
          <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
        </div>
        <AnimatePresence>
          {filteredTopics.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
            >
              {filteredTopics.map(topic => (
                <motion.div
                  key={topic._id}
                  className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg cursor-pointer overflow-hidden"
                  onClick={() => handleClick(topic._id)}
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  layout
                >
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-blue-700">{topic.topic}</h2>
                  <div className="flex items-center mb-1 sm:mb-2 text-sm sm:text-base text-gray-600">
                    <FaChalkboardTeacher className="mr-2" />
                    <p>Класс: {topic.class}</p>
                  </div>
                  <div className="flex items-center mb-3 sm:mb-4 text-sm sm:text-base text-gray-600">
                    <FaCalendarAlt className="mr-2" />
                    <p>Четверть: {topic.term}</p>
                  </div>
                  <AnimatePresence>
                    {selectedTopic === topic._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.button
                          className="mt-2 sm:mt-4 w-full bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center text-sm sm:text-base"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            openTest(topic);
                          }}
                        >
                          <FaBookOpen className="mr-2" />
                          Начать тест!
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <FaExclamationTriangle className="mx-auto text-yellow-500 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Ничего не найдено</h2>
              <p className="text-gray-500">
                По вашему запросу "{searchQuery}" не найдено ни одного теста. Попробуйте изменить параметры поиска.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}