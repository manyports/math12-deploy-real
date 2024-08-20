"use client";

import Lenis from "@studio-freight/lenis";
import React, { useEffect } from "react";
import ReactTypingEffect from "react-typing-effect";

const Home: React.FC = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-blue-800 mb-4 text-center">
            <ReactTypingEffect
              text={[
                "Революция в изучении математики",
                "Пойми математику сегодня",
              ]}
              speed={100}
              eraseSpeed={100}
              typingDelay={500}
              eraseDelay={2000}
            />
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-center">
            Персонализированное обучение с использованием передовых технологий
            ИИ на базе НИШ
          </p>
          <div className="flex justify-center space-x-4">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-full text-md font-semibold hover:bg-blue-700 transition duration-300"
              onClick={() => (window.location.href = "/register")}
            >
              Войти в аккаунт
            </button>
            <button
              className="bg-white text-blue-600 px-6 py-3 rounded-full text-md font-semibold border-2 border-blue-600 hover:bg-blue-50 transition duration-300"
              onClick={() =>
                (window.location.href = "https://t.me/math12_sup_bot")
              }
            >
              Связаться с нами
            </button>
          </div>
        </header>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-12">
            Наши уникальные возможности
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 hover:scale-110"
              onClick={() => (window.location.href = "/imagesolver")}
            >
              <div className="text-blue-600 text-4xl mb-4">📸</div>
              <h3 className="text-xl font-bold mb-4">Решение задач по фото</h3>
              <p className="text-gray-600">
                Просто сфотографируйте задачу, и наш ИИ мгновенно предоставит
                подробное решение с объяснениями.
              </p>
            </div>
            <div
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 hover:scale-110"
              onClick={() => (window.location.href = "/test")}
            >
              <div className="text-blue-600 text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-4">
                Персонализированные тесты
              </h3>
              <p className="text-gray-600">
                Адаптивная система тестирования, которая подстраивается под ваш
                уровень знаний и помогает эффективно прогрессировать.
              </p>
            </div>
            <div
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 hover:scale-110"
              onClick={() => (window.location.href = "/chats")}
            >
              <div className="text-blue-600 text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-4">ИИ-ассистент в чате</h3>
              <p className="text-gray-600">
                Задавайте вопросы в любое время и получайте мгновенные,
                подробные ответы от нашего умного ИИ-помощника.
              </p>
            </div>
          </div>
        </section>
        <section className= "py-20">
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-12">
            Отзывы наших пользователей
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <p className="text-gray-600 mb-4">
                  "Эта платформа изменила мой подход к изучению математики!
                  Теперь я понимаю даже самые сложные темы."
                </p>
                <p className="text-blue-800 font-bold">
                  - Айдана, ученица 11 класса
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <p className="text-gray-600 mb-4">
                  "ИИ-ассистент действительно помогает! Он всегда отвечает на
                  мои вопросы и объясняет все очень просто."
                </p>
                <p className="text-blue-800 font-bold">- Алибек, студент</p>
              </div>
            </div>
          </div>
        </section>
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-12">Тарифные планы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">База</h3>
              <p className="text-4xl font-bold mb-6">Бесплатно</p>
              <ul className="mb-8">
                <li className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Доступ к базовым тестам
                </li>
                <li className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Ограниченное использование ИИ-чата
                </li>
                <li className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  5 решений задач по фото в месяц
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300">
                Выбрать план
              </button>
            </div>
            <div className="bg-blue-600 text-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-2xl font-bold mb-4">Премиум</h3>
              <p className="text-4xl font-bold mb-2">590 ₸ / каждую неделю</p>
              <p className="text-sm mb-6">Первая неделя бесплатно</p>
              <ul className="mb-8">
                <li className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Неограниченный доступ к тестам
                </li>
                <li className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Безлимитное использование ИИ-чата
                </li>
                <li className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Неограниченное решение задач по фото
                </li>
                <li className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Персональные рекомендации по обучению
                </li>
                <li className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Стоит как один сырник
                </li>
              </ul>
              <button className="w-full bg-white text-blue-600 py-3 rounded-full text-lg font-semibold hover:bg-blue-50 transition duration-300">
                Выбрать план
              </button>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-6">Живёте в сельской местности?</h2>
          <p className="text-xl text-gray-600 mb-8">Мы готовы покрыть ваши расходы на подписку на 3 месяца! 🤩</p>
          <button 
          className="bg-blue-600 text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-blue-700 transition duration-300"
          onClick={() => window.location.href = "https://t.me/math12_sup_bot"}>
            Узнать подробнее
          </button>
        </section>
      </div>
    </div>
  );
};

export default Home;
