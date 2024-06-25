"use client"

import { useState, useEffect } from 'react';

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

    return (
        <div className='mx-4 md:mx-[50px] pt-6'>
            <nav className="flex items-center justify-between">
                <h1 className={`text-2xl font-bold ${isOpen && isMobile ? 'hidden' : ''}`}>math12</h1>
                <button type="button" className={`text-gray-500 hover:text-white focus:outline-none focus:text-white ${isMobile ? '' : 'hidden'}`} onClick={() => setIsOpen(!isOpen)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                {!isMobile && (
                    <div className="flex space-x-4">
                        <a href="/" className="p-2 hover:underline hover:text-blue-600">Home</a>
                        <a href="#features" className="p-2 hover:underline hover:text-blue-600">Features</a>
                        <a href="#pricings" className="p-2 hover:underline hover:text-blue-600">Pricings</a>
                        <a href="/dashboard" className="p-2 hover:underline hover:text-blue-600">Dashboard</a>
                    </div>
                )}
            </nav>
            {isOpen && isMobile && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center">
                    <div className="flex space-y-4 text-center flex-col">
                        <a href="/" className="text-white p-2">Home</a>
                        <a href="/deals" className="text-white p-2">My deals</a>
                        <a href="/listings" className="text-white p-2">List an item</a>
                    </div>
                </div>
            )}
        </div>
    );
}