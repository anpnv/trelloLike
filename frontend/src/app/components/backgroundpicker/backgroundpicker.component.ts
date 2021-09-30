import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-backgroundpicker',
  templateUrl: './backgroundpicker.component.html',
  styleUrls: ['./backgroundpicker.component.css']
})
export class BackgroundpickerComponent implements OnInit {


  color: string;

  constructor(public dialogRef: MatDialogRef<BackgroundpickerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { state: any },) {
    this.color = data.state;
  }

  ngOnInit(): void {
  }


  changeComplete(evt) {
    this.color = (evt.color.hex);
  }

  close() {
    this.dialogRef.close();
  }

  confirm() {
    this.dialogRef.close(this.color);
  }


}
