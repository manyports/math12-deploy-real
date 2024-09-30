"use client";

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Book, Calendar, GraduationCap, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Математические тесты
      </h1>
      <div className="mb-8 relative max-w-md mx-auto">
        <Input
          type="text"
          placeholder="Поиск по теме, классу или четверти..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="truncate" title={topic.topic}>
                      {topic.topic}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <GraduationCap size={16} className="mr-2" />
                      <span>Класс: {topic.class}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar size={16} className="mr-2" />
                      <span>Четверть: {topic.term}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => openTest(topic)}>
                      <Book className="mr-2" size={16} />
                      Начать тест
                    </Button>
                  </CardFooter>
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
            <Search className="mx-auto text-primary mb-4" size={48} />
            <h2 className="text-xl font-semibold mb-2">Ничего не найдено</h2>
            <p className="text-muted-foreground">
              По вашему запросу &quot;{searchQuery}&quot; не найдено ни одного
              теста. Попробуйте изменить параметры поиска.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
