'use client';

import { useChatContext } from '../../context/ChatContext';
import { useEffect, useRef } from 'react';
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

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">MathAI Chat 🤖</h1>
          <div className="flex items-center space-x-4">
            <p className="text-sm font-medium text-gray-600">
              Осталось вопросов: <span className="text-blue-600 font-bold">{remainingQuestions}</span>
            </p>
            <button 
              onClick={newChat} 
              className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
            >
              Новый чат
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow overflow-auto p-4">
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
                  className={`max-w-[70%] p-3 rounded-lg shadow ${
                    message.role === 'ai'
                      ? 'bg-white text-gray-800'
                      : 'bg-blue-500 text-white'
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
              <div className="bg-white text-gray-800 p-3 rounded-lg shadow">
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

      <footer className="bg-white shadow-md p-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <textarea
              className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded-lg py-2 px-4 pl-4 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Введите ваше сообщение..."
              rows={2}
              value={input}
              onChange={handleInputChange}
              disabled={remainingQuestions <= 0}
            />
            <button
              className="absolute right-2 bottom-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
};

export default ChatComponent;