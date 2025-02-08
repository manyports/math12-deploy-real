"use client";

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CheckCircle, WifiOff, XCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TypeAnimation } from "react-type-animation";

declare global {
  interface Window {
    MathJax: any;
  }
}

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

function LatexContent({ content }: { content: string }) {
  return (
    <span 
      className="math-content"
      dangerouslySetInnerHTML={{ 
        __html: content
      }} 
    />
  );
}

function renderLatex(text: string) {
  return <LatexContent content={text} />;
}

export default function TestPage() {
  const router = useRouter();
  const { id } = useParams();
  const [testContent, setTestContent] = useState<TestContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const loadingStages = [
    "Подключаемся к базе знаний...",
    "Анализируем данные...",
    "Формируем вопросы...",
    "Готовим тест...",
  ];

  const fetchTest = useCallback(async () => {
    setLoading(true);
    setError(false);
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
      
      setTimeout(async () => {
        if (window.MathJax?.typesetPromise) {
          try {
            await window.MathJax.typesetPromise();
          } catch (error) {
            console.error('MathJax typesetting error:', error);
          }
        }
      }, 100);
    } catch (error) {
      console.error("Error fetching test:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    fetchTest();
  }, [fetchTest]);

  useEffect(() => {
    const loadMathJax = async () => {
      if (typeof window !== 'undefined') {
        window.MathJax = {
          loader: {load: ['[tex]/html']},
          tex: {
            packages: {'[+]': ['html']},
            inlineMath: [['$', '$']],
            displayMath: [['$$', '$$']],
          },
          options: {
            skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
            ignoreHtmlClass: 'tex2jax_ignore',
          },
          startup: {
            pageReady: () => {
              return Promise.resolve();
            }
          }
        };

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-mml-chtml.js';
        script.async = true;
        script.id = 'MathJax-script';

        await new Promise((resolve) => {
          script.onload = resolve;
          document.head.appendChild(script);
        });

        if (window.MathJax?.typesetPromise) {
          await window.MathJax.typesetPromise();
        }
      }
    };

    loadMathJax();

    return () => {
      const scriptToRemove = document.getElementById('MathJax-script');
      if (scriptToRemove && scriptToRemove.parentNode) {
        scriptToRemove.parentNode.removeChild(scriptToRemove);
      }
    };
  }, []);

  useEffect(() => {
    if (!testContent || !mounted) return;
    
    const renderMath = async () => {
      if (window.MathJax?.typesetPromise) {
        try {
          await window.MathJax.typesetPromise();
        } catch (error) {
          console.error('MathJax typesetting error:', error);
        }
      }
    };

    const timeoutId = setTimeout(renderMath, 100);
    return () => clearTimeout(timeoutId);
  }, [testContent, mounted, currentQuestion]);

  const shuffledAnswers = useMemo(() => {
    if (!testContent || !testContent.questions[currentQuestion]) return [];
    return shuffleArray(testContent.questions[currentQuestion].answers);
  }, [testContent, currentQuestion]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    handleNextQuestion(answerIndex);
  };

  const changeQuestion = async (nextQuestion: number) => {
    setCurrentQuestion(nextQuestion);
    setTimeout(async () => {
      if (window.MathJax?.typesetPromise) {
        try {
          await window.MathJax.typesetPromise();
        } catch (error) {
          console.error('MathJax typesetting error:', error);
        }
      }
    }, 100);
  };

  const handleNextQuestion = async (selectedAnswerIndex: number) => {
    const isCorrect = shuffledAnswers[selectedAnswerIndex].isCorrect;
    setUserAnswers([...userAnswers, selectedAnswerIndex]);

    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < (testContent?.questions.length || 0)) {
      await changeQuestion(nextQuestion);
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

  const handlePreviousQuestion = async () => {
    if (currentQuestion > 0) {
      await changeQuestion(currentQuestion - 1);
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
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-3xl font-bold text-center">Тест</h1>
        </div>
        <div className="p-6">
          {!showScore ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                  className="flex items-center text-blue-600 disabled:text-gray-400"
                >
                  <ArrowLeft className="mr-2" />
                  Предыдущий
                </button>
                <p className="text-lg text-blue-600 font-semibold">
                  Вопрос {currentQuestion + 1} из{" "}
                  {testContent?.questions.length}
                </p>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
                    <LatexContent content={testContent?.questions[currentQuestion]?.question || ""} />
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shuffledAnswers.map((answer, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full text-left text-lg rounded-xl transition duration-300 overflow-hidden ${
                          selectedAnswer === index
                            ? "ring-2 ring-blue-600 ring-offset-2"
                            : "hover:bg-blue-50"
                        }`}
                      >
                        <div className="p-4 flex items-center justify-center h-full bg-gray-100">
                          <div className="text-center">
                            <LatexContent content={answer.text} />
                          </div>
                        </div>
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
              <div className="space-y-6 max-h-[50vh] overflow-y-auto px-4">
                {testContent.questions.map((question, qIndex) => (
                  <motion.div
                    key={qIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: qIndex * 0.1 }}
                    className="bg-white p-6 rounded-xl shadow-md"
                  >
                    <p className="font-semibold text-xl mb-4 text-black">
                      <LatexContent content={question.question} />
                    </p>
                    {question.answers.map((answer, aIndex) => (
                      <div
                        key={aIndex}
                        className={`
                          flex items-center py-3 px-4 rounded-lg mb-2 text-lg
                          ${userAnswers[qIndex] === aIndex ? "font-bold" : ""}
                          ${
                            answer.isCorrect
                              ? "bg-green-100 text-green-800"
                              : ""
                          }
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
                        <LatexContent content={answer.text} />
                      </div>
                    ))}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
