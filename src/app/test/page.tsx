"use client";

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Book, Calendar, GraduationCap, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "./skeleton";

interface Topic {
  _id: string;
  class: string;
  topic: string;
  term: string;
}

export default function Component() {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("https://www.api.math12.studio/api/topics", {
        withCredentials: true,
      })
      .then((response) => {
        setTopics(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching topics:", error);
        setIsLoading(false);
      });
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

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-12 bg-white">
      <h1 className="text-3xl font-bold mb-8 text-center text-black">
        Математические тесты
      </h1>
      <div className="mb-8 relative max-w-md mx-auto">
        <Input
          type="text"
          placeholder="Поиск по теме, классу или четверти..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-blue-600 focus:ring-blue-600 focus:border-blue-600"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600"
          size={20}
        />
      </div>
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {[...Array(9)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Skeleton />
              </motion.div>
            ))}
          </motion.div>
        ) : filteredTopics.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredTopics.map((topic) => (
              <motion.div
                key={topic._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="group"
              >
                <Card
                  className="h-full transition-shadow duration-300 hover:shadow-md border-blue-600 border-opacity-50 cursor-pointer"
                  onClick={() => toggleCard(topic._id)}
                >
                  <CardHeader>
                    <CardTitle
                      className="truncate text-black"
                      title={topic.topic}
                    >
                      {topic.topic}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center text-sm text-black">
                      <GraduationCap size={16} className="mr-2 text-blue-600" />
                      <span>Класс: {topic.class}</span>
                    </div>
                    <div className="flex items-center text-sm text-black">
                      <Calendar size={16} className="mr-2 text-blue-600" />
                      <span>Четверть: {topic.term}</span>
                    </div>
                    <AnimatePresence>
                      {expandedCard === topic._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Button
                            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              openTest(topic);
                            }}
                          >
                            <Book className="mr-2" size={16} />
                            Начать тест
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
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
            <h2 className="text-xl font-semibold mb-2 text-black">
              Ничего не найдено
            </h2>
            <p className="text-black">
              По вашему запросу &quot;{searchQuery}&quot; не найдено ни одного
              теста. Попробуйте изменить параметры поиска.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
