import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: any = {
    email: null,
    password: null,
  };
  validateEmail = true;
  isLoginSuccessful = false;
  isLoginFailed = false;
  errorMessage = '';

  constructor(
    readonly authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.authService.isLoggedIn = true;
    }
  }

  onSubmit(): void {
    const { email, password } = this.form;
    this.authService.login(email, password).subscribe({
      next: (data) => {
        this.tokenStorage.saveToken(data.data.accessToken);
        this.tokenStorage.saveUser(data.data);
        this.isLoginSuccessful = true
        this.isLoginFailed = false;
        this.authService.isLoggedIn = true;

        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.log(err);

        if (err.error.firstError) {
          this.errorMessage = err.error.firstError;
        } else {
          this.errorMessage = err.error.error;
        }
        this.isLoginFailed = true;
      },
    });
  }
}
