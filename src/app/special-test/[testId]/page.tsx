"use client";

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import katex from "katex";
import "katex/dist/katex.min.css";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  WifiOff,
  XCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
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
  id: string;
  questions: {
    questions: Question[];
  }[];
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
  const parts = text.split(/(\$\$[^$]+\$\$|\$[^$]+\$|\\\\[^\\]+\\\\)/);
  return parts.map((part, index) => {
    if (part.startsWith("$$") && part.endsWith("$$")) {
      const latex = part.slice(2, -2);
      return (
        <span
          key={index}
          className="block text-center my-2"
          dangerouslySetInnerHTML={{
            __html: katex.renderToString(latex, {
              displayMode: true,
              throwOnError: false,
            }),
          }}
        />
      );
    } else if (part.startsWith("$") && part.endsWith("$")) {
      const latex = part.slice(1, -1);
      return (
        <span
          key={index}
          dangerouslySetInnerHTML={{
            __html: katex.renderToString(latex, {
              displayMode: false,
              throwOnError: false,
            }),
          }}
        />
      );
    } else if (part.startsWith("\\\\") && part.endsWith("\\\\")) {
      const latex = part.slice(2, -2);
      return (
        <span
          key={index}
          dangerouslySetInnerHTML={{
            __html: katex.renderToString(latex, {
              displayMode: false,
              throwOnError: false,
            }),
          }}
        />
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default function SpecialTestPage() {
  const router = useRouter();
  const { testId } = useParams();
  const [testContent, setTestContent] = useState<TestContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [error, setError] = useState(false);

  const fetchTest = async () => {
    try {
      const response = await axios.get(
        "https://www.api.math12.studio/api/getDailyTest",
        { withCredentials: true }
      );
      setTestContent(response.data);
    } catch (error) {
      console.error("Error fetching daily test:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTest();
  }, []);

  const shuffledAnswers = useMemo(() => {
    if (!testContent || !testContent.questions[currentQuestion]?.questions[0]) return [];
    return shuffleArray(testContent.questions[currentQuestion].questions[0].answers);
  }, [testContent, currentQuestion]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    handleNextQuestion(answerIndex);
  };

  const handleNextQuestion = async (selectedAnswerIndex: number) => {
    const isCorrect = shuffledAnswers[selectedAnswerIndex].isCorrect;
    setUserAnswers([...userAnswers, selectedAnswerIndex]);

    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < (testContent?.questions.length || 0)) {
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer(null);
    } else {
      setShowScore(true);
      try {
        await axios.post(
          "https://www.api.math12.studio/api/saveSpecialTestResult",
          {
            testId,
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

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(userAnswers[currentQuestion - 1]);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto p-8 bg-white rounded-3xl shadow-2xl text-center"
        >
          <WifiOff className="w-16 h-16 mx-auto mb-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ошибка с интернетом
          </h2>
          <p className="text-gray-600 mb-8">
            Не удалось загрузить тест. Пожалуйста, проверьте подключение к
            интернету и попробуйте снова.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => fetchTest()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-300"
            >
              Попробовать снова
            </button>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition duration-300 flex items-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Назад
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!testContent) {
    return <div>Ошибка загрузки теста</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-3xl shadow-2xl">
        {!showScore ? (
          <>
            <h1 className="text-4xl font-bold text-blue-600 mb-6 text-center">
              Особенный тест
            </h1>
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                className="flex items-center text-blue-600 disabled:text-gray-400"
              >
                <ArrowLeft className="mr-2" />
                Предыдущий
              </button>
              <p className="text-lg text-blue-600">
                Вопрос {currentQuestion + 1} из {testContent?.questions.length}
              </p>
              <div className="w-24"></div>
            </div>
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
                    testContent?.questions[currentQuestion]?.questions[0]?.question || ""
                  )}
                </h2>
                <div className="space-y-4">
                  {shuffledAnswers.map((answer, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-6 text-left text-lg rounded-xl transition duration-300 ${
                        selectedAnswer === index
                          ? "bg-blue-100 border-2 border-blue-600"
                          : "bg-white border-2 border-gray-200 hover:border-blue-600"
                      }`}
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
            className="text-center mt-12"
          >
            <h2 className="text-3xl font-bold mb-6 text-blue-600">
              Результаты теста
            </h2>
            <div className="mb-8 p-6 bg-blue-50 rounded-xl">
              <p className="text-6xl font-bold text-blue-600">
                {score} / {testContent.questions.length}
              </p>
              <p className="text-xl text-blue-600 mt-2">правильных ответов</p>
            </div>
            <div className="space-y-6 max-h-[60vh] overflow-y-auto px-4">
              {testContent.questions.map((questionGroup, qIndex) => (
                <motion.div
                  key={qIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: qIndex * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-md"
                >
                  <p className="font-semibold text-xl mb-4 text-black">
                    {renderLatex(questionGroup.questions[0].question)}
                  </p>
                  {questionGroup.questions[0].answers.map((answer, aIndex) => (
                    <div
                      key={aIndex}
                      className={`
                        flex items-center py-3 px-4 rounded-lg mb-2 text-lg
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
                      {answer.isCorrect ? (
                        <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
                      ) : userAnswers[qIndex] === aIndex ? (
                        <XCircle className="w-6 h-6 mr-2 text-red-600" />
                      ) : (
                        <div className="w-6 h-6 mr-2" />
                      )}
                      <span>{renderLatex(answer.text)}</span>
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
