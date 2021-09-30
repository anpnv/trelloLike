import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, flatMap, catchError, take } from 'rxjs/operators';
import { User } from '../models/user';
import { Observable, of } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getAll() {
    return this.http.get<User[]>(`${this.baseUrl}api/users`)
      .pipe(map(res => res.map(u => new User(u))));
  }


  get(id: number) {
    return this.http.get<User>(`${this.baseUrl}api/users/${id}`).pipe(take(1), map(u => new User(u))).toPromise();
  }



  update(id: number, user: User): Observable<boolean> {
    return this.http.put<User>(`${this.baseUrl}api/users/${id}`, user).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }

  public delete(m: User): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}api/users/${m.id}`).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }

  public add(user: User): Observable<boolean> {
    return this.http.post<User>(`${this.baseUrl}api/users`, user).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }


  IsAvailablePseudo(pseudo: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}api/users/available/pseudo/${pseudo}`);
  }

  emailExist(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}api/users/available/email/${email}`);
  }



}
