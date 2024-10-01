"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface ChatContextType {
  input: string;
  setInput: (input: string) => void;
  messages: Message[];
  loading: boolean;
  newChat: () => void;
  onSent: (prompt?: string) => void;
  streamResponse: () => AsyncGenerator<string, void, unknown>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentStream, setCurrentStream] =
    useState<ReadableStreamDefaultReader | null>(null);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const processGeminiResponse = (response: string): string => {
    response = response.replace(/\$\$(.*?)\$\$/gs, (_, p1) => `\\[${p1}\\]`);
    response = response.replace(/\$(.*?)\$/g, (_, p1) => `\\(${p1}\\)`);
    response = response.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    response = response.replace(/\*(.*?)\*/g, "<em>$1</em>");
    response = response.replace(/^# (.*?)$/gm, "<h1>$1</h1>");
    response = response.replace(/^## (.*?)$/gm, "<h2>$1</h2>");
    response = response.replace(/^### (.*?)$/gm, "<h3>$1</h3>");
    response = response.replace(/\n/g, "<br>");
    response = response.replace(/^\* (.*?)$/gm, "<li>$1</li>");
    response = response.replace(/^- (.*?)$/gm, "<li>$1</li>");
    response = response.replace(/---/g, "<hr>");
    response = response.replace(/^\> (.*?)$/gm, "<blockquote>$1</blockquote>");
    response = response.replace(/`(.*?)`/g, "<code>$1</code>");
    response = response.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    return response;
  };

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(
        "https://www.api.math12.studio/api/chat/history",
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        const processedMessages = data.history.map((message: Message) => ({
          ...message,
          timestamp: new Date(message.timestamp),
          content:
            message.role === "ai"
              ? processGeminiResponse(message.content)
              : message.content,
        }));
        setMessages(processedMessages);
      }
    } catch (error) {
      console.error("Error in fetchChatHistory:", error);
    }
  };

  const newChat = async () => {
    try {
      await fetch("https://www.api.math12.studio/api/chat/new", {
        method: "POST",
        credentials: "include",
      });
      setMessages([]);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  async function* streamResponse(): AsyncGenerator<string, void, unknown> {
    if (!currentStream) return;

    try {
      while (true) {
        const { done, value } = await currentStream.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        yield processGeminiResponse(chunk);
      }
    } finally {
      currentStream.releaseLock();
    }
  }

  const onSent = async (prompt?: string) => {
    const finalPrompt = prompt || input;
    if (!finalPrompt.trim()) return;

    setLoading(true);
    try {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: finalPrompt,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      const response = await fetch(
        "https://www.api.math12.studio/api/chat/stream",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: finalPrompt }),
          credentials: "include",
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("Stream response failed");
      }

      const reader = response.body.getReader();
      setCurrentStream(reader);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error in onSent:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "An error occurred while processing your request.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
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
        streamResponse,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
