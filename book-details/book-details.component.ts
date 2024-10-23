import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../services/book.service';
import { Book } from 'src/app/models/book.model';
import { PhieuMuonSach } from '../models/phieumuonsach.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css'],
})
export class BookDetailsComponent implements OnInit {
  book: Book;
  bookId: number;
  today: Date = new Date();
  dueDate: Date = new Date();
  phieuMuon: PhieuMuonSach = new PhieuMuonSach();
  showBorrowForm: boolean = false; // Biến để điều khiển hiển thị form mượn sách
  role: string; // Thêm thuộc tính role ở đây
  @Output() readBookEvent = new EventEmitter<Book>();

  @Output() bookName: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.bookId = +this.route.snapshot.paramMap.get('bookId')!;
    this.loadBookDetails(this.bookId);
    this.role = this.authService.getRole(); // Ví dụ lấy role từ AuthService
  }

  loadBookDetails(bookId: number) {
    // Use your book service to load book details. This is just a placeholder.
    this.bookService.getBookById(bookId).subscribe((book) => {
      this.book = book;
    });
  }

  borrowBook(): void {
    if (this.book) {
      this.bookService.borrowBook(this.book.bookId).subscribe(() => {
        console.log('Book borrowed successfully');
        this.book.status = 'Considered'; // Cập nhật trạng thái sách local
      });
    }
  }

  approveBorrow(): void {
    // Chỉ librarian mới được phép phê duyệt mượn sách
    if (this.authService.getRole() === 'librarian') {
      if (this.book) {
        this.bookService.approveBook(this.book.bookId).subscribe(() => {
          // Handle success, e.g., show success message
          console.log('Borrow approval successful');
          this.book.status = 'Borrowed'; // Update local status
        });
      }
    } else {
      console.log('Only librarians can approve book borrow requests.');
      // Handle error or show message that only librarians can approve
    }
  }

  navigateBack(): void {
    this.router.navigate(['/books']);
  }
  canReadBook(): boolean {
    if (this.role === 'librarian') {
      return true; // Librarian can always read the book
    } else if (this.role === 'user' && this.book.status === 'Approved') {
      return true; // User can read the book if status is Approved
    }
    return false; // Default to false
  }
  toggleBorrowForm(): void {
    this.showBorrowForm = !this.showBorrowForm; // Toggle borrow form visibility
  }
  navigateToReadBook(): void {
    if (this.canReadBook()) {
      this.router.navigate(['/read-book', this.book.bookId]);
    }
  }
}
