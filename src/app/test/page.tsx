"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import { useRouter } from 'next/navigation';

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
    setSelectedTopic(id);
  };

  const openTest = (topic: Topic) => {
    router.push(`/test/${topic._id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Математические тесты</h1>
      <div className="mb-8">
        <input
          type="text"
          placeholder="Поиск..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map(topic => (
          <motion.div
            key={topic._id}
            className="border border-gray-200 p-6 rounded-lg shadow-md cursor-pointer"
            onClick={() => handleClick(topic._id)}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-xl font-semibold mb-2 text-blue-600">{topic.topic}</h2>
            <p className="text-gray-600">Класс: {topic.class}</p>
            <p className="text-gray-600">Четверть: {topic.term}</p>
            <AnimatePresence>
              {selectedTopic === topic._id && (
                <motion.button
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  onClick={() => openTest(topic)}
                >
                  Начать тест!
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}