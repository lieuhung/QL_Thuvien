import { PublisherService } from '../../services/publisher.service';
import { NhaXuatBan } from './../../models/nhaxuatban.model';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-publisher-list',
  templateUrl: './publisher-list.component.html',
  styleUrls: ['./publisher-list.component.css'],
})
export class PublisherListComponent implements OnInit {
  pubList: any[] = [];
  publisher = new NhaXuatBan();
  showAddEditForm: boolean = false;
  successMessage: string = '';
  isEditMode: boolean = false;

  constructor(
    private publisherService: PublisherService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPublisher();
  }

  loadPublisher() {
    this.publisherService.getListPublishers().subscribe((data) => {
      this.pubList = data;
    });
  }

  addPublisher() {
    this.publisher = new NhaXuatBan();
    this.showAddEditForm = true;
    this.isEditMode = false;
  }

  savePublisher() {
    if (this.isEditMode) {
      this.publisherService
        .updatePublisher(this.publisher.publisherName, this.publisher)
        .subscribe(() => {
          this.successMessage = 'Publisher updated successfully.';
          this.refreshList();
          this.showAddEditForm = false;
        });
    } else {
      this.publisherService.addPublisher(this.publisher).subscribe(() => {
        this.successMessage = 'Publisher added successfully.';
        this.refreshList();
        this.showAddEditForm = false;
      });
    }
  }

  editPublisher(publisher: any) {
    this.publisher = { ...publisher }; // Create a copy to avoid two-way binding issues
    this.showAddEditForm = true;
    this.isEditMode = true;
  }

  deletePublisher(name: string) {
    if (confirm('Are you sure you want to delete this Publisher?')) {
      this.publisherService.deletePublisher(name).subscribe(() => {
        this.refreshList();
      });
    }
  }

  cancel() {
    this.showAddEditForm = false;
  }

  refreshList() {
    this.loadPublisher();
    this.publisher = { publisherName: '', address: '' };
    this.showAddEditForm = false;
    this.isEditMode = false;
  }

  isLibrarian(): boolean {
    return this.authService.isLibrarian();
  }
}
