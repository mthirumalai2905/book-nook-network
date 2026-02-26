import { useState, useCallback } from "react";

export interface GoogleBook {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  publishedDate: string;
}

export function useBookSearch() {
  const [results, setResults] = useState<GoogleBook[]>([]);
  const [searching, setSearching] = useState(false);

  const searchBooks = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10`
      );
      const data = await res.json();
      const items = data.items || [];
      setResults(
        items.map((item: any) => ({
          id: item.id,
          title: item.volumeInfo?.title || "Unknown",
          author: item.volumeInfo?.authors?.join(", ") || "Unknown",
          coverImage: item.volumeInfo?.imageLinks?.thumbnail || "",
          description: item.volumeInfo?.description?.slice(0, 200) || "",
          publishedDate: item.volumeInfo?.publishedDate || "",
        }))
      );
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  return { results, searching, searchBooks, clearResults: () => setResults([]) };
}
