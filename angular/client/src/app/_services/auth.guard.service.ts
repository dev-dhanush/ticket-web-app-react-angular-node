import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  isLoggedIn() {
    const token = localStorage.getItem('auth-token');
    const user = localStorage.getItem('auth-user');

    return token && user ? true : false;
  }
}
