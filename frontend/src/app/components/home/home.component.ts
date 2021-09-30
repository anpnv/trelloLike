import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RaisedModule } from 'ngx-color';
import { Observable } from 'rxjs';
import { Board } from 'src/app/models/board';
import { Card } from 'src/app/models/card';
import { Column } from 'src/app/models/column';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BoardService } from 'src/app/services/board.service';
import { UserService } from 'src/app/services/user.service';
import { DialogCreateBoardComponent } from './dialog-create-board/dialog-create-board.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {

  @Input() id: number;
  currentUser$: any;




  constructor(
    public dialog: MatDialog,
    private boardService: BoardService,
    private router: Router,
    private auth: AuthenticationService,
    private userService: UserService) {
  }

  async ngOnInit() {
    this.refreshList();
  }

  refreshList() {
    this.currentUser$ = this.userService.get(this.auth.currentUser.id);
  }

  navigate(b) {
    this.router.navigate(['/board/' + b]);
  }


  async createBoard() {
    const dlg = this.dialog.open(DialogCreateBoardComponent, {
      width: '40vw',
    });
    dlg.afterClosed().subscribe(res => {
      if (res) {
        this.boardService.createBoard(new Board(res)).toPromise().then(b => {
          if (b) {
            this.navigate(b.id);
          }
        });
      }
    });
  }

}
