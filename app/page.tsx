"use client";

import { useState, ChangeEvent } from "react";
import axios from "axios";

interface Article {
  title: string;
  url: string;
  publishedAt: string;
  source?: { id: string | null; name: string };
  author?: string | null;
  description?: string | null;
  urlToImage?: string | null;
  content?: string | null;
}

export default function Home() {
  const [topic, setTopic] = useState<string>("");
  const [news, setNews] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    if (!topic) {
      alert("Please enter a topic!");
      return;
    }

    setError(null);
    try {
      const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
      console.log("API Key in browser:", apiKey);
      if (!apiKey) {
        throw new Error("NEXT_PUBLIC_NEWS_API_KEY is not defined.");
      }

      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=${topic}&apiKey=${apiKey}&sortBy=publishedAt`
      );

      console.log("NewsAPI Response:", response.data);
      const articles: Article[] = response.data.articles;
      if (articles.length === 0) {
        setError("No articles found for this topic.");
      } else {
        setNews(articles);
      }
    } catch (error) {
      // Type narrowing for error
      if (error instanceof Error) {
        console.error("AxiosError Details:", {
          message: error.message,
          code: "code" in error ? (error as any).code : undefined, // AxiosError type assertion if needed
        });
        setError(`Failed to fetch news: ${error.message}`);
      } else {
        console.error("Unknown error:", error);
        setError("Failed to fetch news: An unknown error occurred.");
      }
      setNews([]); // Reset news on error
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <div className="flex items-center space-x-2 mb-6">
        <span className="text-3xl bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-500 text-transparent bg-clip-text">
          🌸
        </span>
        <h1 className="text-4xl font-bold text-gray-800">PulseByLan</h1>
      </div>

      <div className="flex w-full max-w-lg mb-6">
        <input
          type="text"
          value={topic}
          onChange={handleInputChange}
          placeholder="Enter a topic (e.g., technology)"
          className="flex-grow p-3 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        />
        <button
          onClick={fetchNews}
          className="p-3 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>

      <div className="w-full max-w-lg">
        {error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : news.length > 0 ? (
          <ul className="space-y-4">
            {news.map((article, index) => (
              <li
                key={index}
                className="bg-white p-4 rounded-md shadow-md hover:shadow-lg transition-shadow"
              >
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-lg font-medium"
                >
                  {article.title}
                </a>
                <p className="text-sm text-gray-500 mt-1">
                  Published: {new Date(article.publishedAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-center">
            No news yet. Enter a topic and click Search!
          </p>
        )}
      </div>
    </div>
  );
}
