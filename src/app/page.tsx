"use client";

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import Image from "next/image";
import woman from "./woman.svg";
import Link from "next/link";

export default function Home() {
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
    <div className="mx-4 md:mx-[50px]">
      <div className="flex h-screen items-center justify-between flex-col-reverse sm:flex-row mb-8">
        <div>
          <div>
            <p className="font-bold text-[35px] md:text-[45px] text-blue-600">
              Понятная математика <u>с помощью ИИ.</u>
            </p>
            <p className="text-gray-500 text-[18px] md:text-[20px]">
              Освойте математику НИШ с персональным ИИ-репетитором
            </p>
          </div>
          <div className="mt-8">
            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
              onClick={() => window.location.href = "https://t.me/math12_sup_bot"}
            >
              Связаться с нами
            </button>
            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-100 text-blue-600 hover:bg-gray-200 h-10 px-4 py-2 ml-2 border-blue-600 border"
              onClick={() => window.location.href = "/test"}
            >
              Сдать тест
            </button>
          </div>
        </div>
        <div>
          <Image
            src={woman}
            alt="woman image"
            width={400}
            height={400}
          />
        </div>
      </div>
      <div>
        <div>
          <div>
            <p className="text-3xl font-bold mb-8">Основные функции</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-x-4 my-8 justify-evenly items-center">
            <div className="bg-background border rounded-lg p-6 feature-box">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 mb-4 text-blue-600"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Отслеживание успеваемости</h3>
              <p className="text-muted-foreground">
                Следите за своими оценками и прогрессом благодаря тестам. Вы сможете видеть, как меняются ваши результаты, и быстро выявлять области, которые требуют дополнительного внимания.
              </p>
            </div>
            <div className="bg-background border rounded-lg p-6 feature-box">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 mb-4 text-blue-600"
              >
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M3 10h18" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Гибкий график обучения</h3>
              <p className="text-muted-foreground">
                Учите математику в удобное для вас время и в любом месте. Наше приложение поддерживает обучение в любое время дня и ночи, так что вы можете планировать занятия по своему расписанию.
              </p>
            </div>
            <div className="bg-background border rounded-lg p-6 feature-box">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 mb-4 text-blue-600"
              >
                <line x1="12" x2="12" y1="20" y2="10"></line>
                <line x1="18" x2="18" y1="20" y2="4"></line>
                <line x1="6" x2="6" y1="20" y2="16"></line>
              </svg>
              <h3 className="text-xl font-bold mb-2">Помощь от ИИ</h3>
              <p className="text-muted-foreground">
                Наш ИИ MathAI всегда готов помочь вам с решением математических задач и ответами на любые вопросы. Просто задайте вопрос, и наш ИИ предоставит вам подробное объяснение и решение.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container my-8">
        <h2 className="text-3xl font-bold mb-8">Тарифы</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-background border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-600">База</h3>
            <p className="text-4xl font-bold mb-4">₸0</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-blue-600">
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
                Доступ ко всем основным ресурсам для обучения, включая теорию, упражнения и тесты.
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-blue-600">
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
                Возможность отслеживать свои оценки и видеть прогресс по каждому предмету.
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-red-500">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
                Ограниченное использование ИИ помощника MathAI для глубокого получения знаний.
              </li>
            </ul>
            <button className="bg-blue-600 text-white inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-blue-700 h-10 px-4 py-2">
              Войти в аккаунт
            </button>
          </div>
          <div className="bg-background border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-600">Pro</h3>
            <p className="text-4xl font-bold mb-1">₸749 в неделю</p>
            <div className="mb-4 bg-blue-600 text-white text-center rounded-xl sm:w-[60%] md:w-[60%]">
              <p>Первая неделя бесплатно</p>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-blue-600">
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
                Больше тестов, больше ответов от ИИ помощника MathAI для обучения.
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-blue-600">
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
                Расширенное отслеживание успеваемости с дополнительными аналитическими данными и рекомендациями по улучшению.
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-blue-600">
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
                Неограниченный доступ к ИИ помощнику MathAI для получения ответов на любые математические вопросы и получения статьей насчет темы.
              </li>
            </ul>
            <button className="bg-blue-600 text-white inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-blue-700 h-10 px-4 py-2">
              Войти в аккаунт
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
