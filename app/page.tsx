"use client";

import { useState, ChangeEvent } from "react";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchNews = async () => {
    if (!topic) {
      alert("Please enter a topic!");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Call our own API route instead of the News API directly
      const response = await fetch(`/api/news?topic=${encodeURIComponent(topic)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.articles && data.articles.length > 0) {
        setNews(data.articles);
      } else {
        setError("No articles found for this topic.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(`Failed to fetch news: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
      setNews([]); // Reset news on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <div className="flex items-center space-x-2 mb-6">
        <span className="text-3xl">🌸</span>
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
          disabled={isLoading}
          className="p-3 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          {isLoading ? "Loading..." : "Search"}
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
            {isLoading ? "Fetching news..." : "No news yet. Enter a topic and click Search!"}
          </p>
        )}
      </div>
    </div>
  );
}