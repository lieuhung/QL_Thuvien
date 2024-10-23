import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = 'https://localhost:7096/api/Accounts';

  constructor(private http: HttpClient) {}

  getUserNameById(userId: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/GetUserName/${userId}`);
  }
}
