import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Book } from 'src/app/models/book.model';
import { PhieuMuonSach } from '../models/phieumuonsach.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private baseUrl = 'https://localhost:7096/api/Books';

  constructor(private http: HttpClient) {}

  getBookById(bookId: number): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/${bookId}`);
  }

  getBookList(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}`);
  }

  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/${id}`);
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(`${this.baseUrl}`, book);
  }

  updateBook(bookId: number, book: Book): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${bookId}`, book);
  }

  deleteBook(bookId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${bookId}`);
  }

  borrowBook(bookId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/borrow/${bookId}`, {});
  }

  getBorrowList(): Observable<PhieuMuonSach[]> {
    return this.http.get<PhieuMuonSach[]>(`${this.baseUrl}/BorrowedList`);
  }

  // Get books by status
  getBooksByStatus(status: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/status/${status}`);
  }

  // Approve book by bookId
  approveBook(bookId: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/approve/${bookId}`, {});
  }

  // Return book by bookId
  returnBook(bookId: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/return/${bookId}`, {});
  }
  searchBooks(searchTerm: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/search/${searchTerm}`);
  }

  sortBooks(order: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/sort/${order}`);
  }
  //image
  uploadImage(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(`${this.baseUrl}/upload-image`, formData, {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    });
  }

  getImageByBook(bookId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetImageByBook/${bookId}`);
  }
  commentBook(bookId: number, comment: string): Observable<any> {
    const headers = { 'Content-Type': 'application/json' }; // Set content type as JSON
    const body = { cmt: comment }; // Assuming 'cmt' is the parameter name expected by API
    return this.http.put(`${this.baseUrl}/comment/${bookId}`, body, {
      headers,
    });
  }
}
