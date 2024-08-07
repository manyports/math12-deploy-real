'use client';

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

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

export default function SpecialTestPage() {
  const { testId } = useParams();
  const [testContent, setTestContent] = useState<TestContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  const fetchTest = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://www.api.math12.studio/api/getDailyTest', { withCredentials: true });
      setTestContent(response.data);
    } catch (error) {
      console.error('Error fetching daily test:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTest();
  }, []);
  const shuffledAnswers = useMemo(() => {
    if (!testContent || !testContent.questions[currentQuestion]) return [];
    return shuffleArray(testContent.questions[currentQuestion].answers);
  }, [testContent, currentQuestion]);

  const handleAnswerOptionClick = async (answerIndex: number, isCorrect: boolean) => {
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
        await axios.post('https://www.api.math12.studio/api/saveSpecialTestResult', {
          testId,
          score: score + (isCorrect ? 1 : 0),
          totalQuestions: testContent?.questions.length
        }, { withCredentials: true });
      } catch (error) {
        console.error('Error saving test result:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-blue-600 mb-8"
        >
          <TypeAnimation
            sequence={["Загрузка особенного теста..."]}
            wrapper="span"
            speed={50}
            style={{ display: 'inline-block' }}
            cursor={false}
          />
        </motion.div>
        <div className="relative w-20 h-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full" />
          </motion.div>
        </div>
      </div>
    );
  }

  if (!testContent) {
    return <div className="text-center text-2xl text-red-600 mt-10">Тест не найден</div>;
  }

  const progress = (currentQuestion / testContent.questions.length) * 100;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white p-4">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full mx-auto p-8 bg-white rounded-2xl shadow-lg overflow-y-auto"
        style={{ maxHeight: '90vh' }}
      >
        <h1 className="text-4xl font-bold text-blue-600 mb-6 text-center">Особенный тест</h1>
        {!showScore && (
          <>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <motion.div 
                className="bg-blue-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-lg text-blue-600 mb-6 text-center">
              Вопрос {currentQuestion + 1} из {testContent.questions.length}
            </p>
          </>
        )}
        <div className="prose max-w-none">
          <AnimatePresence mode="wait">
            {showScore ? (
              <motion.div
                key="score"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h2 className="text-3xl font-semibold mb-6 text-blue-600">Ваш результат</h2>
                <p className="text-2xl mb-8 text-blue-600">
                  Вы ответили правильно на <span className="font-bold text-green-600">{score}</span> из <span className="font-bold">{testContent.questions.length}</span> вопросов.
                </p>
                <div className="space-y-6 max-h-[60vh] overflow-y-auto px-4">
                  {testContent.questions.map((question, qIndex) => (
                    <motion.div 
                      key={qIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: qIndex * 0.1 }}
                      className="border-2 border-gray-200 p-6 rounded-xl shadow-sm"
                    >
                      <p className="font-semibold text-xl mb-4 text-blue-600">{question.question}</p>
                      {question.answers.map((answer, aIndex) => (
                        <p key={aIndex} className={`
                          py-2 px-4 rounded-lg mb-2
                          ${userAnswers[qIndex] === aIndex ? 'font-bold' : ''}
                          ${answer.isCorrect ? 'bg-green-100 text-green-800' : ''}
                          ${userAnswers[qIndex] === aIndex && !answer.isCorrect ? 'bg-red-100 text-red-800' : ''}
                          ${userAnswers[qIndex] !== aIndex && !answer.isCorrect ? 'text-gray-700' : ''}
                        `}>
                          {answer.text}
                          {userAnswers[qIndex] === aIndex && !answer.isCorrect && ' (Ваш ответ)'}
                          {answer.isCorrect && ' (Правильный ответ)'}
                        </p>
                      ))}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="question-container"
              >
                <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">
                  <TypeAnimation
                    sequence={[testContent.questions[currentQuestion].question]}
                    wrapper="span"
                    speed={50}
                    style={{ display: 'inline-block' }}
                  />
                </h2>
                <div className="flex flex-col space-y-4">
                  {shuffledAnswers.map((answer, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleAnswerOptionClick(
                        testContent.questions[currentQuestion].answers.findIndex(a => a === answer),
                        answer.isCorrect
                      )}
                      className="p-4 bg-white border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 rounded-xl shadow-sm transition duration-300 text-left text-gray-700"
                    >
                      {answer.text}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}