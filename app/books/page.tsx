"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useBooks, BookStatus } from "@/contexts/BooksContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Trash2, 
  ArrowRightCircle, 
  RotateCcw, 
  Search, 
  Filter,
  CheckCircle2,
  Plus
} from "lucide-react";

export default function BooksPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const {
    filteredBooks,
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
  } = useBooks();

  // Form State
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pages, setPages] = useState("");
  const [status, setStatus] = useState<string>("");

  // Validation & Message State
  const [errorTitle, setErrorTitle] = useState("");
  const [errorAuthor, setErrorAuthor] = useState("");
  const [errorPages, setErrorPages] = useState("");
  const [errorStatus, setErrorStatus] = useState("");
  const [errorBook, setErrorBook] = useState("");
  const [bookSuccess, setBookSuccess] = useState("");

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Protected Route Check (Prevent flash of content)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !isAuthenticated) {
    return null;
  }

  // Validation functions
  const validateTitle = (val: string): string => {
    if (!val || val.trim() === "") {
      return "Title is required";
    }
    if (val.length > 80) {
      return "Title must be at most 80 characters";
    }
    return "";
  };

  const validateAuthor = (val: string): string => {
    if (!val || val.trim() === "") {
      return "Author is required";
    }
    if (val.length > 60) {
      return "Author must be at most 60 characters";
    }
    return "";
  };

  const validatePages = (val: string): string => {
    if (!val || val.trim() === "") {
      return "Pages is required";
    }
    // Must be a whole number between 1 and 5000
    const isWholeNumber = /^\d+$/.test(val.trim());
    const num = Number(val.trim());
    if (!isWholeNumber || num < 1 || num > 5000) {
      return "Pages must be a whole number between 1 and 5000";
    }
    return "";
  };

  const validateStatus = (val: string): string => {
    if (!val || val === "") {
      return "Please choose a status";
    }
    return "";
  };

  // Field change handlers with live error disappearance
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (hasSubmitted) {
      setErrorTitle(validateTitle(val));
    }
    if (errorBook) setErrorBook("");
    if (bookSuccess) setBookSuccess("");
  };

  const handleAuthorChange = (val: string) => {
    setAuthor(val);
    if (hasSubmitted) {
      setErrorAuthor(validateAuthor(val));
    }
    if (errorBook) setErrorBook("");
    if (bookSuccess) setBookSuccess("");
  };

  const handlePagesChange = (val: string) => {
    setPages(val);
    if (hasSubmitted) {
      setErrorPages(validatePages(val));
    }
    if (errorBook) setErrorBook("");
    if (bookSuccess) setBookSuccess("");
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    if (hasSubmitted) {
      setErrorStatus(validateStatus(val));
    }
    if (errorBook) setErrorBook("");
    if (bookSuccess) setBookSuccess("");
  };

  // Add Book submit handler
  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setErrorBook("");
    setBookSuccess("");

    const errTitle = validateTitle(title);
    const errAuthor = validateAuthor(author);
    const errPages = validatePages(pages);
    const errStatus = validateStatus(status);

    setErrorTitle(errTitle);
    setErrorAuthor(errAuthor);
    setErrorPages(errPages);
    setErrorStatus(errStatus);

    if (errTitle || errAuthor || errPages || errStatus) {
      return;
    }

    setSubmitting(true);
    try {
      const res = await addBook(title, author, parseInt(pages.trim(), 10), status as BookStatus);
      if (res.success) {
        setBookSuccess("Book added");
        // Clear form
        setTitle("");
        setAuthor("");
        setPages("");
        setStatus("");
        setHasSubmitted(false);
      } else {
        setErrorBook(res.error || "Failed to add book");
      }
    } catch (err: any) {
      setErrorBook(err.message || "Failed to add book");
    } finally {
      setSubmitting(false);
    }
  };

  // Advance status handler
  const handleAdvance = async (id: string) => {
    setActionLoadingId(id);
    try {
      await advanceStatus(id);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete book handler
  const handleDelete = async (id: string) => {
    setActionLoadingId(id);
    try {
      await deleteBook(id);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div data-testid="books-page" className="container mx-auto max-w-7xl px-4 py-8">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <BookOpen className="w-8 h-8 text-indigo-600" />
          My ShelfLife
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal reading list, advance your book progress, and view shelf statistics.
        </p>
      </div>

      {/* Main Grid: Left col = Form & Summary; Right col = Filters & List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= LEFT COLUMN ================= */}
        <div className="space-y-6">
          {/* Add a Book Card */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                Add a book
              </CardTitle>
              <CardDescription className="text-xs">
                Fill in the details below to add a new book to your shelf.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleAddBook} noValidate data-testid="book-form">
              <CardContent className="space-y-4">
                {/* Book Success Message */}
                {bookSuccess && (
                  <div 
                    data-testid="book-success"
                    className="p-3 text-sm text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-md font-medium flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{bookSuccess}</span>
                  </div>
                )}

                {/* Supabase Error Message */}
                {errorBook && (
                  <div 
                    data-testid="error-book"
                    className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md font-medium"
                  >
                    {errorBook}
                  </div>
                )}

                {/* Title Input */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Title</label>
                  <Input
                    type="text"
                    data-testid="input-title"
                    placeholder="e.g. The Great Gatsby"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                  />
                  {errorTitle && (
                    <div data-testid="error-title" className="text-xs text-red-600 font-medium">
                      {errorTitle}
                    </div>
                  )}
                </div>

                {/* Author Input */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Author</label>
                  <Input
                    type="text"
                    data-testid="input-author"
                    placeholder="e.g. F. Scott Fitzgerald"
                    value={author}
                    onChange={(e) => handleAuthorChange(e.target.value)}
                  />
                  {errorAuthor && (
                    <div data-testid="error-author" className="text-xs text-red-600 font-medium">
                      {errorAuthor}
                    </div>
                  )}
                </div>

                {/* Pages Input */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Number of Pages</label>
                  <Input
                    type="text"
                    data-testid="input-pages"
                    placeholder="e.g. 180"
                    value={pages}
                    onChange={(e) => handlePagesChange(e.target.value)}
                  />
                  {errorPages && (
                    <div data-testid="error-pages" className="text-xs text-red-600 font-medium">
                      {errorPages}
                    </div>
                  )}
                </div>

                {/* Status Select */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Status</label>
                  <select
                    data-testid="select-status"
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-600"
                  >
                    <option value="">Choose status</option>
                    <option value="To Read">To Read</option>
                    <option value="Reading">Reading</option>
                    <option value="Finished">Finished</option>
                  </select>
                  {errorStatus && (
                    <div data-testid="error-status" className="text-xs text-red-600 font-medium">
                      {errorStatus}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  data-testid="btn-add-book"
                  disabled={submitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                >
                  {submitting ? "Adding..." : "Add Book"}
                </Button>
              </CardContent>
            </form>
          </Card>

          {/* Summary Card */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Shelf Summary</CardTitle>
              <CardDescription className="text-xs">
                Statistics for books currently displayed on screen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                  <div className="text-xs font-medium text-slate-500 uppercase">Books</div>
                  <div data-testid="book-count" className="text-2xl font-black text-slate-900 mt-0.5">
                    {bookCount}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                  <div className="text-xs font-medium text-slate-500 uppercase">Total Pages</div>
                  <div data-testid="total-pages" className="text-2xl font-black text-indigo-600 mt-0.5">
                    {totalPages}
                  </div>
                </div>
              </div>

              {/* Status Breakdown Container */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-700 mb-2">Status Breakdown</div>
                <div data-testid="status-breakdown" className="space-y-2">
                  {statusBreakdown.map((item) => (
                    <div
                      key={item.status}
                      data-testid="breakdown-row"
                      className="flex items-center justify-between text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-md"
                    >
                      <span data-testid="breakdown-name" className="font-semibold text-slate-700">
                        {item.status}
                      </span>
                      <span data-testid="breakdown-count" className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ================= RIGHT COLUMN (Filters & Book List) ================= */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filter & Search Bar */}
          <Card className="border-slate-200 shadow-sm p-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <Input
                  type="text"
                  data-testid="search-input"
                  placeholder="Search by title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500 hidden sm:block" />
                <select
                  data-testid="filter-status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-600"
                >
                  <option value="">All</option>
                  <option value="To Read">To Read</option>
                  <option value="Reading">Reading</option>
                  <option value="Finished">Finished</option>
                </select>

                {/* Clear Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  data-testid="btn-clear-filters"
                  onClick={clearFilters}
                  className="h-9 px-3 text-xs flex items-center gap-1.5 text-slate-600 hover:text-slate-900"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </Button>
              </div>
            </div>
          </Card>

          {/* Book List Container OR Empty State */}
          {filteredBooks.length === 0 ? (
            <div
              data-testid="books-empty"
              className="text-center py-16 px-4 border border-dashed border-slate-300 rounded-xl bg-white shadow-sm"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6" />
              </div>
              <p className="text-base font-semibold text-slate-700">No books found</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No books match your current filters, or your shelf is empty. Add a new book to start reading!
              </p>
            </div>
          ) : (
            <div data-testid="book-list" className="space-y-3">
              {filteredBooks.map((book) => {
                const isFinished = book.status === "Finished";
                const isActionLoading = actionLoadingId === book.id;

                let statusBadgeColor = "bg-amber-50 text-amber-700 border-amber-200";
                if (book.status === "Reading") {
                  statusBadgeColor = "bg-blue-50 text-blue-700 border-blue-200";
                } else if (book.status === "Finished") {
                  statusBadgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
                }

                return (
                  <div
                    key={book.id}
                    data-testid="book-item"
                    className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 data-testid="book-title" className="text-base font-bold text-slate-900">
                          {book.title}
                        </h3>
                        <span
                          data-testid="book-status"
                          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${statusBadgeColor}`}
                        >
                          {book.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                        <span>
                          by <strong data-testid="book-author" className="font-medium text-slate-700">{book.author}</strong>
                        </span>
                        <span>•</span>
                        <span data-testid="book-pages" className="font-medium text-slate-700">
                          {book.pages} pages
                        </span>
                      </div>
                    </div>

                    {/* Book Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {/* btn-advance-status is not rendered for a Finished book */}
                      {!isFinished && (
                        <Button
                          variant="outline"
                          size="sm"
                          data-testid="btn-advance-status"
                          disabled={isActionLoading}
                          onClick={() => handleAdvance(book.id)}
                          className="h-8 px-2.5 text-xs text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-1"
                        >
                          <ArrowRightCircle className="w-3.5 h-3.5" />
                          <span>Advance</span>
                        </Button>
                      )}

                      {/* Delete Book Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid="btn-delete-book"
                        disabled={isActionLoading}
                        onClick={() => handleDelete(book.id)}
                        className="h-8 px-2.5 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

