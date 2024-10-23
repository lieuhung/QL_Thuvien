import { NhaXuatBan } from '../models/nhaxuatban.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PublisherService {
  private baseUrl = 'https://localhost:7096/api';

  constructor(private http: HttpClient) {}

  // Get all publishers
  getPublishers(): Observable<NhaXuatBan[]> {
    return this.http.get<NhaXuatBan[]>(`${this.baseUrl}/Publishers`);
  }

  // Get a list of publishers (additional method)
  getListPublishers(): Observable<NhaXuatBan[]> {
    return this.http.get<NhaXuatBan[]>(`${this.baseUrl}/Publishers/List`);
  }

  // Get publisher by ID
  getPublisher(id: string): Observable<NhaXuatBan> {
    return this.http.get<NhaXuatBan>(`${this.baseUrl}/Publishers/${id}`);
  }

  // Add a new publisher
  addPublisher(publisher: NhaXuatBan): Observable<NhaXuatBan> {
    return this.http.post<NhaXuatBan>(`${this.baseUrl}/Publishers`, publisher);
  }

  // Update an existing publisher
  updatePublisher(id: string, publisher: NhaXuatBan): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/Publishers/${id}`, publisher);
  }

  // Delete a publisher
  deletePublisher(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Publishers/${id}`);
  }
}
