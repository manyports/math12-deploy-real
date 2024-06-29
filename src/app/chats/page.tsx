'use client';

import { useChatContext } from '../../context/ChatContext';
import { useEffect } from 'react';
import { format } from 'date-fns';

declare global {
  interface Window {
    MathJax: any;
  }
}

const ChatComponent = () => {
  const { input, setInput, messages, loading, remainingQuestions, onSent, newChat } = useChatContext();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessage = () => {
    onSent();
  };

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise();
    }
  }, [messages]);

  return (
    <div className="p-4 md:px-[25vw] h-screen flex flex-col">
      <div className="flex flex-col mb-8 items-center">
        <p className="text-center font-bold text-2xl text-blue-500">
          Ask any question to the AI 👾
        </p>
        <p className="text-center font-bold text-lg text-blue-500 border rounded-xl p-3 md:w-1/2 w-full">
          You have {remainingQuestions} questions remaining
        </p>
        <button 
          onClick={newChat} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          New Chat
        </button>
      </div>
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col h-full rounded-lg border">
          <div className="flex-1 overflow-auto p-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-4 mt-4 ${message.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                <div className={`font-bold ${message.role === 'ai' ? 'text-blue-500' : 'text-green-500'}`}>
                  {message.role === 'ai' ? 'AI' : 'You'}
                </div>
                <div className="prose text-muted-foreground">
                  {message.role === 'ai' ? (
                    <div dangerouslySetInnerHTML={{ __html: message.content }} />
                  ) : (
                    <p>{message.content}</p>
                  )}
                  <small className="text-gray-500">
                    {format(message.timestamp, 'HH:mm:ss')}
                  </small>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-4 mt-4">
                <div className="font-bold text-blue-500">AI</div>
                <div className="prose text-muted-foreground">
                  <p>Loading...</p>
                </div>
              </div>
            )}
          </div>
          <div className="w-full sticky bottom-0 py-2 flex flex-col gap-1.5 px-4 bg-background">
            <div className="relative">
              <textarea
                className="flex w-full bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[48px] rounded-2xl resize-none p-4 border border-neutral-400 shadow-sm pr-16"
                placeholder="Message the AI"
                name="message"
                id="message"
                rows={1}
                value={input}
                onChange={handleInputChange}
                disabled={remainingQuestions <= 0}
              />
              <button
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 absolute w-8 h-8 top-3 right-3"
                type="submit"
                onClick={handleSendMessage}
                disabled={loading || remainingQuestions <= 0}
              >
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
                  className="w-4 h-4 text-blue-500"
                >
                  <path d="m5 12 7-7 7 7"></path>
                  <path d="M12 19V5"></path>
                </svg>
                <span className="sr-only">Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;