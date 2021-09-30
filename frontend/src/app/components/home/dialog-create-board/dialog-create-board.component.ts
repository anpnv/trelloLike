import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash-es';
import { Observable } from 'rxjs';
import { Board } from 'src/app/models/board';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dialog-create-board',
  templateUrl: './dialog-create-board.component.html',
  styleUrls: ['./dialog-create-board.component.css']
})
export class DialogCreateBoardComponent {


  public form: FormGroup;
  public ctlTitle: FormControl;
  public ctlCollaboraters: FormControl;
  public userList: User[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogCreateBoardComponent>,
    public fb: FormBuilder,
    private auth: AuthenticationService,
    private userService: UserService) {

    this.ctlTitle = this.fb.control('', [Validators.required]);
    this.ctlCollaboraters = this.fb.control([]);
    this.userService.getAll().subscribe(res => {

      res.forEach(async val => {
        if (val.id != this.auth.currentUser.id) {
          this.userList.push(val);
        }
      })

    });


    this.form = this.fb.group({
      title: this.ctlTitle,
      collaboraters: this.ctlCollaboraters
    });


  }




  cancel(): void {
    this.dialogRef.close();
  }


  create() {
    var data = {
      ownerId: this.auth.currentUser.id,
      title: this.form.get('title').value,
      collaborater: this.form.get('collaboraters').value
    }
    this.dialogRef.close(data);
  }



}
