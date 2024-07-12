'use client';

import { useChatContext } from '../../context/ChatContext';
import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import ReactTypingEffect from 'react-typing-effect';

declare global {
  interface Window {
    MathJax: any;
  }
}

const ChatComponent = () => {
  const { input, setInput, messages, loading, remainingQuestions, onSent, newChat } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      onSent();
      setInput('');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise();
    }
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      setShowScrollButton(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <header className="bg-white bg-opacity-10 backdrop-blur-md shadow-md p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">MathAI Chat 👾</h1>
          <div className="flex items-center space-x-4">
            <p className="text-sm font-medium text-white">
              Осталось вопросов: <span className="font-bold">{remainingQuestions}</span>
            </p>
            <button 
              onClick={newChat} 
              className="px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-md hover:bg-opacity-90 transition duration-300 ease-in-out"
            >
              Новый чат
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow overflow-auto p-4 space-y-4">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'ai' ? 'justify-start' : 'justify-end'} mb-4`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg shadow-md ${
                    message.role === 'ai'
                      ? 'bg-white text-gray-800'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <div className="prose">
                    {message.role === 'ai' ? (
                      <div dangerouslySetInnerHTML={{ __html: message.content }} />
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                  <small className={`text-xs mt-1 block ${message.role === 'ai' ? 'text-gray-500' : 'text-blue-200'}`}>
                    {format(message.timestamp, 'HH:mm:ss')}
                  </small>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex justify-start mb-4">
              <div className="bg-white bg-opacity-80 text-gray-800 p-3 rounded-lg shadow-md">
                <ReactTypingEffect
                  text={["Думаю...", "Обрабатываю запрос...", "Генерирую ответ..."]}
                  speed={50}
                  eraseSpeed={50}
                  typingDelay={1000}
                  eraseDelay={2000}
                />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-white bg-opacity-10 backdrop-blur-md shadow-md p-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <textarea
              className="w-full bg-white bg-opacity-80 text-gray-800 border border-gray-300 rounded-lg py-2 px-4 pl-4 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Введите ваше сообщение..."
              rows={2}
              value={input}
              onChange={handleInputChange}
              disabled={remainingQuestions <= 0}
            />
            <button
              className="absolute right-2 bottom-2 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
              onClick={handleSendMessage}
              disabled={loading || remainingQuestions <= 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
              </svg>
            </button>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-4 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
            onClick={scrollToBottom}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatComponent;