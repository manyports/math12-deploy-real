"use client";

import { useState } from 'react';
import userimage from "../placeholder-user.jpg";
import Image from 'next/image';

export default function ChatComponent(){
  const [message, setMessage] = useState('');

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    setMessage('');
  };

  return (
    <div className='p-4 md:px-[25vw] h-screen flex flex-col'>
      <div className='flex flex-col mb-8 items-center'>
        <p className='text-center font-bold text-2xl text-blue-500'>Спрашивайте любые вопросы у ИИ 👾</p>
        <p className='text-center font-bold text-lg text-blue-500 border rounded-xl p-3 md:w-1/2 w-full'>У вас осталось : 5 вопросов</p>
      </div>
      <div className='flex-grow overflow-auto'>
        <div className='flex flex-col h-full rounded-lg border'>
          <div className='flex-1 overflow-auto p-4'>
            <div className='flex items-start gap-4'>
              <span className='relative flex shrink-0 overflow-hidden rounded-full w-8 h-8 border'>
                <Image 
                  src={userimage}
                  alt="User"   
                  className='aspect-square h-full w-full'
                />
              </span>
              <div className='grid gap-1'>
                <div className='font-bold'>MathAI</div>
                <div className='prose text-muted-foreground'>
                  <p>Hello! I'm an AI assistant created by Anthropic. How can I help you today?</p>
                </div>
              </div>
            </div>
            <div className='flex items-start gap-4 mt-4'>
              <span className='relative flex shrink-0 overflow-hidden rounded-full w-8 h-8 border'>
                <Image 
                  src={userimage}
                  alt="User"   
                  className='aspect-square h-full w-full'
                />
              </span>
              <div className='grid gap-1'>
                <div className='font-bold'>You</div>
                <div className='prose text-muted-foreground'>
                  <p>Hi there! I have a few questions about the test results you provided earlier. Can you help me understand them better?</p>
                </div>
              </div>
            </div>
            <div className='flex items-start gap-4 mt-4'>
              <span className='relative flex shrink-0 overflow-hidden rounded-full w-8 h-8 border'>
                <Image 
                  src={userimage}
                  alt="User"   
                  className='aspect-square h-full w-full'
                />
              </span>
              <div className='grid gap-1'>
                <div className='font-bold'>MathAI</div>
                <div className='prose text-muted-foreground'>
                  <p>Absolutely, I'd be happy to help you understand the test results. What specific questions do you have?</p>
                </div>
              </div>
            </div>
          </div>
          <div className='w-full sticky bottom-0 py-2 flex flex-col gap-1.5 px-4 bg-background'>
            <div className='relative'>
              <textarea
                className='flex w-full bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[48px] rounded-2xl resize-none p-4 border border-neutral-400 shadow-sm pr-16'
                placeholder="Message MathAI"
                name="message"
                id="message"
                rows={1}
                value={message}
                onChange={handleMessageChange}
              />
              <button
                className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 absolute w-8 h-8 top-3 right-3'
                type="submit"
                onClick={handleSendMessage}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='w-4 h-4 text-blue-500'>
                  <path d='m5 12 7-7 7 7'></path>
                  <path d='M12 19V5'></path>
                </svg>
                <span className='sr-only'>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
