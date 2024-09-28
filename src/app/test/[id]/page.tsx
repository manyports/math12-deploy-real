"use client";

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import "katex/dist/katex.min.css";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { InlineMath } from "react-katex";
import { TypeAnimation } from "react-type-animation";

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  question: string;
  answers: Answer[];
}

interface TestContent {
  questions: Question[];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function renderLatex(text: string) {
  const latexRegex = /\$(.*?)\$/g;
  const parts = text.split(latexRegex);

  return parts.map((part, index) => {
    if (index % 2 === 0) {
      return part;
    } else {
      return <InlineMath key={index} math={part} />;
    }
  });
}

export default function TestPage() {
  const { id } = useParams();
  const [testContent, setTestContent] = useState<TestContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  const loadingStages = [
    "Подключаемся к базе знаний...",
    "Анализируем данные...",
    "Формируем вопросы...",
    "Готовим тест...",
  ];

  const fetchTest = useCallback(async () => {
    try {
      for (let i = 0; i < loadingStages.length; i++) {
        setLoadingStage(i);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      const response = await axios.get(
        `https://www.api.math12.studio/api/topics/${id}`,
        { withCredentials: true }
      );
      const topic = response.data;
      const testResponse = await axios.post(
        "https://www.api.math12.studio/api/generateTest",
        {
          topic: topic.topic,
          class: topic.class,
          term: topic.term,
        },
        { withCredentials: true }
      );
      setTestContent(testResponse.data.test);
    } catch (error) {
      console.error("Error fetching test:", error);
      setTestContent(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTest();
  }, [fetchTest]);

  const shuffledAnswers = useMemo(() => {
    if (!testContent || !testContent.questions[currentQuestion]) return [];
    return shuffleArray(testContent.questions[currentQuestion].answers);
  }, [testContent, currentQuestion]);

  const handleAnswerOptionClick = async (
    answerIndex: number,
    isCorrect: boolean
  ) => {
    setUserAnswers([...userAnswers, answerIndex]);

    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < (testContent?.questions.length || 0)) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
      try {
        await axios.post(
          "https://www.api.math12.studio/api/saveTestResult",
          {
            topicId: id,
            score: score + (isCorrect ? 1 : 0),
            totalQuestions: testContent?.questions.length,
          },
          { withCredentials: true }
        );
      } catch (error) {
        console.error("Error saving test result:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-white mt-12">
        <motion.div
          key={loadingStage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-blue-600 mb-8"
        >
          <TypeAnimation
            sequence={[loadingStages[loadingStage]]}
            wrapper="span"
            speed={50}
            style={{ display: "inline-block" }}
            cursor={false}
          />
        </motion.div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 flex items-center justify-center mt-12">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full mx-auto p-8 bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {!showScore ? (
          <>
            <h1 className="text-4xl font-bold text-blue-600 mb-6 text-center">
              Тест
            </h1>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    ((currentQuestion + 1) /
                      (testContent?.questions.length || 1)) *
                    100
                  }%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-lg text-blue-600 mb-6 text-center">
              Вопрос {currentQuestion + 1} из {testContent?.questions.length}
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-semibold mb-6 text-center text-black">
                  {renderLatex(
                    testContent?.questions[currentQuestion].question || ""
                  )}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {shuffledAnswers.map((answer, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() =>
                        handleAnswerOptionClick(
                          testContent!.questions[
                            currentQuestion
                          ].answers.findIndex((a) => a === answer),
                          answer.isCorrect
                        )
                      }
                      className="p-4 bg-white border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 rounded-xl shadow-sm transition duration-300 text-left text-black"
                    >
                      {renderLatex(answer.text)}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-6 text-blue-600">
              Результаты теста
            </h2>
            <div className="mb-8 p-6 bg-blue-50 rounded-xl">
              <p className="text-4xl font-bold text-blue-600">
                {score} / {testContent?.questions.length}
              </p>
              <p className="text-xl text-blue-600 mt-2">правильных ответов</p>
            </div>
            <div className="space-y-6 max-h-[60vh] overflow-y-auto px-4">
              {testContent?.questions.map((question, qIndex) => (
                <motion.div
                  key={qIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: qIndex * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-md"
                >
                  <p className="font-semibold text-xl mb-4 text-black">
                    {renderLatex(question.question)}
                  </p>
                  {question.answers.map((answer, aIndex) => (
                    <p
                      key={aIndex}
                      className={`
                      py-2 px-4 rounded-lg mb-2
                      ${userAnswers[qIndex] === aIndex ? "font-bold" : ""}
                      ${answer.isCorrect ? "bg-green-100 text-green-800" : ""}
                      ${
                        userAnswers[qIndex] === aIndex && !answer.isCorrect
                          ? "bg-red-100 text-red-800"
                          : ""
                      }
                      ${
                        userAnswers[qIndex] !== aIndex && !answer.isCorrect
                          ? "text-gray-700"
                          : ""
                      }
                    `}
                    >
                      {renderLatex(answer.text)}
                      {userAnswers[qIndex] === aIndex &&
                        !answer.isCorrect &&
                        " (Ваш ответ)"}
                      {answer.isCorrect && " (Правильный ответ)"}
                    </p>
                  ))}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
