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
            <h1 className="text-2xl font-black text-foreground">My Books</h1>
            <p className="text-sm text-muted-foreground font-medium">{books.length} books in your collection</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border-2 border-foreground overflow-hidden shadow-[2px_2px_0px_hsl(var(--foreground))]">
              <button
                onClick={() => handleViewModeChange("table")}
                className={`p-2 transition-all ${viewMode === "table" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-accent"}`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleViewModeChange("grid")}
                className={`p-2 transition-all ${viewMode === "grid" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-accent"}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
            <Button
              onClick={() => navigate("/search")}
              size="sm"
              className="bg-foreground text-background font-bold border-2 border-foreground shadow-[3px_3px_0px_hsl(var(--primary))] hover:shadow-[1px_1px_0px_hsl(var(--primary))] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              + Add Book
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground">Loading books...</div>
        ) : books.length === 0 ? (
          <div className="border-2 border-dashed border-foreground p-12 text-center">
            <p className="text-muted-foreground mb-3 font-medium">No books yet</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/search")}
              className="border-2 border-foreground font-bold shadow-[3px_3px_0px_hsl(var(--foreground))] hover:shadow-[1px_1px_0px_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              Search and add your first book
            </Button>
          </div>
        ) : viewMode === "table" ? (
          <div className="overflow-x-auto border-2 border-foreground shadow-[4px_4px_0px_hsl(var(--foreground))]">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-foreground">
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-foreground bg-accent">Cover</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-foreground bg-accent">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-foreground bg-accent">Author</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-foreground bg-accent">Rating</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-foreground bg-accent">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-foreground bg-accent">Date Added</th>
                  <th className="px-4 py-3 bg-accent"></th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className="border-b-2 border-foreground/20 hover:bg-accent/50 transition-colors">
                    <td className="px-4 py-3">
                      {book.cover_image ? (
                        <img src={book.cover_image} alt={book.title} className="h-12 w-8 object-cover border-2 border-foreground" />
                      ) : (
                        <div className="h-12 w-8 bg-accent border-2 border-foreground flex items-center justify-center text-xs text-muted-foreground font-bold">?</div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-bold text-foreground">{book.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{book.author}</td>
                    <td className="px-4 py-3">
                      <StarRating rating={book.rating || 0} onChange={(r) => updateBook(book.id, { rating: r })} />
                    </td>
                    <td className="px-4 py-3">
                      <Select value={book.status} onValueChange={(v) => updateBook(book.id, { status: v })}>
                        <SelectTrigger className="w-32 h-7 text-xs border-2 border-foreground font-medium">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reading">Reading</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="wishlist">Wishlist</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs font-medium">
                      {format(new Date(book.added_at), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3">
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
              <div key={book.id} className="border-2 border-foreground bg-background p-3 shadow-[3px_3px_0px_hsl(var(--foreground))] hover:shadow-[1px_1px_0px_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] transition-all group">
                <div className="aspect-[2/3] mb-3 overflow-hidden bg-accent border-2 border-foreground">
                  {book.cover_image ? (
                    <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-bold">No cover</div>
                  )}
                </div>
                <h3 className="text-sm font-bold text-foreground truncate">{book.title}</h3>
                <p className="text-xs text-muted-foreground truncate mb-2">{book.author}</p>
                <div className="flex items-center justify-between">
                  <BookStatusBadge status={book.status} />
                  <StarRating rating={book.rating || 0} onChange={(r) => updateBook(book.id, { rating: r })} size={12} />
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <Select value={book.status} onValueChange={(v) => updateBook(book.id, { status: v })}>
                    <SelectTrigger className="w-24 h-6 text-xs border-2 border-foreground">
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
