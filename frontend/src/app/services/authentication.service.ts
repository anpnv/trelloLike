import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, flatMap, switchMap, take } from 'rxjs/operators';
import { User } from '../models/user';
import { Observable, of } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  currentUser: User;
  user: any;

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    const data = JSON.parse(sessionStorage.getItem('currentUser'));
    this.currentUser = data ? new User(data) : null;



  }


  get(id: number) {
    return this.http.get<User>(`${this.baseUrl}api/users/${id}`).pipe(take(1), map(u => new User(u))).toPromise();
  }




  login(pseudo: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}api/users/authenticate`, { pseudo, password })
      .pipe(map(user => {
        user = new User(user);
        this.setToken(user);
        return user;
      }));
  }


  update(id: number, user: User): Observable<User> {

    return this.http.put<User>(`${this.baseUrl}api/users/${id}`, user)
      .pipe(map(user => {
        user = new User(user);
        this.setToken(user);
        return user;
      }));
  }

  signup(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}api/users/signup`, user)
      .pipe(flatMap(() => this.login(user.pseudo, user.password)));
  }

  logout() {
    sessionStorage.removeItem('currentUser');
    this.currentUser = null;
  }


  
  setToken(user: User) {
    if (user && user.token) {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUser = user;
    }
  }
}


