"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Copy, Plus, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useChatContext } from "../../context/ChatContext";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

declare global {
  interface Window {
    MathJax?: {
      typesetPromise: () => Promise<void>;
    };
  }
}

export default function ChatComponent() {
  const {
    input,
    setInput,
    messages,
    loading,
    onSent,
    newChat,
    streamResponse,
  } = useChatContext();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [currentAiMessage, setCurrentAiMessage] = useState<string>("");

  const handleSend = () => {
    if (input.trim()) {
      onSent();
      setInput("");
      setCurrentAiMessage("");
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerate = (id: string) => {
    setCurrentAiMessage("");
    onSent("Regenerate response for message " + id);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, currentAiMessage]);

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise();
    }
  }, [messages, currentAiMessage]);

  useEffect(() => {
    let isMounted = true;

    const fetchStreamResponse = async () => {
      if (loading) {
        for await (const chunk of streamResponse()) {
          if (isMounted) {
            setCurrentAiMessage((prev) => prev + chunk);
          }
        }
      }
    };

    fetchStreamResponse();

    return () => {
      isMounted = false;
    };
  }, [loading, streamResponse]);

  return (
    <div className="flex flex-col h-screen bg-white text-black">
      <div className="p-4 border-b border-gray-200">
        <Button
          onClick={newChat}
          variant="outline"
          className="flex items-center justify-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Создать новый чат
        </Button>
      </div>
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <div
                className={`p-3 rounded-lg ${
                  message.role === "ai"
                    ? "bg-gray-100 text-black"
                    : "bg-blue-600 text-white"
                }`}
              >
                <p className="font-semibold mb-1">
                  {message.role === "ai" ? "AI" : "Вы"}
                </p>
                {message.role === "ai" ? (
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: message.content }}
                  />
                ) : (
                  <p className="whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                )}
                <p className="text-xs mt-1 opacity-70">
                  {format(message.timestamp, "HH:mm:ss")}
                </p>
              </div>
              {message.role === "ai" && (
                <div className="flex justify-start mt-1 space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleCopy(message.content, message.id)
                          }
                          className="text-xs"
                        >
                          <AnimatePresence>
                            {copiedId === message.id ? (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              >
                                Скопировано!
                              </motion.span>
                            ) : (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Копировать
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Копировать сообщение</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </motion.div>
          ))}
          {loading && currentAiMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <div className="p-3 rounded-lg bg-gray-100 text-black">
                <p className="font-semibold mb-1">AI</p>
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: currentAiMessage }}
                />
                <p className="text-xs mt-1 opacity-70">
                  {format(new Date(), "HH:mm:ss")}
                </p>
              </div>
            </motion.div>
          )}
          {loading && currentAiMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <div className="p-3 rounded-lg bg-gray-100 text-black">
                <p className="font-semibold mb-1">AI</p>
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: currentAiMessage }}
                />
                <p className="text-xs mt-1 opacity-70">
                  {format(new Date(), "HH:mm:ss")}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Введите ваше сообщение..."
            className="flex-grow"
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="bg-blue-600 text-white rounded-full"
            disabled={loading}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
