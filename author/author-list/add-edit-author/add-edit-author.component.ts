import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthorService } from 'src/app/services/author.service';
import { TacGia } from 'src/app/models/tacgia.model';

@Component({
  selector: 'app-add-edit-author',
  templateUrl: './add-edit-author.component.html',
  styleUrls: ['./add-edit-author.component.css'],
})
export class AddEditAuthorComponent {
  @Input() author: TacGia;
  @Output() refreshList = new EventEmitter<void>();
  showAddEditForm: boolean = false;
  constructor(private authorService: AuthorService) {}

  ngOnInit(): void {}

  saveAuthor() {
    if (this.author.authorName) {
      this.authorService
        .updateAuthor(this.author.authorName, this.author)
        .subscribe(() => {
          this.refreshList.emit();
        });
    } else {
      this.authorService.addAuthor(this.author).subscribe(() => {
        this.refreshList.emit();
      });
    }
  }

  cancel() {
    this.refreshList.emit();
  }
}
