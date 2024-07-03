"use client";
import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';

interface Message {
  role: 'human' | 'ai';
  content: string;
  timestamp: number;
}

interface ChatContextType {
  input: string;
  setInput: (input: string) => void;
  messages: Message[];
  loading: boolean;
  remainingQuestions: number;
  newChat: () => void;
  onSent: (prompt?: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

const INITIAL_QUESTIONS = 5;
const RESET_INTERVAL = 24 * 60 * 60 * 1000; 

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [remainingQuestions, setRemainingQuestions] = useState<number>(INITIAL_QUESTIONS);

  useEffect(() => {
    const loadSavedData = () => {
      const savedMessages = localStorage.getItem('chatMessages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }

      const savedQuestionsData = localStorage.getItem('questionsData');
      if (savedQuestionsData) {
        const { remaining, lastReset } = JSON.parse(savedQuestionsData);
        const now = Date.now();
        if (now - lastReset > RESET_INTERVAL) {
          setRemainingQuestions(INITIAL_QUESTIONS);
          saveQuestionsData(INITIAL_QUESTIONS);
        } else {
          setRemainingQuestions(remaining);
        }
      } else {
        saveQuestionsData(INITIAL_QUESTIONS);
      }
    };

    loadSavedData();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  const saveQuestionsData = (remaining: number) => {
    const data = { remaining, lastReset: Date.now() };
    localStorage.setItem('questionsData', JSON.stringify(data));
  };

  const newChat = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
    saveQuestionsData(INITIAL_QUESTIONS);
  };

  const processGeminiResponse = (response: string): string => {
    response = response.replace(/\$\$(.*?)\$\$/gs, (match, p1) => `\\[${p1}\\]`);
    response = response.replace(/\$(.*?)\$/g, (match, p1) => `\\(${p1}\\)`);
    response = response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    response = response.replace(/\*(.*?)\*/g, '<em>$1</em>');
    response = response.replace(/## (.*?)$/gm, '<h2>$1</h2>');
    response = response.replace(/# (.*?)$/gm, '<h1>$1</h1>');
    response = response.replace(/---/g, '<hr>');
    response = response.replace(/^\> (.*?)$/gm, '<blockquote>$1</blockquote>');
    response = response.replace(/`(.*?)`/g, '<code>$1</code>');
    response = response.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

    return response;
  };

  const onSent = async (prompt?: string) => {
    if (remainingQuestions <= 0) return;

    setLoading(true);
    const finalPrompt = prompt || input;
    const humanMessage: Message = {
      role: 'human',
      content: finalPrompt,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, humanMessage];
    setMessages(updatedMessages);
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));

    const newRemaining = remainingQuestions - 1;
    setRemainingQuestions(newRemaining);
    saveQuestionsData(newRemaining);

    try {
      const response = await fetch('math12-backend-production.up.railway.app/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from API');
      }

      const data = await response.json();
      const aiMessage: Message = {
        role: 'ai',
        content: processGeminiResponse(data.text),
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      localStorage.setItem('chatMessages', JSON.stringify(finalMessages));
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'ai',
        content: 'An error occurred while processing your request.',
        timestamp: Date.now(),
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      localStorage.setItem('chatMessages', JSON.stringify(finalMessages));
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <ChatContext.Provider
      value={{
        input,
        setInput,
        messages,
        loading,
        remainingQuestions,
        newChat,
        onSent,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};