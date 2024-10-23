import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7096/api/Accounts'; // Correct API URL
  private userIdSubject: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );

  constructor(private http: HttpClient) {}

  setUserId(userId: number): void {
    this.userIdSubject.next(userId);
  }

  // getUserId2(): number {
  //   return this.userIdSubject.value;
  // }

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/LoginUser`, {
        userName: username,
        password: password,
      })
      .pipe(
        tap((response) => {
          if (response !== 'Failure') {
            this.handleLoginResponse(response);
          } else {
            throw new Error('Invalid username or password');
          }
        }),
        catchError((error) => {
          console.error('Login failed:', error);
          return throwError(error);
        })
      );
  }

  private handleLoginResponse(response: any): void {
    if (response && response.userId && response.userName && response.role) {
      this.saveUserId(response.userId);
      this.saveRole(response.role);
      this.saveUsername(response.userName);
    } else {
      console.error('Invalid response format from server');
    }
  }

  loginUser(loginInfo: Array<string>): Observable<any> {
    return this.http
      .post(
        this.apiUrl + '/LoginUser',
        {
          username: loginInfo[0],
          password: loginInfo[1],
        },
        {
          responseType: 'json', // Sử dụng 'json' thay vì 'text' để nhận dữ liệu JSON từ server
        }
      )
      .pipe(
        tap((response: any) => {
          this.handleLoginResponse(response);
        }),
        catchError((error) => {
          console.error('Lỗi này nè:', error);
          return throwError(error);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    this.userIdSubject.next(0); // Reset userIdSubject
  }

  getRole(): string {
    return localStorage.getItem('role') || '';
  }

  getUsername(): string {
    return localStorage.getItem('userName') || '';
  }

  isLoggedIn(): boolean {
    return !!this.getRole();
  }

  getUserId(): number {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : 0;
  }

  isLibrarian(): boolean {
    return this.getRole() === 'librarian';
  }

  isUser(): boolean {
    return this.getRole() === 'user';
  }

  private saveRole(role: string): void {
    localStorage.setItem('role', role);
  }

  private saveUserId(userId: number): void {
    localStorage.setItem('userId', userId.toString());
    this.setUserId(userId); // Update BehaviorSubject
  }

  private saveUsername(username: string): void {
    localStorage.setItem('userName', username);
  }

  setLocalStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
}
