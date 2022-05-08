import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginModel, RegisterModel } from './member.model';

const USER_API = environment.USER_API;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  isAuthentication() {
    return this.http.get(`${USER_API}auth`, { responseType: 'json' });
  }

  onLogin(formLogin: LoginModel): Observable<any> {
    return this.http.post(`${USER_API}login`, formLogin, httpOptions);
  }

  onRegister(formRegister: RegisterModel): Observable<any> {
    return this.http.post(`${USER_API}register`, formRegister, httpOptions);
  }
}
