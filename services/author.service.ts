import { TacGia } from '../models/tacgia.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PhieuMuonSach } from '../models/phieumuonsach.model';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private baseUrl = 'https://localhost:7096/api';

  constructor(private http: HttpClient) {}

  getAuthors(): Observable<TacGia[]> {
    return this.http.get<TacGia[]>(`${this.baseUrl}/Authors`);
  }

  getAuthor(name: string): Observable<TacGia> {
    return this.http.get<TacGia>(`${this.baseUrl}/Authors/${name}`);
  }

  addAuthor(author: TacGia): Observable<TacGia> {
    return this.http.post<TacGia>(`${this.baseUrl}/Authors`, author);
  }

  updateAuthor(name: string, author: TacGia): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/Authors/${name}`, author);
  }

  deleteAuthor(name: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Authors/${name}`);
  }
  getAuthList(): Observable<TacGia[]> {
    return this.http.get<TacGia[]>(`${this.baseUrl}/Authors/List`);
  }
}
