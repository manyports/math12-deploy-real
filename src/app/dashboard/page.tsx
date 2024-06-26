import Image from "next/image";

export default function Dashboard() {
    return (
        <div className="min-h-screen flex flex-col justify-between mx-4 md:mx-12 mt-8">
            <div className="flex-1 flex items-center justify-center flex-col mb-8">
                <div>
                    <p className="font-bold text-2xl md:text-4xl text-blue-600 text-center">Добро пожаловать на личный кабинет.</p>
                    <p className="text-gray-500 text-lg md:text-xl text-center">Здесь вы можете работать с нашей платформой :)</p>
                </div>
                <div className="flex flex-col md:flex-row gap-6 mt-6 w-full">
                    <div className="bg-card text-card-foreground rounded-lg p-6 shadow-md w-full md:w-1/3 flex flex-col items-center justify-between">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 mb-4 text-blue-600">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                            <path d="m15 5 4 4"></path>
                        </svg>
                        <h2 className="text-2xl font-bold mb-4">Пройти тест</h2>
                        <p className="mb-4 text-center">Продемонстрируйте свои знания и докажите свое академическое мастерство, пройдя наш тест.</p>
                        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-100 text-blue-600 hover:bg-gray-200 h-10 px-4 py-2 border border-blue-600">
                            🔥 начать
                        </button>
                    </div>
                    <div className="bg-card text-card-foreground rounded-lg p-6 shadow-md w-full md:w-1/3 flex flex-col items-center justify-between">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 mb-4 text-blue-600">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" x2="9" y1="12" y2="12"></line>
                        </svg>
                        <h2 className="text-2xl font-bold mb-4 text-center">Выйти</h2>
                        <p className="mb-4 text-center">Нажмите кнопку ниже, чтобы безопасно и надежно выйти из своей учетной записи.</p>
                        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-100 text-blue-600 hover:bg-gray-200 h-10 px-4 py-2 border border-blue-600">
                            👋 пока
                        </button>
                    </div>
                    <div className="bg-card text-card-foreground rounded-lg shadow-md w-full md:w-1/2 p-6 flex flex-col items-center justify-between">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 mb-4 text-blue-600">
                            <circle cx="12" cy="10" r="8"></circle>
                            <circle cx="12" cy="10" r="3"></circle>
                            <path d="M7 22h10"></path>
                            <path d="M12 22v-4"></path>
                        </svg>
                        <h2 className="text-2xl font-bold mb-4">Переписка с ИИ</h2>
                        <p className="mb-4 text-center">Примите участие в увлекательной беседе с нашим интеллектуальным помощником MathAI и откройте для себя новые идеи.</p>
                        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-100 text-blue-600 hover:bg-gray-200 h-10 px-4 py-2 border border-blue-600">
                            💯 напиши
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
