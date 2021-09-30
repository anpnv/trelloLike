import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, flatMap, catchError, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Board } from '../models/board';
import { AuthenticationService } from './authentication.service';
import { Card } from '../models/card';
import { Column } from '../models/column';
import { Activity } from '../models/Activity';
import { User } from '../models/user';
import { UserService } from './user.service';
import * as firebase from 'firebase/app';
import 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class BoardService {


  public data: any;

  constructor(
    private userService: UserService,
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    private auth: AuthenticationService) { }


  getBoardById(id: number) {
    return this.http.get<Board>(`${this.baseUrl}api/boards/${id}`).pipe(take(1), map(b => new Board(b))).toPromise();
  }

  getAll() {
    return this.http.get<Board[]>(`${this.baseUrl}api/boards`)
      .pipe(map(res => res.map(b => new Board(b))));
  }

  getMyBoard() {
    return this.http.get<Board[]>(`${this.baseUrl}api/boards/myBoard/${this.auth.currentUser.id}`)
      .pipe(map(res => res.map(b => new Board(b))));
  }


  public updateBoard(id: number, board: Board) {
    return this.http.put<Board>(`${this.baseUrl}api/boards/${id}`, board).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      }))
  }


  public updateCol(id: number, col: Column) {
    return this.http.put<Column>(`${this.baseUrl}api/columns/${id}`, col).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      }))
  }

  public updateCardPos(id: number, card: Card) {
    return this.http.put<Card>(`${this.baseUrl}api/cards/updatePos/${id}`, card).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      }));
  }

  public updateColPos(id: number, column: Column) {
    return this.http.put<Card>(`${this.baseUrl}api/columns/updatePos/${id}`, column).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      }));
  }

  public deleteCol(c: Column): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}api/columns/${c.id}`).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }

  public deleteBoard(b: Board): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}api/boards/${b.id}`).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }

  public deleteCard(c: Card): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}api/cards/${c.id}`).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }






  public createBoard(board: Board): Observable<Board> {
    return this.http.post(`${this.baseUrl}api/boards`, board).pipe(take(1), map(b => new Board(b)));
  }


  public createColumn(column: Column): Observable<Column> {
    return this.http.post(`${this.baseUrl}api/columns`, column).pipe(take(1), map(col => new Column(col)));
  }


  getColumns(id: number) {
    return this.http.get<Column[]>(`${this.baseUrl}api/columns/${id}`)
      .pipe(map(res => res.map(c => new Column(c))));
  }

  getCards(id: number) {
    return this.http.get<Card[]>(`${this.baseUrl}api/cards/${id}`)
      .pipe(map(res => res.map(c => new Card(c))));
  }


  public createCard(card: Card): Observable<Card> {
    if (!card.ownerId) {
      card.ownerId = this.auth.currentUser.id;
    }

    return this.http.post(`${this.baseUrl}api/cards`, card).pipe(take(1), map(card => new Card(card)));
  }



  public addHistoric(act: Activity): Observable<Activity> {
    return this.http.post(`${this.baseUrl}api/activities`, act).pipe(take(1), map(act => new Activity(act)));
  }






  // Patching Data !   
  private patchCard(col: Column, uid, board: Board) {
    let random = Math.floor(Math.random() * (10 - 2) + 3);
    for (let i = 1; i < random; i++) {
      let randomColor = "rgb("
        + Math.floor(Math.random() * 255)  // red
        + "," + Math.floor(Math.random() * 255)        //green
        + "," + Math.floor(Math.random() * 255) + ")"; // blue

      let temp: Card = new Card({
        pos: i,
        color: randomColor,
        createAt: Date.now().toString(),
        lastUpdate: Date.now().toString(),
        ownerId: uid,
        columnId: col.id,
        content: 'Selected color: ' + randomColor,
        title: 'Generate Random for: ' + col.title
      });
      this.createCard(temp).toPromise();
    }
  }

  private patchCol(b: Board, userId) {
    const tab: string[] = ['BACKLOG', 'DEV EN COURS', 'PRET POUR RELEASE'];
    for (let i = 0; i < tab.length; i++) {
      this.createColumn(new Column({ title: tab[i], boardId: b.id })).toPromise().then(col => {
        this.patchCard(col, userId, b);
      });
    }

  }



  patch(uid) {
    const tab: string[] = ['PRID', 'TFE'];
    this.patchBoard(tab, uid, [5, 6]);
    this.patchBoard(['ANC3'], 5, [uid]);

  }


  private patchBoard(diffTab: string[], uid, collabList: number[]) {
    for (let i = 0; i < diffTab.length; i++) {
      const newBoard = new Board({
        ownerId: uid,
        title: diffTab[i],
        collaborater: collabList
      });
      this.createBoard(newBoard).toPromise().then(b => {
        console.log(this.auth.currentUser);
        this.auth.currentUser.boards.push(b);
        this.patchCol(b, uid);
        console.log(b.id);
        this.pushHist(' Content was generated', b.id);
      });
    }


  }





  firebaseDeletebyUrl(url) {
    return firebase.default.storage().refFromURL(url).delete();
  }


  pushHist(content: string, boardId: number) {
    const feed = new Activity({
      author: this.auth.currentUser.firstName + ' ' + this.auth.currentUser.lastName,
      boardId: boardId,
      actionDetails: content,
      time: new Date().toString()
    });

    return this.addHistoric(feed).toPromise();
  }







}
