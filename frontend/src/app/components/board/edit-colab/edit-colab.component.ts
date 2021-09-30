import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Board } from 'src/app/models/board';
import { Column } from 'src/app/models/column';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import * as _ from 'lodash-es';
import { _MatOptgroupBase } from '@angular/material/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-colab',
  templateUrl: './edit-colab.component.html',
  styleUrls: ['./edit-colab.component.css']
})
export class EditColabComponent {


  public form: FormGroup;
  public board: Board;
  public CtlCollabortater: FormControl;
  public colabList: User[] = [];



  constructor(
    public dialogRef: MatDialogRef<EditColabComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { board: Board },
    public fb: FormBuilder,
    private auth: AuthenticationService,
    private userService: UserService
  ) {
    this.board = data.board;
    this.CtlCollabortater = this.fb.control([]);
    this.userService.getAll().subscribe(r => {
      r.forEach(async value => {
        if (this.auth.currentUser.id !== value.id)
          this.colabList.push(value);
      });
    });
    this.form = this.fb.group({
      collaborater: this.CtlCollabortater
    });

    this.form.patchValue(data.board);

  }

  cancel(): void {
    this.dialogRef.close();
  }

  update() {
    this.board.collaborater = this.form.value.collaborater;
    this.dialogRef.close(this.data.board);
  }

}
