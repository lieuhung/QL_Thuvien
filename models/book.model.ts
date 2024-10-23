// src/app/models/book.model.ts
export class Book {
  bookId: number;
  bookName: string;
  category: string;
  description: string;
  amount: number;
  status: string;
  price: number;
  comment: string;
  publisherName: string;
  authorName: string;
  imagePath?: string;
}
