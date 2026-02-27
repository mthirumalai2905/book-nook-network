import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useBooks } from "@/hooks/useBooks";
import { StarRating } from "@/components/StarRating";
import { BookStatusBadge } from "@/components/BookStatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, LayoutGrid, List } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function Books() {
  const { books, loading, updateBook, deleteBook } = useBooks();
  const [viewMode, setViewMode] = useState<"table" | "grid">(() => {
    return (localStorage.getItem("books-view-mode") as "table" | "grid") || "table";
  });

  const handleViewModeChange = (mode: "table" | "grid") => {
    setViewMode(mode);
    localStorage.setItem("books-view-mode", mode);
  };
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">My Books</h1>
            <p className="text-sm text-muted-foreground">{books.length} books in your collection</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-border rounded-md overflow-hidden">
              <button
                onClick={() => handleViewModeChange("table")}
                className={`p-2 transition-colors ${viewMode === "table" ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50"}`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleViewModeChange("grid")}
                className={`p-2 transition-colors ${viewMode === "grid" ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50"}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
            <Button onClick={() => navigate("/search")} size="sm">
              + Add Book
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground">Loading books...</div>
        ) : books.length === 0 ? (
          <div className="border border-dashed border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground mb-2">No books yet</p>
            <Button variant="outline" size="sm" onClick={() => navigate("/search")}>
              Search and add your first book
            </Button>
          </div>
        ) : viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="notion-table">
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Date Added</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    <td>
                      {book.cover_image ? (
                        <img src={book.cover_image} alt={book.title} className="h-12 w-8 object-cover rounded" />
                      ) : (
                        <div className="h-12 w-8 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">?</div>
                      )}
                    </td>
                    <td className="font-medium text-foreground">{book.title}</td>
                    <td className="text-muted-foreground">{book.author}</td>
                    <td>
                      <StarRating rating={book.rating || 0} onChange={(r) => updateBook(book.id, { rating: r })} />
                    </td>
                    <td>
                      <Select
                        value={book.status}
                        onValueChange={(v) => updateBook(book.id, { status: v })}
                      >
                        <SelectTrigger className="w-32 h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reading">Reading</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="wishlist">Wishlist</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="text-muted-foreground text-xs">
                      {format(new Date(book.added_at), "MMM d, yyyy")}
                    </td>
                    <td>
                      <button onClick={() => deleteBook(book.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {books.map((book) => (
              <div key={book.id} className="notion-card group">
                <div className="aspect-[2/3] mb-3 rounded overflow-hidden bg-muted">
                  {book.cover_image ? (
                    <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No cover</div>
                  )}
                </div>
                <h3 className="text-sm font-medium text-foreground truncate">{book.title}</h3>
                <p className="text-xs text-muted-foreground truncate mb-2">{book.author}</p>
                <div className="flex items-center justify-between">
                  <BookStatusBadge status={book.status} />
                  <StarRating rating={book.rating || 0} onChange={(r) => updateBook(book.id, { rating: r })} size={12} />
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <Select value={book.status} onValueChange={(v) => updateBook(book.id, { status: v })}>
                    <SelectTrigger className="w-24 h-6 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reading">Reading</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="wishlist">Wishlist</SelectItem>
                    </SelectContent>
                  </Select>
                  <button onClick={() => deleteBook(book.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
