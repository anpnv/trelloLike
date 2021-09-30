import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-column',
  templateUrl: './create-column.component.html',
  styleUrls: ['./create-column.component.css']
})
export class CreateColumnComponent {

  public form: FormGroup;
  public ctlTitle: FormControl;

  constructor(
    public dialogRef: MatDialogRef<CreateColumnComponent>,
    public fb: FormBuilder) {

    this.ctlTitle = this.fb.control('', [Validators.required]);
    this.form = this.fb.group({
      title: this.ctlTitle
    });

  }

  cancel(): void {
    this.dialogRef.close();
  }

  create(){
    this.dialogRef.close(this.form.get('title').value);
  }

}
