import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { Card } from 'src/app/models/card';

@Component({
  selector: 'app-card-line',
  templateUrl: './card-line.component.html',
  styleUrls: ['./card-line.component.scss']
})
export class CardLineComponent implements OnInit {


  fontColor;

  @Input() title: string;
  @Input() card: Card;
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }



  lightOrDark(color) {
    if (color) {
      var r, g, b, hsp;
      if (color.match(/^rgb/)) {
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        r = color[1];
        g = color[2];
        b = color[3];
      }
      else {
        color = +("0x" + color.slice(1).replace(
          color.length < 5 && /./g, '$&$&'));
        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
      }

      hsp = Math.sqrt(
        0.299 * (r * r) +
        0.587 * (g * g) +
        0.114 * (b * b)
      );

      if (hsp > 127.5) {
        return 'black';
      } else {
        return 'white';
      }
    } else {
      return 'black';
    }
  }



  showName(x) {
    return firebase.default.storage().refFromURL(x).name;
  }


}
