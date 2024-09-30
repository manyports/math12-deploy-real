"use client";

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Book, Calendar, GraduationCap, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Topic {
  _id: string;
  class: string;
  topic: string;
  term: string;
}

export default function Test() {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    axios
      .get("https://www.api.math12.studio/api/topics", {
        withCredentials: true,
      })
      .then((response) => {
        setTopics(response.data);
      })
      .catch((error) => console.error("Error fetching topics:", error));
  }, []);

  const filteredTopics = topics.filter(
    (topic) =>
      topic.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.term.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openTest = (topic: Topic) => {
    router.push(`/test/${topic._id}`);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-black">
          Математические тесты
        </h1>
        <div className="mb-8 relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Поиск по теме, классу или четверти..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 text-black border-b-2 border-gray-200 focus:border-blue-600 focus:outline-none transition duration-300"
          />
          <Search
            className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
        <AnimatePresence>
          {filteredTopics.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {filteredTopics.map((topic) => (
                <motion.div
                  key={topic._id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-6 space-y-4">
                    <h2
                      className="text-xl font-semibold text-black truncate"
                      title={topic.topic}
                    >
                      {topic.topic}
                    </h2>
                    <div className="flex items-center text-sm text-gray-600">
                      <GraduationCap size={16} className="mr-2" />
                      <span>Класс: {topic.class}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={16} className="mr-2" />
                      <span>Четверть: {topic.term}</span>
                    </div>
                    <button
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
                      onClick={() => openTest(topic)}
                    >
                      <Book className="mr-2" size={16} />
                      Начать тест
                    </button>
                  </div>
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
              <Search className="mx-auto text-blue-600 mb-4" size={48} />
              <h2 className="text-xl font-semibold text-black mb-2">
                Ничего не найдено
              </h2>
              <p className="text-gray-600">
                По вашему запросу &quot;{searchQuery}&quot; не найдено ни одного
                теста. Попробуйте изменить параметры поиска.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
