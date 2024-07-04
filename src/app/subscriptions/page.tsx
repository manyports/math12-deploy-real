"use client";
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';


export default function Subscriptions(){

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

    return(
        <div className="min-h-screen flex flex-col justify-between mx-4 md:mx-12 mt-8">
            <div className="flex-1 flex items-center justify-center flex-col mb-8">
                <div>
                    <p className="font-bold text-2xl md:text-4xl text-blue-600 text-center">Добро пожаловать на страницу подписок.</p>
                    <p className="text-gray-500 text-lg md:text-xl text-center">Подпишитесь на что желаете прямо здесь, прямо сейчас.</p>
                </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
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
                </div>
        </div>
    );
};
