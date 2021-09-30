import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

import * as _ from 'lodash-es';
import { User } from '../../models/user';


import { StateService } from 'src/app/services/state.service';
import { MatTableState } from 'src/app/helpers/mattable.state';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BoardService } from 'src/app/services/board.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent implements AfterViewInit, OnDestroy {

  isVisible: boolean;
  user: User;
  displayedColumns: string[] = ['pseudo', 'firstName', 'lastName', 'nbTab', 'role', 'actions'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource();
  filter: string;
  state: MatTableState;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private userService: UserService,
    private stateService: StateService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private boardService: BoardService,
    private auth: AuthenticationService,
    private router: Router,
  ) {

    

    this.userService.get(this.auth.currentUser.id).then(res => {
      this.user = res;
      this.isVisible = res.boards.length <= 0;
    });
    this.state = this.stateService.userListState;
  }


  patchData(){
    this.isVisible = false;
    this.boardService.patch(this.user.id);

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      const str = data.pseudo + ' ' + data.firstName + ' ' + data.lastName + ' ' + data.birthDate + ' ' + data.roleAsString;
      return str.toLowerCase().includes(filter);
    };
    this.state.bind(this.dataSource);
    this.refresh();
  }

  refresh() {
    this.userService.getAll().subscribe(users => {
      this.dataSource.data = users;
      this.state.restoreState(this.dataSource);
      this.filter = this.state.filter;

    });
  }

  filterChanged(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.state.filter = this.dataSource.filter;
    if (this.dataSource.paginator)
      this.dataSource.paginator.firstPage();
  }

  edit(user: User) {
    const dlg = this.dialog.open(EditUserComponent, { data: { user, isNew: false }, width: '30vw' });
    dlg.beforeClosed().subscribe(res => {
      if (res) {
        _.assign(user, res);
        this.userService.update(user.id, res).subscribe(data => {
          if (!data) {
            this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
            this.refresh();
          }
        });
      }
    });
  }

  delete(user: User) {
    const backup = this.dataSource.data;
    this.dataSource.data = _.filter(this.dataSource.data, m => m.pseudo !== user.pseudo);
    const snackBarRef = this.snackBar.open(`User '${user.pseudo}' will be deleted`, 'Undo', { duration: 10000 });
    snackBarRef.afterDismissed().subscribe(res => {
      if (!res.dismissedByAction)
        this.userService.delete(user).subscribe();
      else
        this.dataSource.data = backup;
    });
  }

  create() {
    const user = new User({});
    const dlg = this.dialog.open(EditUserComponent, { data: { user, isNew: true }, width: '30vw' });
    dlg.beforeClosed().subscribe(res => {
      if (res) {
        console.log(res);
        this.dataSource.data = [...this.dataSource.data, new User(res)];
        this.userService.add(res).subscribe(res => {
          if (!res) {
            this.snackBar.open(`There was an error at the server. The member has not been created! Please try again.`, 'Dismiss', { duration: 10000 });
            this.refresh();
          }
        });
      }
    });
  }


  ngOnDestroy(): void {
    this.snackBar.dismiss();
  }
}


