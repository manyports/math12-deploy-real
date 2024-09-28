"use client";

import katex from "katex";
import "katex/dist/katex.min.css";
import { Send, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

interface SolutionData {
  fullSolution: string;
  error?: string;
}

export default function SolveMath() {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [solutions, setSolutions] = useState<SolutionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (solutions.length > 0) {
      renderLatex();
    }
  }, [solutions]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      processImages(files);
    }
  };

  const processImages = (files: File[]) => {
    setSelectedImages((prevImages) => [...prevImages, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  const handleImageDelete = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedImages.length === 0) return;

    setIsLoading(true);
    setSolutions([]);

    const formData = new FormData();
    selectedImages.forEach((image) => {
      formData.append(`images`, image);
    });

    try {
      const response = await fetch(
        "https://www.api.math12.studio/api/solveMath",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to solve math problems");
      }

      const data = await response.json();
      setSolutions(data.results);
    } catch (error) {
      console.error("Error solving math problems:", error);
      toast.error(
        "Произошла ошибка при решении задач. Пожалуйста, попробуйте еще раз."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderLatex = () => {
    const elements = document.getElementsByClassName("latex");
    Array.from(elements).forEach((element) => {
      katex.render(element.textContent || "", element as HTMLElement, {
        throwOnError: false,
        displayMode: true,
      });
    });
  };

  const formatSolution = (solution: string): string => {
    return solution
      .split("\n")
      .map((line) => {
        if (line.startsWith("**") && line.endsWith("**")) {
          return `<h3 class="text-xl font-bold mt-4 mb-2">${line.slice(
            2,
            -2
          )}</h3>`;
        } else if (line.startsWith("*") && line.endsWith("*")) {
          return `<h3 class="text-xl font-bold mt-4 mb-2">${line.slice(
            1,
            -1
          )}</h3>`;
        }
        return line.replace(
          /\$(.*?)\$/g,
          (_, math) => `<span class="latex">$${math}$</span>`
        );
      })
      .join("<br>");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <main className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">
          Решайте задачи с ИИ
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <label
              htmlFor="mathImage"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Загрузите или вставьте изображения своих задач
            </label>
            <div
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <span className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    Загрузить файлы
                  </span>
                  <p className="pl-1">или перетащите сюда</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF до 10MB каждый
                </p>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    width={150}
                    height={150}
                    className="rounded-lg w-full h-auto object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageDelete(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={selectedImages.length === 0 || isLoading}
            className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Решаем...
              </div>
            ) : (
              <>
                <Send className="mr-2" size={18} />
                Решить задачи
              </>
            )}
          </button>
        </form>

        {solutions.length > 0 && (
          <div className="mt-8 space-y-6">
            {solutions.map((solution, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
              >
                <h2 className="text-2xl font-bold mb-4 text-blue-600">
                  Решение задачи {index + 1}:
                </h2>
                {solution.error ? (
                  <p className="text-red-500">{solution.error}</p>
                ) : (
                  <div
                    className="prose prose-blue max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: formatSolution(solution.fullSolution),
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
