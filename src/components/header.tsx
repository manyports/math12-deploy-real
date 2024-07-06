"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    useEffect(() => {
        if (window.innerWidth < 768) {
            setIsMobile(true);
        }
    }, []);

    function CloseBurger() {
        setIsOpen(false);
    }

    const variants = {
        hidden: { opacity: 0, x: 100 },
        visible: { opacity: 1, x: 0 },
    };

    const list = {
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
        hidden: {
            opacity: 0,
        },
    };

    return (
        <div className='relative z-50 mx-4 md:mx-[50px] pt-6 bg-transparent'>
            <nav className="flex items-center justify-between">
                <h1 className={`text-2xl font-bold ${isOpen && isMobile ? 'hidden' : ''}`} onClick={() => window.location.href = "/" }>math12.ai</h1>
                <button type="button" className={`text-gray-500 hover:text-white focus:outline-none focus:text-white ${isMobile ? '' : 'hidden'}`} onClick={() => setIsOpen(!isOpen)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                {!isMobile && (
                    <div className="flex space-x-4">
                        <a href="/" className="p-2 hover:underline hover:text-blue-600">Главная</a>
                        <a href="/dashboard" className="p-2 hover:underline hover:text-blue-600">Личный кабинет</a>
                        <a href="/subscriptions" className="p-2 hover:underline hover:text-blue-600">Подписки</a>
                    </div>
                )}
            </nav>
            <AnimatePresence>
                {isOpen && isMobile && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed inset-0 bg-white flex"
                    >
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={list}
                            className="flex flex-col text-[30px] p-[7vh] justify-around"
                        >
                            <motion.div variants={variants} className='flex flex-col'>
                                <a href="/" className="p-2 text-[#2563eb] font-extrabold">-&gt; Главная</a>
                                <a href="/dashboard" className="p-2 text-[#2563eb] font-extrabold">-&gt; Кабинет</a>
                                <a href="/subscriptions" className= "p-2 text-[#2563eb] font-extrabold">-&gt; Подписки </a>
                            </motion.div>
                            <motion.div variants={variants} className='flex flex-col'>
                                <button className='border rounded-2xl border-[#2563eb] text-[#2563eb] text-[24px] font-bold' onClick={CloseBurger}>Вернуться -&gt;</button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}