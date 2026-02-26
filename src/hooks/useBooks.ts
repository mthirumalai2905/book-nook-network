import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

export type Book = Tables<"books">;

export function useBooks() {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBooks = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("user_id", user.id)
      .order("added_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load books", variant: "destructive" });
    } else {
      setBooks(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, [user]);

  const addBook = async (book: {
    title: string;
    author: string;
    cover_image: string;
    description: string;
    published_date: string;
    google_books_id: string;
  }) => {
    if (!user) return;
    // Check duplicate
    const existing = books.find((b) => b.google_books_id === book.google_books_id);
    if (existing) {
      toast({ title: "Book already in your collection", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("books").insert({
      ...book,
      user_id: user.id,
      status: "wishlist",
      rating: 0,
    });
    if (error) {
      toast({ title: "Failed to add book", variant: "destructive" });
    } else {
      toast({ title: "Book added!" });
      fetchBooks();
    }
  };

  const updateBook = async (id: string, updates: { status?: string; rating?: number }) => {
    const { error } = await supabase.from("books").update(updates).eq("id", id);
    if (error) {
      toast({ title: "Failed to update", variant: "destructive" });
    } else {
      fetchBooks();
    }
  };

  const deleteBook = async (id: string) => {
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (error) {
      toast({ title: "Failed to delete", variant: "destructive" });
    } else {
      toast({ title: "Book removed" });
      fetchBooks();
    }
  };

  return { books, loading, addBook, updateBook, deleteBook, refetch: fetchBooks };
}
