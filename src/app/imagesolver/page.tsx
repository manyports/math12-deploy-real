"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import toast, { Toaster } from 'react-hot-toast';

interface SolutionData {
  fullSolution: string;
  error?: string;
}

interface UploadInfo {
  count: number;
  lastUploadTime: number;
}

export default function SolveMath() {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [solutions, setSolutions] = useState<SolutionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadInfo, setUploadInfo] = useState<UploadInfo>({ count: 0, lastUploadTime: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedInfo = localStorage.getItem('uploadInfo');
    if (storedInfo) {
      setUploadInfo(JSON.parse(storedInfo));
    }
  }, []);

  useEffect(() => {
    if (solutions.length > 0) {
      renderLatex();
    }
  }, [solutions]);

  const checkUploadLimit = useCallback((): boolean => {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    if (uploadInfo.lastUploadTime < oneDayAgo) {
      setUploadInfo({ count: 0, lastUploadTime: now });
      return true;
    }

    if (uploadInfo.count >= 10) {
      toast.error("Вы достигли лимита загрузок (10 попыток за 24 часа). Попробуйте позже.");
      return false;
    }

    return true;
  }, [uploadInfo]);

  const updateUploadInfo = useCallback(() => {
    const newInfo = {
      count: uploadInfo.count + 1,
      lastUploadTime: Date.now(),
    };
    setUploadInfo(newInfo);
    localStorage.setItem('uploadInfo', JSON.stringify(newInfo));
  }, [uploadInfo]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      processImages(files);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      const imageFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            imageFiles.push(file);
          }
        }
      }
      if (imageFiles.length > 0) {
        processImages(imageFiles);
      }
    }
  };

  const processImages = (files: File[]) => {
    setSelectedImages(prevImages => [...prevImages, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
  };

  const handleImageDelete = (index: number) => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
    setPreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedImages.length === 0) return;
    if (!checkUploadLimit()) return;

    setIsLoading(true);
    setSolutions([]);

    const formData = new FormData();
    selectedImages.forEach((image, index) => {
      formData.append(`images`, image);
    });

    try {
      const response = await fetch('https://www.api.webdoors.tech/api/solveMath', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to solve math problems');
      }

      const data = await response.json();
      setSolutions(data.results);
      updateUploadInfo();
    } catch (error) {
      console.error('Error solving math problems:', error);
      toast.error("Произошла ошибка при решении задач. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderLatex = () => {
    const elements = document.getElementsByClassName('latex');
    Array.from(elements).forEach((element) => {
      katex.render(element.textContent || '', element as HTMLElement, {
        throwOnError: false,
        displayMode: true,
      });
    });
  };

  const formatSolution = (solution: string): string => {
    return solution.split('\n').map(line => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return `<h3 class="text-xl font-bold mt-4 mb-2">${line.slice(2, -2)}</h3>`;
      }
      return line.replace(/\$(.*?)\$/g, (_, math) => `<span class="latex">$${math}$</span>`);
    }).join('<br>');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
      processImages(files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <style>{`
          .katex-display {
            overflow-x: auto;
            overflow-y: hidden;
            padding: 0.5em 0;
          }
        `}</style>
      </Head>
      <Toaster position="top-right" />
      <main className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden w-full">
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6 sm:mb-8">Решайте задачи с ИИ</h1>

          <form onSubmit={handleSubmit} className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="mathImage" className="block text-sm font-medium text-gray-700 mb-2">
                Загрузите или вставьте изображения своих задач (лимит: 10 попыток за 24 часа)
              </label>
              <div 
                className="mt-1 flex justify-center px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500 transition-colors"
                onPaste={handlePaste}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={handleUploadAreaClick}
              >
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <span className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      Загрузить файлы
                    </span>
                    <p className="pl-1">или перетащите сюда</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF до 10MB каждый</p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                id="mathImage"
                name="mathImage"
                type="file"
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
                multiple
              />
            </div>

            {previews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative">
                    <Image 
                      src={preview} 
                      alt={`Preview ${index + 1}`} 
                      width={150} 
                      height={150} 
                      className="rounded-lg mx-auto max-w-full h-auto"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageDelete(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={selectedImages.length === 0 || isLoading || uploadInfo.count >= 10}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
            >
              {isLoading ? 'Решаем...' : 'Решить задачи'}
            </button>
          </form>

          {isLoading && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">ИИ пытается решить ваши задачи...</p>
            </div>
          )}

          {solutions.length > 0 && (
            <div className="space-y-6">
              {solutions.map((solution, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 sm:p-6 shadow-inner">
                  <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">Решение задачи {index + 1}:</h2>
                  {solution.error ? (
                    <p className="text-red-500">{solution.error}</p>
                  ) : (
                    <div 
                      className="text-gray-800 whitespace-pre-wrap prose prose-sm sm:prose prose-blue max-w-none"
                      dangerouslySetInnerHTML={{ __html: formatSolution(solution.fullSolution) }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}