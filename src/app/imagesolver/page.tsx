"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface SolutionData {
  fullSolution: string;
  latexExpressions: string[];
  numericalAnswer: string;
}

export default function SolveMath() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [solution, setSolution] = useState<SolutionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (solution) {
      renderLatex();
    }
  }, [solution]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedImage) return;

    setIsLoading(true);
    setSolution(null);

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch('https://math12-backend-production.up.railway.app/api/solveMath', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to solve math problem');
      }

      const data: SolutionData = await response.json();
      setSolution(data);
    } catch (error) {
      console.error('Error solving math problem:', error);
      setSolution({
        fullSolution: "An error occurred while solving the problem. Please try again.",
        latexExpressions: [],
        numericalAnswer: "N/A"
      });
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
        return `<h3 class="text-lg font-semibold mt-2 mb-1">${line.slice(2, -2)}</h3>`;
      }
      return line.replace(/\$(.*?)\$/g, (_, math) => `<span class="latex">$${math}$</span>`);
    }).join('<br>');
  };

  return (
    <div className="mx-4 md:mx-[50px]">
      <main className="min-h-screen py-8">
        <h1 className="text-3xl font-bold mb-8 text-blue-600">Решайте задачи с ИИ</h1>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <label htmlFor="mathImage" className="block text-sm font-medium text-gray-700 mb-2">
              Загрузите картину своей задачи ИЛИ сфотографируйте ее
            </label>
            <input
              type="file"
              id="mathImage"   
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          {preview && (
            <div className="mb-4">
              <Image src={preview} alt="Preview" width={300} height={300} className="rounded-lg" />
            </div>
          )}

          <button
            type="submit"
            disabled={!selectedImage || isLoading}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
          >
            {isLoading ? 'Решаем...' : 'Решить задачу'}
          </button>
        </form>

        {isLoading && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">ИИ пытается решить вашу задачу...</p>
          </div>
        )}

        {solution && (
          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Решение:</h2>
            <div 
              className="text-gray-800 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: formatSolution(solution.fullSolution) }}
            />
          </div>
        )}
      </main>
    </div>
  );
}