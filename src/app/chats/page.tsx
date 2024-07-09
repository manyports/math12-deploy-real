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
    messagesEndRef.current?.scrollIntoView?.({ behavior: "smooth" });
  };

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise();
    }
    scrollToBottom();
  }, [messages]);

  return (
    <div className="p-4 md:px-[15vw] h-screen flex flex-col">
      <div className="flex flex-col mb-8 items-center">
        <h1 className="text-center font-bold text-3xl text-blue-600 mb-4">
          MathAI Chat 👾
        </h1>
        <p className="text-center font-semibold text-lg text-blue-500 border border-blue-300 rounded-xl p-3 mb-4 bg-blue-50">
          Осталось вопросов: {remainingQuestions}
        </p>
        <button 
          onClick={newChat} 
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Новый чат
        </button>
      </div>
      <div className="flex-grow overflow-auto bg-white rounded-lg shadow-md">
        <div className="flex flex-col h-full p-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-4 mb-4 ${
                  message.role === 'ai' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.role === 'ai'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  <div className="prose">
                    {message.role === 'ai' ? (
                      <div dangerouslySetInnerHTML={{ __html: message.content }} />
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                  <small className="text-gray-500 mt-1 block">
                    {format(message.timestamp, 'HH:mm:ss')}
                  </small>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex items-start gap-4 mt-4">
              <div className="font-bold text-blue-500">AI</div>
              <div className="bg-blue-100 text-blue-800 p-3 rounded-lg">
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
      </div>
      <div className="w-full sticky bottom-0 py-4 ">
        <div className="relative">
          <textarea
            className="w-full bg-white text-sm rounded-2xl resize-none p-4 pr-16 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300 ease-in-out"
            placeholder="Введите ваше сообщение..."
            name="message"
            id="message"
            rows={2}
            value={input}
            onChange={handleInputChange}
            disabled={remainingQuestions <= 0}
          />
          <button
            className="absolute right-3 bottom-3 inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-110"
            type="button"
            onClick={handleSendMessage}
            disabled={loading || remainingQuestions <= 0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            <span className="sr-only">Отправить</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;