import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-box',
  templateUrl: './confirm-box.component.html',
  styleUrls: ['./confirm-box.component.css']
})
export class ConfirmBoxComponent {

  object?: any;
  text: string;


  constructor(
    public dialogRef: MatDialogRef<ConfirmBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { object?: any, text: string }
  ) {

    this.object = data.object;
    this.text = data.text;
  }

  confirm() {
    this.dialogRef.close(this.object);
  }

  cancel() {
    this.dialogRef.close();
  }



}
