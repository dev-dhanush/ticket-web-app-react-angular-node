import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvService } from '../env.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn:Boolean = false
  constructor(private http: HttpClient, private env : EnvService) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.env.apiUrl + 'user/signin', {
      email,
      password
    }, httpOptions);
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(this.env.apiUrl + 'user/signup', {
      username,
      email,
      password
    }, httpOptions);
  }
}
