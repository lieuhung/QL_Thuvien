import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  isLoggedIn: boolean = false;
  role: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.role = this.authService.getRole();
    }
  }

  toggleNavPane() {
    const navPane = document.getElementById('navPane');
    if (navPane) {
      navPane.classList.toggle('small');
    }
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.role = '';
  }
}
