"use client";

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import katex from "katex";
import "katex/dist/katex.min.css";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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

function renderLatex(text: string): React.ReactNode {
  const splitText = text.split(/(\$\$.*?\$\$|\$.*?\$)/g);

  return splitText.map((part, index) => {
    if (part.startsWith("$$") && part.endsWith("$$")) {
      const latex = part.slice(2, -2);
      return renderKaTeX(escapeLatex(latex), index, true);
    } else if (part.startsWith("$") && part.endsWith("$")) {
      const latex = part.slice(1, -1);
      return renderKaTeX(escapeLatex(latex), index, false);
    }
    return <span key={index}>{part}</span>;
  });
}

function escapeLatex(latex: string): string {
  return latex.replace(/\\/g, "\\\\");
}

function renderKaTeX(
  latex: string,
  key: number,
  displayMode: boolean
): React.ReactNode {
  try {
    return (
      <span
        key={key}
        dangerouslySetInnerHTML={{
          __html: katex.renderToString(latex, {
            throwOnError: false,
            displayMode: displayMode,
            strict: false,
          }),
        }}
      />
    );
  } catch (error) {
    console.error("LaTeX rendering error:", error);
    return <span key={key}>{latex}</span>;
  }
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
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

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

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(userAnswers[currentQuestion - 1]);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <motion.div
          key={loadingStage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-blue-600 mb-8 text-center"
        >
          <TypeAnimation
            sequence={[loadingStages[loadingStage]]}
            wrapper="span"
            speed={50}
            style={{ display: "inline-block" }}
            cursor={false}
          />
        </motion.div>
        <div className="w-64 bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
            className="h-full bg-blue-600 rounded-full"
          />
        </div>
      </div>
    );
  }

  if (!testContent) {
    return <div>Error loading test content</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-3xl shadow-2xl">
        {!showScore ? (
          <>
            <h1 className="text-4xl font-bold text-blue-600 mb-6 text-center">
              Тест
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
                    testContent?.questions[currentQuestion]?.question || ""
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
            className="text-center"
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
              {testContent.questions.map((question, qIndex) => (
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
