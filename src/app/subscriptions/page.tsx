export default function Subscriptions(){
    return(
        <div className="min-h-screen flex flex-col justify-between mx-4 md:mx-12 mt-8">
            <div className="flex-1 flex items-center justify-center flex-col mb-8">
                <div>
                    <p className="font-bold text-2xl md:text-4xl text-blue-600 text-center">Добро пожаловать на страницу подписок.</p>
                    <p className="text-gray-500 text-lg md:text-xl text-center">Подпишитесь на что желаете прямо здесь, прямо сейчас.</p>
                </div>
                    <div className="flex flex-col space-y-6 md:justify-center sm:mx-20 lg:mx-40 md:space-x-6 pt-10 md:flex-row md:space-y-0  ">
                        <div className="bg-background border rounded-lg p-6 md:w-1/2">
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
                            <button className="bg-blue-200 text-white inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-blue-700 h-10 px-4 py-2">
                                Вы уже подписаны
                            </button>
                        </div>
                        <div className="bg-background border rounded-lg p-6 md:w-1/2 mt-0">
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
                                    Полный доступ ко всем ресурсам для обучения, включая продвинутые лекции и дополнительные материалы.
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
                                🔥 подписаться
                            </button>
                        </div>
                    </div>
                </div>
        </div>
    );
};
