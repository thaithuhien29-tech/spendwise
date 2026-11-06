"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Review, ReviewFormData } from "@/lib/reviewSchema";
import { getReviews, addReview as addReviewApi } from "@/lib/reviews";

interface ReviewsContextType {
  reviews: Review[];
  isLoading: boolean;
  addReview: (data: ReviewFormData) => Promise<boolean>;
  getReviewsByProductId: (productId: number | string) => Review[];
  refreshReviews: () => Promise<void>;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const data = await getReviews();
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const addReview = async (data: ReviewFormData): Promise<boolean> => {
    try {
      const created = await addReviewApi(data);
      setReviews((prev) => [created, ...prev]);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const getReviewsByProductId = (productId: number | string) => {
    return reviews.filter((r) => String(r.productId) === String(productId));
  };

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        isLoading,
        addReview,
        getReviewsByProductId,
        refreshReviews: fetchReviews,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error("useReviews must be used within a ReviewsProvider");
  }
  return context;
};

