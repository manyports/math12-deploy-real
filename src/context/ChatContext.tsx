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

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const processGeminiResponse = (response: string): string => {
    response = response.replace(/\$\$(.*?)\$\$/gs, (_, p1) => `\\[${p1}\\]`);
    response = response.replace(/\$(.*?)\$/g, (_, p1) => `\\(${p1}\\)`);
    response = response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    response = response.replace(/\*(.*?)\*/g, '<em>$1</em>');
    response = response.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    response = response.replace(/^## (.*?)$/gm, '<h2>$1</2>');
    response = response.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    response = response.replace(/\n/g, '<br>');
    response = response.replace(/^\* (.*?)$/gm, '<li>$1</li>');
    response = response.replace(/^- (.*?)$/gm, '<li>$1</li>');
    response = response.replace(/---/g, '<hr>');
    response = response.replace(/^\> (.*?)$/gm, '<blockquote>$1</blockquote>');
    response = response.replace(/`(.*?)`/g, '<code>$1</code>');
    response = response.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    return response;
  };

  const fetchChatHistory = async () => {
    try {
      const response = await fetch('https://www.api.math12.studio/api/chat/history', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        const processedMessages = data.history.map((message: Message) => ({
          ...message,
          content: message.role === 'ai' ? processGeminiResponse(message.content) : message.content,
        }));
        setMessages(processedMessages);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const newChat = async () => {
    try {
      await fetch('https://www.api.math12.studio/api/chat/new', {
        method: 'POST',
        credentials: 'include'
      });
      setMessages([]);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const onSent = async (prompt?: string) => {
    setLoading(true);
    const finalPrompt = prompt || input;
    const humanMessage: Message = {
      role: 'human',
      content: finalPrompt,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, humanMessage];
    setMessages(updatedMessages);

    try {
      const response = await fetch('https://www.api.math12.studio/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: finalPrompt }),
        credentials: 'include'
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
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'ai',
        content: 'An error occurred while processing your request.',
        timestamp: Date.now(),
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
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
        newChat,
        onSent,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};