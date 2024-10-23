import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AuthorService } from 'src/app/services/author.service';
import { TacGia } from 'src/app/models/tacgia.model';

@Component({
  selector: 'app-author-list',
  templateUrl: './author-list.component.html',
  styleUrls: ['./author-list.component.css'],
})
export class AuthorListComponent implements OnInit {
  authList: any[] = [];
  author: any = { authorName: '', gender: '', age: 0 };
  showAddEditForm: boolean = false;
  successMessage: string = '';
  isEditMode: boolean = false;

  constructor(
    private authorService: AuthorService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors() {
    this.authorService.getAuthList().subscribe((data) => {
      this.authList = data;
    });
  }

  addAuthor() {
    this.author = { authorName: '', gender: '', age: 0 };
    this.showAddEditForm = true;
    this.isEditMode = false;
  }

  saveAuthor() {
    if (this.isEditMode) {
      this.authorService
        .updateAuthor(this.author.authorName, this.author)
        .subscribe(() => {
          this.successMessage = 'Author updated successfully.';
          this.refreshList();
          this.showAddEditForm = false;
        });
    } else {
      this.authorService.addAuthor(this.author).subscribe(() => {
        this.successMessage = 'Author added successfully.';
        this.refreshList();
        this.showAddEditForm = false;
      });
    }
  }

  editAuthor(author: any) {
    this.author = { ...author }; // Create a copy to avoid two-way binding issues
    this.showAddEditForm = true;
    this.isEditMode = true;
  }

  deleteAuthor(name: string) {
    if (confirm('Are you sure you want to delete this author?')) {
      this.authorService.deleteAuthor(name).subscribe(() => {
        this.refreshList();
      });
    }
  }

  cancel() {
    this.showAddEditForm = false;
  }

  refreshList() {
    this.loadAuthors();
    this.author = { authorName: '', gender: '', age: null };
    this.showAddEditForm = false;
    this.isEditMode = false;
  }

  isLibrarian(): boolean {
    return this.authService.isLibrarian();
  }
}
