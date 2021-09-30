import { Component, Inject, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Board } from 'src/app/models/board';
import { Card } from 'src/app/models/card';
import { Column } from 'src/app/models/column';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { BackgroundpickerComponent } from '../../backgroundpicker/backgroundpicker.component';
import * as firebase from 'firebase/app';
import 'firebase/storage';

@Component({
  selector: 'app-edit-card',
  templateUrl: './edit-card.component.html',
  styleUrls: ['./edit-card.component.css']
})
export class EditCardComponent implements OnInit {

  public isNew: boolean;
  public form: FormGroup;
  public colabList: User[] = [];

  public card: Card;
  public ctlTitle: FormControl;
  public ctlContent: FormControl;
  public CtlCollabortater: FormControl;

  public color: string;
  public fileUrl: any;



  private deletePressed: boolean;
  private fileTemp: any;
  private isLoading: boolean;
  private progressValue;




  constructor(
    public dialogRef: MatDialogRef<EditCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { card: Card, isNew: boolean, board: Board },
    private fb: FormBuilder,
    private userService: UserService,
    private auth: AuthenticationService,
    public dialog: MatDialog
  ) {
    this.card = data.card;
    this.isNew = data.isNew;
    this.color = data.card.color;

    this.fileUrl = data.card.fileUrl;
    this.isLoading = false;
    this.CtlCollabortater = this.fb.control([]);
    this.ctlTitle = this.fb.control('', [Validators.required]);
    this.ctlContent = this.fb.control('', []);


    data.board.collaborater.forEach(res => {
      this.userService.get(res).then(user => {
        this.colabList.push(user);
      })
    })



    this.form = this.fb.group({
      title: this.ctlTitle,
      content: this.ctlContent,
      collaborater: this.CtlCollabortater,
    });

    this.form.patchValue(data.card);
  }

  ngOnInit(): void {
  }

  updateCard(data) {
    this.card.title = data.title;
    this.card.content = data.content;
    this.card.collaborater = data.collaborater;
  }


  confirm() {
    this.updateCard(this.form.value);
    if (this.isNew) {
      this.card.createAt = new Date().toString();
      this.card.ownerId = this.auth.currentUser.id;
    }

    if (this.deletePressed) {
      firebase.default.storage().refFromURL(this.card.fileUrl).delete();
    }

    this.card.fileUrl = this.fileUrl;
    this.card.color = this.color;
    this.card.lastUpdate = new Date().toString();
    this.dialogRef.close(this.card);
  }

  cancel() {
    this.progressValue = 0;
    if (this.fileUrl || this.deletePressed) {
      if (this.fileUrl)
        firebase.default.storage().refFromURL(this.fileUrl).delete();
    }

    this.dialogRef.close();
  }


  open() {
    const state = this.card.color;
    const dlg = this.dialog.open(BackgroundpickerComponent, { data: { state }, width: '400px' });
    dlg.afterClosed().subscribe(res => {
      if (res)
        this.color = res;

    });
  }

  upload(evt) {
    this.fileTemp = evt.target.files[0];
    this.pushFirebase(this.fileTemp);
  }

  pushFirebase(file) {
    this.isLoading = true;
    this.progressValue = 0;
    const board = this.data.board;
    const task = firebase.default.storage().ref(board.id + '/' + file.name).put(file); //board id  & ownerId;
    task.on('state_changed', (res) => {
      this.progressValue = Math.floor((res.bytesTransferred / res.totalBytes) * 100);
    });
    task.then(r => {
      r.ref.getDownloadURL().then(url => {
        this.fileUrl = url;
      })
    }).finally(() => {
      this.isLoading = false;
    });
  }

  deleteFile(file) {
    this.deletePressed = true;
    this.fileUrl = null;
  }

  showName(x) {
    return firebase.default.storage().refFromURL(x).name;
  }

  openNewTab(url) {
    window.open(url, '_blank');
  }



  formatBytes(bytes) {
    var kb = 1024;
    var idx = Math.floor(Math.log(bytes) / Math.log(kb));
    var fileSizeTypes = ["bytes", "KO", "MB", "GB"];
    return +(bytes / kb / kb).toFixed(2) + ' ' + fileSizeTypes[idx]
  }

}
