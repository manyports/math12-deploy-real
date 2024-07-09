"use client";

import React, { useState, ReactNode } from "react";
import Link from "next/link";
import { FaInstagram, FaTiktok, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; content: ReactNode }>({ title: "", content: "" });

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, title: string, content: ReactNode) => {
    e.preventDefault();
    setModalContent({ title, content });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const privacyPolicy = (
    <ul className="list-disc ml-4">
      <li>Мы собираем только необходимую информацию для функционирования сервиса.</li>
      <li>Ваши личные данные не передаются третьим лицам без вашего согласия.</li>
      <li>Мы используем шифрование для защиты ваших данных.</li>
      <li>Вы можете запросить удаление ваших данных в любое время.</li>
      <li>Мы используем файлы cookie для улучшения работы сайта.</li>
    </ul>
  );

  const termsOfService = (
    <ul className="list-disc ml-4">
      <li>Используя наш сервис, вы соглашаетесь с данными условиями.</li>
      <li>Запрещено использовать сервис для незаконной деятельности.</li>
      <li>Мы оставляем за собой право изменять или прекращать работу сервиса.</li>
      <li>Пользователи несут ответственность за сохранность своих учетных данных.</li>
      <li>Контент, созданный пользователями, остается их интеллектуальной собственностью.</li>
    </ul>
  );

  const contactInfo = (
    <div>
      <p>Свяжитесь с нами на Telegram:</p>
      <a 
        href="https://t.me/math12_sup_bot" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        @math12_sup_bot
      </a>
    </div>
  );

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <footer className="bg-blue-600 text-white py-8 px-4 rounded-tl-3xl rounded-tr-3xl">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="text-center md:text-left">
          <Link href="/" className="text-2xl font-bold hover:text-blue-200 transition duration-300">
            math12
          </Link>
          <p className="mt-2 text-sm">&copy; {currentYear} math12. Все права защищены.</p>
        </div>
        
        <nav className="col-span-1 md:col-span-2">
          <ul className="flex flex-col space-y-2">
            {[
              { href: "/privacy", text: "Политика конфиденциальности", content: privacyPolicy },
              { href: "/terms", text: "Пользовательское соглашение", content: termsOfService },
              { href: "/contact", text: "Напишите нам", content: contactInfo },
            ].map((link) => (
              <li key={link.href}>
                <a 
                  href={link.href} 
                  className="hover:text-blue-200 transition duration-300"
                  onClick={(e) => handleLinkClick(e, link.text, link.content)}
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="text-center md:text-right">
          <h3 className="text-lg font-semibold mb-3">Следите за нами</h3>
          <div className="flex justify-center md:justify-end space-x-4">
            <a href="https://instagram.com/math12.ai" target="_blank" rel="noopener noreferrer" 
               className="hover:text-blue-200 transition duration-300">
              <FaInstagram size={24} />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="https://tiktok.com/@math12.ai" target="_blank" rel="noopener noreferrer" 
               className="hover:text-blue-200 transition duration-300">
              <FaTiktok size={24} />
              <span className="sr-only">TikTok</span>
            </a>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white text-black rounded-lg shadow-xl w-full max-w-md overflow-hidden"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">{modalContent.title}</h2>
                <button 
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 transition duration-150"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                {modalContent.content}
              </div>
              <div className="bg-gray-100 px-6 py-4 flex justify-end">
                <button
                  onClick={closeModal}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-150"
                >
                  Закрыть
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
