import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './_services/auth.service';
import { TokenStorageService } from './_services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;

  constructor(
    readonly authService:AuthService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn = !!this.tokenStorageService.getToken();
    

    if (this.authService.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.username = user.username;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    this.router.navigate(['/login']);
  }
}
