import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/models/book.model';
import { BookService } from 'src/app/services/book.service';
import { AuthService } from 'src/app/services/auth.service';
import { TacGia } from '../models/tacgia.model';
import { NhaXuatBan } from '../models/nhaxuatban.model';
import { AuthorService } from '../services/author.service';
import { PublisherService } from '../services/publisher.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
})
export class BookListComponent implements OnInit {
  booklist: Book[] = [];
  book: Book = new Book();
  authors: TacGia[] = []; // Danh sách tác giả
  publishers: NhaXuatBan[] = []; // Danh sách nhà xuất bản
  showAddEditForm: boolean = false;
  successMessage: string = ''; // Declare the successMessage property
  isEditMode: boolean = false;
  filteredBooks: any[] = []; // Mảng sách được lọc
  searchTerm: string = ''; // Biến lưu từ khóa tìm kiếm
  username: string;
  role: string;
  selectedFile: File | undefined;
  uploadedFilePath: string | undefined;
  sortOrder: string = 'asc';
  sortField: keyof Book = 'bookName';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private publisherService: PublisherService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadAuthors();
    this.loadPublishers();
    this.loadBooks_filteredBook();
    this.username = this.authService.getUsername();
    this.role = this.authService.getRole();
  }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadImage(): void {
    if (this.selectedFile) {
      this.bookService.uploadImage(this.selectedFile).subscribe(
        (response) => {
          console.log('Image uploaded successfully:', response);
          this.uploadedFilePath = response.filePath;
          // Xử lý khi tải lên thành công
        },
        (error) => {
          console.error('Error uploading image:', error);
          // Xử lý khi có lỗi
        }
      );
    } else {
      console.error('No file selected.');
      // Xử lý khi không có file được chọn
    }
  }
  loadAuthors() {
    this.authorService.getAuthList().subscribe((data) => {
      this.authors = data;
    });
  }

  loadPublishers() {
    this.publisherService.getListPublishers().subscribe((data) => {
      this.publishers = data;
    });
  }

  loadBooks() {
    this.bookService.getBookList().subscribe((data) => {
      this.booklist = data;
    });
  }
  loadBooks_filteredBook() {
    this.bookService.getBookList().subscribe((data) => {
      this.filteredBooks = data;
    });
  }

  addBook() {
    this.book = new Book();
    this.showAddEditForm = true;
    this.book.status = 'Available'; // Thiết lập status mặc định là 'Available'
    this.isEditMode = false;
  }

  saveBook() {
    if (this.isEditMode) {
      this.bookService.updateBook(this.book.bookId, this.book).subscribe(() => {
        this.successMessage = 'Author updated successfully.';
        this.refreshList();
        this.showAddEditForm = false;
      });
    } else {
      this.bookService.addBook(this.book).subscribe(() => {
        this.successMessage = 'Author added successfully.';
        this.refreshList();
        this.showAddEditForm = false;
      });
    }
  }

  editBook(book: Book) {
    this.book = { ...book }; // Create a copy to avoid two-way binding issues
    this.showAddEditForm = true;
    this.isEditMode = true;
  }

  deleteBook(bookId: number) {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(bookId).subscribe(() => {
        this.refreshList();
      });
    }
  }

  cancel() {
    this.showAddEditForm = false;
    this.book = new Book(); // Reset book object
  }

  private refreshList() {
    this.loadBooks();
    this.loadBooks_filteredBook();
    this.showAddEditForm = false;
    this.book = new Book(); // Reset book object
  }

  isLibrarian(): boolean {
    return this.authService.isLibrarian();
  }

  // Sắp xếp sách theo tên sách (tăng dần)

  getBooks(): void {
    this.bookService.sortBooks(this.sortOrder).subscribe((books) => {
      this.booklist = books;
    });
  }
  searchBooks(): void {
    this.applySearchAndSort();
  }

  sortBooks(field: keyof Book): void {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.applySearchAndSort();
  }

  private applySearchAndSort(): void {
    // Áp dụng tìm kiếm
    this.filteredBooks = this.booklist.filter((book) =>
      book.bookName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    // Áp dụng sắp xếp
    this.filteredBooks.sort((a, b) => {
      const valueA = a[this.sortField];
      const valueB = b[this.sortField];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortOrder === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      }

      return 0;
    });
  }
  getSortIcon(field: keyof Book): string {
    if (this.sortField === field) {
      return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
    }
    return 'fa-sort';
  }
}
