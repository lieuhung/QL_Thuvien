import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginError: string = '';
  loginForm: FormGroup;
  passwordVisible = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],

      password: ['', Validators.required],
    });
  }
  isUserValid: boolean = false;
  getUserName(): FormControl {
    return this.loginForm.get('username') as FormControl;
  }
  getPassword(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }
  loginSubmitted() {
    this.authService
      .loginUser([
        this.loginForm.value.username ?? '',
        this.loginForm.value.password ?? '',
      ])
      .subscribe((res) => {
        if (res == 'Failure') {
          this.isUserValid = false;
          alert('Login Unsuccessful');
        } else {
          this.isUserValid = true;
          // alert('Login Successful');
          this.router.navigate(['/home']);
        }
      });
  }
  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        if (response && response.role) {
          this.router.navigate(['/home']);
        } else {
          console.error('Invalid credentials');
          this.loginError = 'Invalid username or password';
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.loginError = 'Failed to login. Please try again later.';
      },
    });
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    const passwordField = document.getElementById(
      'password'
    ) as HTMLInputElement;
    if (passwordField) {
      passwordField.type = this.passwordVisible ? 'text' : 'password';
    }
  }
}
