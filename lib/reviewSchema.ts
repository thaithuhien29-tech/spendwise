import { z } from "zod";

export const reviewSchema = z.object({
  productId: z.number().or(z.string()),
  userName: z
    .string()
    .min(2, "Tên người dùng phải có ít nhất 2 ký tự")
    .max(50, "Tên không được vượt quá 50 ký tự"),
  rating: z
    .number()
    .min(1, "Vui lòng chọn đánh giá ít nhất 1 sao")
    .max(5, "Đánh giá tối đa là 5 sao"),
  comment: z
    .string()
    .min(5, "Bình luận phải có ít nhất 5 ký tự")
    .max(500, "Bình luận tối đa 500 ký tự"),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

export interface Review extends ReviewFormData {
  id: string | number;
  createdAt: string;
}

