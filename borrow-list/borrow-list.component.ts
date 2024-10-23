import { Component, OnInit } from '@angular/core';
import { Book } from '../models/book.model'; // Import Book model
import { BookService } from '../services/book.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-borrow-list',
  templateUrl: './borrow-list.component.html',
  styleUrls: ['./borrow-list.component.css'],
})
export class BorrowListComponent implements OnInit {
  borrowList: Book[] = []; // Change to Book[] since we are working with books
  role: string = ''; // Assuming AuthService handles role

  constructor(
    private bookService: BookService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole(); // Get user role from AuthService
    this.loadBorrowedBooks();
  }

  loadBorrowedBooks() {
    if (this.role === 'librarian') {
      // Load books with status 'Considered' for librarian
      this.bookService.getBooksByStatus('Considered').subscribe((books) => {
        this.borrowList = books; // Assign to borrowList
      });
    } else if (this.role === 'user') {
      // Load books with status 'Approved' for user
      this.bookService.getBooksByStatus('Approved').subscribe((books) => {
        this.borrowList = books; // Assign to borrowList
      });
    }
  }

  approveBook(book: Book) {
    this.bookService.approveBook(book.bookId).subscribe(() => {
      console.log('Book approval successful');
      book.status = 'Approved'; // Update local status
    });
  }

  returnBook(book: Book) {
    this.bookService.returnBook(book.bookId).subscribe(() => {
      console.log('Book returned successfully');
      book.status = 'Available'; // Update local status
    });
  }
  readBook(book: Book) {
    // Chuyển hướng đến trang đọc sách và truyền bookName
    this.router.navigate(['/read-book', book.bookId]);
  }
}
