// src/app/models/comment.model.ts
export class Comment {
  commentId: number;
  text: string; // Nội dung bình luận
  userId: number; // Tham chiếu đến người dùng
  bookId: number; // Tham chiếu đến quyển sách
  createdDate: Date; // Thời gian tạo bình luận
  userName?: string; // Tên người dùng (thêm dấu ? để cho phép thuộc tính này có thể null)
}
