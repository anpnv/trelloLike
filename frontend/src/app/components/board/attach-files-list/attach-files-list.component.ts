import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { Board } from 'src/app/models/board';

@Component({
  selector: 'app-attach-files-list',
  templateUrl: './attach-files-list.component.html',
  styleUrls: ['./attach-files-list.component.css']
})
export class AttachFilesListComponent implements OnInit {


  list: any[] = [];

  map = new Map();

  constructor(
    public dialogRef: MatDialogRef<AttachFilesListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { board: Board },

  ) { }

  ngOnInit(): void {


    firebase.default.storage().ref(this.data.board.id + '/').list().then(list => {
      list.items.map(res => {
        this.list.push(res);

        res.getDownloadURL().then(url => {
          this.map.set(res.name, url);
        })
      });
    });




  }


  openTab(url) {
    window.open(url, '_blank');
  }


  close() {
    this.dialogRef.close();
  }

}
