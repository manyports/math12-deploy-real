"use client";

import { Button } from "@/components/ui/button";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  Brain,
  Camera,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  School,
  Trophy,
  Zap,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const TypingEffect = ({ words }) => {
  const [currentWord, setCurrentWord] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (isDeleting) {
        setCurrentText((prev) => prev.slice(0, -1));
        if (currentText === "") {
          setIsDeleting(false);
          setCurrentWord((prev) => (prev + 1) % words.length);
        }
      } else {
        setCurrentText((prev) => words[currentWord].slice(0, prev.length + 1));
        if (currentText === words[currentWord]) {
          setIsDeleting(true);
        }
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [currentText, isDeleting, currentWord, words]);

  return (
    <motion.span
      key={currentText}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-blue-600 font-bold"
    >
      {currentText}
    </motion.span>
  );
};

const features = [
  {
    title: "Решение задач по фото",
    description:
      "Сфотографируйте задачу и получите мгновенное решение с объяснениями",
    icon: Camera,
    content: (
      <div className="relative w-full max-w-md h-80 bg-white rounded-lg shadow-xl overflow-hidden">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute top-4 left-4 right-4 h-40 bg-gray-200 rounded-lg flex items-center justify-center"
        >
          <Camera size={64} className="text-gray-400" />
        </motion.div>
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white p-4 h-48"
        >
          <h4 className="text-lg font-bold mb-2">Решение:</h4>
          <p className="text-sm">
            1. Найдем производную функции f(x) = x² + 3x + 2 2. f'(x) = 2x + 3
            3. Приравняем к нулю: 2x + 3 = 0 4. Решим уравнение: x = -3/2
          </p>
        </motion.div>
      </div>
    ),
  },
  {
    title: "ИИ-ассистент в чате",
    description:
      "Задавайте вопросы и получайте мгновенные ответы от нашего умного помощника",
    icon: MessageSquare,
    content: (
      <div className="space-y-4 w-full max-w-md bg-white p-6 rounded-lg shadow-xl">
        <motion.div
          className="bg-gray-100 p-3 rounded-lg"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Как решить квадратное уравнение ax² + bx + c = 0?
        </motion.div>
        <motion.div
          className="bg-blue-600 p-3 rounded-lg ml-auto text-white"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        >
          Для решения используйте формулу: x = (-b ± √(b² - 4ac)) / (2a). Где a,
          b, c - коэффициенты уравнения.
        </motion.div>
      </div>
    ),
  },
  {
    title: "Адаптивные тесты",
    description:
      "Персонализированная система тестирования для эффективного обучения",
    icon: Brain,
    content: (
      <div className="relative w-full max-w-md h-80 bg-white rounded-lg shadow-xl overflow-hidden p-4">
        <h4 className="text-lg font-bold mb-4">Тест по алгебре</h4>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          className="mb-4"
        >
          <p className="mb-2">Решите уравнение: 2x - 5 = 11</p>
          <div className="space-y-2">
            {["x = 8", "x = 7", "x = 6", "x = 9"].map((option, index) => (
              <motion.button
                key={index}
                className="w-full p-2 bg-gray-100 rounded hover:bg-blue-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
          className="absolute bottom-4 left-4 right-4"
        >
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Следующий вопрос
          </Button>
        </motion.div>
      </div>
    ),
  },
  {
    title: "Соревнования с пользователями",
    description:
      "Участвуйте в математических состязаниях и повышайте свой уровень",
    icon: Trophy,
    content: (
      <div className="relative w-full max-w-md h-80 bg-white rounded-lg shadow-xl overflow-hidden p-4">
        <h4 className="text-lg font-bold mb-4">Лидерборд</h4>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          className="mb-4"
        >
          <ol className="space-y-2">
            {[
              {
                name: "Ерасыл Б.",
                score: "250 🔥",
              },
              {
                name: "Айжас С.",
                score: "245 🔥",
              },
              {
                name: "Алимжан Ж.",
                score: "240 🔥",
              },
              {
                name: "Вы",
                score: "20 🔥",
              },
            ].map((player, index) => (
              <motion.li
                key={index}
                className="flex items-center p-2 bg-gray-100 rounded"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: "easeOut",
                }}
              >
                <span className="mr-2 font-bold">{index + 1}.</span>
                <span className="flex-grow">{player.name}</span>
                <span className="font-bold">{player.score}</span>
              </motion.li>
            ))}
          </ol>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
          className="absolute bottom-4 left-4 right-4"
        >
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Начать соревнование
          </Button>
        </motion.div>
      </div>
    ),
  },
];

const FeatureShowcase = () => {
  const [currentFeature, setCurrentFeature] = useState(0);

  const nextFeature = () =>
    setCurrentFeature((prev) => (prev + 1) % features.length);
  const prevFeature = () =>
    setCurrentFeature((prev) => (prev - 1 + features.length) % features.length);

  useEffect(() => {
    const timer = setInterval(nextFeature, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto mt-12">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Инновационные функции math12.studio
      </h2>
      <div className="mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFeature}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center justify-between"
          >
            <div className="md:w-1/2 mb-4 md:mb-0">
              <motion.div
                initial={{ x: -50 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {React.createElement(features[currentFeature].icon, {
                  className: "text-blue-600 h-12 w-12",
                })}
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">
                {features[currentFeature].title}
              </h3>
              <p className="text-gray-600">
                {features[currentFeature].description}
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              {features[currentFeature].content}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={prevFeature}
          aria-label="Предыдущая функция"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {features.map((_, index) => (
          <Button
            key={index}
            variant="outline"
            size="icon"
            onClick={() => setCurrentFeature(index)}
            aria-label={`Перейти к функции ${index + 1}`}
            className={index === currentFeature ? "bg-blue-600 text-white" : ""}
          >
            <span className="sr-only">Функция {index + 1}</span>
            <div
              className={`w-2 h-2 rounded-full ${
                index === currentFeature ? "bg-white" : "bg-gray-400"
              }`}
            />
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={nextFeature}
          aria-label="Следующая функция"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const testimonials = [
  {
    name: "Алия К.",
    role: "Ученица 11 класса",
    content:
      "math12.studio помогло мне улучшить мои оценки по математике. Теперь я чувствую себя более уверенно на уроках!",
  },
  {
    name: "Мерей Л.",
    role: "Родитель",
    content:
      "Мой сын стал лучше понимать математику благодаря math12.studio. Спасибо за отличный сервис!",
  },
  {
    name: "Адал Л.",
    role: "Ученик",
    content:
      "Честно в шоке от этих всех технологий, теперь моя тройка превратилась в 5! Очень доволен результатами!",
  },
];

const TestimonialCard = ({ testimonial }) => (
  <motion.div
    className="bg-white p-6 rounded-lg shadow-lg"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center mb-4">
      <div>
        <h4 className="font-bold">{testimonial.name}</h4>
        <p className="text-sm text-gray-600">{testimonial.role}</p>
      </div>
    </div>
    <p className="text-gray-700">{testimonial.content}</p>
  </motion.div>
);

const AIComparison = () => (
  <div className="grid md:grid-cols-2 gap-8">
    <motion.div
      className="bg-white p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold mb-4">math12.studio AI</h3>
      <ul className="space-y-2">
        <li className="flex items-center">
          <Zap className="text-green-500 mr-2" />
          Специализированные математические знания
        </li>
        <li className="flex items-center">
          <Zap className="text-green-500 mr-2" />
          Адаптивное обучение
        </li>
        <li className="flex items-center">
          <Zap className="text-green-500 mr-2" />
          Интерактивные задания и тесты
        </li>
        <li className="flex items-center">
          <Zap className="text-green-500 mr-2" />
          Персонализированные рекомендации
        </li>
      </ul>
    </motion.div>
    <motion.div
      className="bg-white p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold mb-4">Обычный ChatGPT</h3>
      <ul className="space-y-2">
        <li className="flex items-center">
          <Zap className="text-gray-400 mr-2" />
          Общие знания без специализации
        </li>
        <li className="flex items-center">
          <Zap className="text-gray-400 mr-2" />
          Отсутствие адаптивного обучения
        </li>
        <li className="flex items-center">
          <Zap className="text-gray-400 mr-2" />
          Ограниченные возможности для практики
        </li>
        <li className="flex items-center">
          <Zap className="text-gray-400 mr-2" />
          Отсутствие персонализации
        </li>
      </ul>
    </motion.div>
  </div>
);

const ParallaxSection = ({ children }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div ref={ref} style={{ y }} className="relative z-10">
      {children}
    </motion.div>
  );
};

export default function EnhancedLandingPage() {
  return (
    <div className="min-h-screen text-gray-900">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          ></motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6"
          >
            <span className="text-blue-600">math</span>12.studio
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-2xl mb-8 text-gray-600"
          >
            Революция в изучении математики на основе силлабуса НИШ
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <Button
              asChild
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 text-xl px-8 py-4"
            >
              <Link href="/register">
                Начать обучение <ArrowRight className="ml-2 h-6 w-6" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <FeatureShowcase />
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center">
            Отзывы наших пользователей
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center">
            math12.studio AI vs обычный ChatGPT
          </h2>
          <AIComparison />
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Готовы к новому уровню в математике?
          </h2>
          <p className="text-xl mb-8">
            Присоединяйтесь к math12.studio и откройте для себя силу ИИ в
            обучении
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 text-xl px-8 py-4"
          >
            <Link href="/register">
              Начать бесплатно <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
