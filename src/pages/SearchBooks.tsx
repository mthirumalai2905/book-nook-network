import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useBookSearch, GoogleBook } from "@/hooks/useBookSearch";
import { useBooks } from "@/hooks/useBooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

export default function SearchBooks() {
  const [query, setQuery] = useState("");
  const { results, searching, searchBooks } = useBookSearch();
  const { addBook } = useBooks();

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      searchBooks(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query, searchBooks]);

  const handleAdd = (book: GoogleBook) => {
    addBook({
      title: book.title,
      author: book.author,
      cover_image: book.coverImage,
      description: book.description,
      published_date: book.publishedDate,
      google_books_id: book.id,
    });
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-3xl">
        <h1 className="text-xl font-semibold text-foreground mb-1">Search Books</h1>
        <p className="text-sm text-muted-foreground mb-6">Find books and add them to your collection</p>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, author..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {searching && <p className="text-sm text-muted-foreground">Searching...</p>}

        <div className="space-y-1">
          {results.map((book) => (
            <div
              key={book.id}
              className="flex items-start gap-3 p-3 border border-border rounded-md hover:bg-accent/50 transition-colors"
            >
              {book.coverImage ? (
                <img src={book.coverImage} alt={book.title} className="h-16 w-11 object-cover rounded flex-shrink-0" />
              ) : (
                <div className="h-16 w-11 bg-muted rounded flex-shrink-0 flex items-center justify-center text-xs text-muted-foreground">?</div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground">{book.title}</h3>
                <p className="text-xs text-muted-foreground">{book.author} · {book.publishedDate}</p>
                {book.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{book.description}</p>
                )}
              </div>
              <Button size="sm" variant="outline" onClick={() => handleAdd(book)} className="flex-shrink-0">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add
              </Button>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
