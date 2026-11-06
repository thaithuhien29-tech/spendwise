"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./AuthContext";

export type BookStatus = "To Read" | "Reading" | "Finished";

export interface Book {
  id: string;
  user_id: string;
  title: string;
  author: string;
  pages: number;
  status: BookStatus;
  created_at: string;
}

export interface StatusBreakdownItem {
  status: BookStatus;
  count: number;
}

interface BooksContextType {
  books: Book[];
  filteredBooks: Book[];
  loading: boolean;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  clearFilters: () => void;
  addBook: (title: string, author: string, pages: number, status: BookStatus) => Promise<{ success: boolean; error?: string }>;
  advanceStatus: (id: string) => Promise<{ success: boolean; error?: string }>;
  deleteBook: (id: string) => Promise<{ success: boolean; error?: string }>;
  bookCount: number;
  totalPages: number;
  statusBreakdown: StatusBreakdownItem[];
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export const BooksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch books once after login
  const fetchBooks = useCallback(async () => {
    if (!user) {
      setBooks([]);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching books:", error);
      } else if (data) {
        setBooks(data as Book[]);
      }
    } catch (err) {
      console.error("Fetch books exception:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchBooks();
    } else {
      // Clear memory and state after logout
      setBooks([]);
      setStatusFilter("");
      setSearchQuery("");
    }
  }, [user, fetchBooks]);

  // Add book
  const addBook = async (
    title: string,
    author: string,
    pages: number,
    status: BookStatus
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "User not authenticated" };

    try {
      const { data, error } = await supabase
        .from("books")
        .insert([
          {
            title: title.trim(),
            author: author.trim(),
            pages,
            status,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      if (data) {
        // Add to list at once without reloading (most recently added first)
        setBooks((prev) => [data as Book, ...prev]);
        return { success: true };
      }

      return { success: false, error: "Failed to create book" };
    } catch (err: any) {
      return { success: false, error: err.message || "An unexpected error occurred" };
    }
  };

  // Advance status: To Read -> Reading -> Finished
  const advanceStatus = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const targetBook = books.find((b) => b.id === id);
    if (!targetBook) return { success: false, error: "Book not found" };

    let nextStatus: BookStatus | null = null;
    if (targetBook.status === "To Read") nextStatus = "Reading";
    else if (targetBook.status === "Reading") nextStatus = "Finished";

    if (!nextStatus) return { success: true }; // Already Finished

    try {
      const { error } = await supabase
        .from("books")
        .update({ status: nextStatus })
        .eq("id", id);

      if (error) {
        return { success: false, error: error.message };
      }

      // Update state immediately
      setBooks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: nextStatus! } : b))
      );
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "An unexpected error occurred" };
    }
  };

  // Delete book
  const deleteBook = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.from("books").delete().eq("id", id);
      if (error) {
        return { success: false, error: error.message };
      }

      // Remove from state immediately
      setBooks((prev) => prev.filter((b) => b.id !== id));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "An unexpected error occurred" };
    }
  };

  const clearFilters = () => {
    setStatusFilter("");
    setSearchQuery("");
  };

  // Filtered books calculation
  const filteredBooks = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();

    return books.filter((book) => {
      // Status filter
      if (statusFilter && statusFilter !== "" && book.status !== statusFilter) {
        return false;
      }

      // Search filter (title or author contains typed text, case-insensitive, spaces at both ends ignored)
      if (trimmedQuery !== "") {
        const titleMatch = book.title.toLowerCase().includes(trimmedQuery);
        const authorMatch = book.author.toLowerCase().includes(trimmedQuery);
        if (!titleMatch && !authorMatch) {
          return false;
        }
      }

      return true;
    });
  }, [books, statusFilter, searchQuery]);

  // Summary calculations
  const bookCount = filteredBooks.length;
  const totalPages = useMemo(() => {
    return filteredBooks.reduce((sum, b) => sum + (b.pages || 0), 0);
  }, [filteredBooks]);

  // Breakdown calculation:
  // "one row per status that appears, the status with the most books first (equal counts: To Read, then Reading, then Finished), each row showing the status name and how many books have it."
  const statusBreakdown = useMemo(() => {
    const countMap: Record<BookStatus, number> = {
      "To Read": 0,
      Reading: 0,
      Finished: 0,
    };

    filteredBooks.forEach((book) => {
      if (countMap[book.status] !== undefined) {
        countMap[book.status]++;
      }
    });

    const statusOrder: Record<BookStatus, number> = {
      "To Read": 1,
      Reading: 2,
      Finished: 3,
    };

    const result: StatusBreakdownItem[] = [];
    (["To Read", "Reading", "Finished"] as BookStatus[]).forEach((st) => {
      if (countMap[st] > 0) {
        result.push({ status: st, count: countMap[st] });
      }
    });

    // Sort: most books first; if equal counts: To Read, then Reading, then Finished
    result.sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return statusOrder[a.status] - statusOrder[b.status];
    });

    return result;
  }, [filteredBooks]);

  return (
    <BooksContext.Provider
      value={{
        books,
        filteredBooks,
        loading,
        statusFilter,
        setStatusFilter,
        searchQuery,
        setSearchQuery,
        clearFilters,
        addBook,
        advanceStatus,
        deleteBook,
        bookCount,
        totalPages,
        statusBreakdown,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error("useBooks must be used within a BooksProvider");
  }
  return context;
};

