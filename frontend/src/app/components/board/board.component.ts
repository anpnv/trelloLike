import {
  Component,
  Input,
  OnInit,
  Pipe,
  PipeTransform,
  ViewEncapsulation,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Board } from "src/app/models/board";
import { Column } from "src/app/models/column";
import { User } from "src/app/models/user";
import { AuthenticationService } from "src/app/services/authentication.service";
import { BoardService } from "src/app/services/board.service";
import { UserService } from "src/app/services/user.service";
import { CreateColumnComponent } from "./create-column/create-column.component";
import { _MatOptgroupBase } from "@angular/material/core";

import { MatSnackBar } from "@angular/material/snack-bar";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { Card } from "src/app/models/card";
import { EditCardComponent } from "./edit-card/edit-card.component";
import { EditColabComponent } from "./edit-colab/edit-colab.component";
import { ConfirmBoxComponent } from "../confirm-box/confirm-box.component";
import { Activity } from "src/app/models/Activity";
import { HistoryComponent } from "./history/history.component";
import * as firebase from "firebase/app";
import "firebase/storage";
import { AttachFilesListComponent } from "./attach-files-list/attach-files-list.component";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class BoardComponent implements OnInit {
  id: number;
  name: any;
  colabList: User[] = [];

  history: Activity[] = [];

  cols: any;
  board: Board;
  owner: User;
  colonnes: Column[] = [];
  isOwner: boolean;
  canEdit: boolean;

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService,
    private userService: UserService,
    public dialog: MatDialog,
    private auth: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.canEdit = false;
    this.id = this.route.snapshot.params["id"];
    this.initBody().then(() => {
      this.updateColabList();
      this.updateHistory();
    });
  }

  displayName(user: User): string {
    return user.firstName + " " + user.lastName;
  }

  updateHistory() {
    let tab = this.board.activities;
    tab.forEach((act) => {
      this.history.push(act);
    });
  }

  updateColabList() {
    let tab = this.board.collaborater;
    tab.forEach(async (uid) => {
      const user = await this.userService.get(+uid);
      this.colabList.push(user);
    });
    this.displayTooltip();
  }

  displayTooltip(): string {
    let res: string = "Aucun membre";
    if (this.colabList.length > 0) {
      res = "Liste de collaborateurs : ";
      this.colabList.forEach((user) => {
        res += "\n" + "• " + user.firstName + " " + user.lastName;
      });
    } else {
      res = "Aucun membre";
    }
    return res;
  }

  getAllFiles() {
    const board = this.board;
    const dlg = this.dialog.open(AttachFilesListComponent, { data: { board } });
  }

  colabManagent() {
    if (this.isOwner) {
      const dlg = this.dialog.open(EditColabComponent, {
        width: "35vw",
        height: "auto",
        data: { board: this.board },
      });
      dlg.afterClosed().subscribe((res) => {
        if (res) {
          this.boardService
            .updateBoard(this.board.id, res)
            .toPromise()
            .then(() => {
              const updatedColab: User[] = res.collaborater;
              this.colabList = [];
              updatedColab.forEach(async (ele) => {
                const user = await this.userService.get(+ele);
                this.colabList.push(user);
              });
            })
            .then(() => {
              const txt = "Mis à jour des collaborateurs sur le tableau";
              this.pushHistoric(txt);
            });
        }
      });
    }
  }

  changeTitle(evt, c: Column) {
    this.canEdit = !this.canEdit;
    const temp = c ? c.title : this.board.title;
    evt.target.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (c) {
          c.title = evt.target.textContent;
        } else {
          this.board.title = evt.target.textContent;
        }

        if (evt.target.textContent == "") {
          evt.target.textContent = temp;
        } else {
          document.getElementById(evt.target.id).blur();
          if (c) {
            this.boardService
              .updateCol(c.id, c)
              .toPromise()
              .then(() => {
                const txt =
                  " Changement de titre de la colonne   : " +
                  temp +
                  " en : " +
                  c.title;
                this.pushHistoric(txt);
              });
          } else {
            this.boardService
              .updateBoard(this.board.id, this.board)
              .toPromise()
              .then(() => {
                const txt =
                  " Changement de titre du board   : " +
                  temp +
                  " en : " +
                  this.board.title;
                this.pushHistoric(txt);
              });
          }
        }
      }
    });
  }

  columnIds() {
    return this.boardService.getColumns(this.board.id);
  }

  async initBody() {
    this.board = await this.boardService.getBoardById(this.id);
    this.owner = await this.userService.get(+this.board.ownerId);
    this.boardService.getColumns(this.id).subscribe((res) => {
      this.colonnes = res;
    });
    this.isOwner = this.board.ownerId == this.auth.currentUser.id;
  }

  allCols() {
    return this.colonnes.map((c) => c.idString);
  }

  createCard(c: Column) {
    const isNew = true;
    const board = this.board;
    const card = new Card({});
    card.columnId = c.id;
    const dlg = this.dialog.open(EditCardComponent, {
      data: { card, isNew, board },
      minWidth: "35vw",
      maxWidth: "75vw",
      maxHeight: "85vh",
    });
    dlg.beforeClosed().subscribe((res) => {
      if (res) {
        this.boardService.createCard(res).subscribe((res) => {
          c.cards.push(res);
          const txt = " Création de la carte  : " + res.title;
          this.pushHistoric(txt);
        });
      }
    });
  }

  editCard(card: Card) {
    const isNew = false;
    const board = this.board;
    const dlg = this.dialog.open(EditCardComponent, {
      data: { card, isNew, board },
      minWidth: "35vw",
      maxWidth: "75vw",
      maxHeight: "85vh",
    });
    dlg.beforeClosed().subscribe((res) => {
      if (res) {
        this.boardService
          .updateCardPos(card.id, res)
          .toPromise()
          .then(() => {
            const txt = " Edition de la carte : " + card.title;
            this.pushHistoric(txt);
          });
      }
    });
  }

  pushHistoric(txt: string) {
    return this.boardService
      .pushHist(txt, this.board.id)
      .then((res) => this.history.unshift(res));
  }

  openHistoryWindow() {
    const history = this.history;
    this.dialog.open(HistoryComponent, {
      data: { history },
      width: "40vh",
      maxHeight: "80vh",
    });
  }

  deleteCol(c: Column) {
    const object = c;
    const text =
      "Voulez vous vraiment supprimer la colonne : " + c.title + " ?";
    const dlg = this.dialog.open(ConfirmBoxComponent, {
      data: {
        object,
        text,
      },
    });

    dlg.beforeClosed().subscribe((res) => {
      if (res) {
        const index = this.colonnes.indexOf(res);
        if (index > -1) {
          this.colonnes.splice(index, 1);
          for (let i = 0; i < this.colonnes.length; i++) {
            this.colonnes[i].pos = i;
            this.boardService
              .updateCol(this.colonnes[i].id, this.colonnes[i])
              .toPromise();
          }
        }
        this.boardService
          .deleteCol(res)
          .toPromise()
          .then(() => {
            const txt = "Suppression de la colonne :  " + object.title;
            this.pushHistoric(txt);
          });

        //suppression des fichiers dans les cartes sur firebase
        res.cards.forEach((elem) => {
          if (elem.fileUrl) {
            console.log(firebase.default.storage().refFromURL(elem.fileUrl));
            this.FirebaseFileDelete(elem.fileUrl);
          }
        });
      }
    });
  }

  deleteBoard() {
    const object = this.board;
    const text =
      "Voulez vous vraiment supprimer le tableau : " + object.title + " ?";
    const dlg = this.dialog.open(ConfirmBoxComponent, {
      data: {
        object,
        text,
      },
    });

    dlg.beforeClosed().subscribe((res) => {
      if (res) {
        this.boardService
          .deleteBoard(res)
          .toPromise()
          .then(() => {
            this.router.navigate(["/home"]);
          });

        firebase.default
          .storage()
          .ref(res.id + "/")
          .list()
          .then((res) => {
            res.items.forEach((elem) => {
              elem.delete();
            });
          });
      }
    });
  }

  onCardDrop(event: CdkDragDrop<Card[]>, col: Column) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      for (let i = 0; i < col.cards.length; i++) {
        col.cards[i].pos = i;
        this.boardService
          .updateCardPos(col.cards[i].id, col.cards[i])
          .toPromise();
      }
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      for (let i = 0; i < event.previousContainer.data.length; i++) {
        event.previousContainer.data[i].pos = i;
        this.boardService
          .updateCardPos(
            event.previousContainer.data[i].id,
            event.previousContainer.data[i]
          )
          .toPromise();
      }
      for (let i = 0; i < event.container.data.length; i++) {
        event.container.data[i].pos = i;
        event.container.data[i].columnId = col.id;
        this.boardService
          .updateCardPos(event.container.data[i].id, event.container.data[i])
          .toPromise();
      }

      var from = event.previousContainer.id.split("+").pop();
      var to = event.container.id.split("+").pop();
      var cardTitle = event.container.data[event.currentIndex].title;
      const txt = cardTitle + " a été transferé de " + from + " à " + to;
      this.pushHistoric(txt);
    }
  }

  createColumn() {
    const dlg = this.dialog.open(CreateColumnComponent, {
      width: "40vw",
    });
    dlg.afterClosed().subscribe((res) => {
      if (res) {
        const data = {
          title: res,
          boardId: this.id,
        };
        this.boardService.createColumn(data).subscribe((col) => {
          this.colonnes.push(col);
        });
        const txt = "Ajout de la colonne : " + res;
        this.pushHistoric(txt);
      }
    });
  }

  deleteCard(c: Card, col: Column) {
    const object = c;
    const text = "Voulez vous supprimer la carte : " + object.title + " ? ";
    const dlg = this.dialog.open(ConfirmBoxComponent, {
      data: {
        object,
        text,
      },
    });

    dlg.afterClosed().subscribe((res) => {
      if (res) {
        if (res.fileUrl) {
          this.FirebaseFileDelete(res.fileUrl);
        }
        this.boardService
          .deleteCard(res)
          .toPromise()
          .then(() => {
            const txt = "Suppression de la carte :  " + res.title;
            this.pushHistoric(txt);
            const idx = col.cards.indexOf(res);
            if (idx > -1) {
              col.cards.splice(idx, 1);
              for (let i = 0; i < col.cards.length; i++) {
                col.cards[i].pos = i;
                this.boardService.updateCardPos(col.cards[i].id, col.cards[i]);
              }
            }
          });
      }
    });
  }

  FirebaseFileDelete(url) {
    this.boardService.firebaseDeletebyUrl(url);
  }


  onColDrop(event: CdkDragDrop<Column[]>, b: Board) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      for (let i = 0; i < b.columns.length; i++) {
        b.columns[i].pos = i;
        this.boardService
          .updateColPos(b.columns[i].id, b.columns[i])
          .toPromise();
      }
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      for (let i = 0; i < event.previousContainer.data.length; i++) {
        event.previousContainer.data[i].pos = i;
        this.boardService
          .updateColPos(
            event.previousContainer.data[i].id,
            event.previousContainer.data[i]
          )
          .toPromise();
      }
      for (let i = 0; i < event.container.data.length; i++) {
        event.container.data[i].pos = i;
        event.container.data[i].boardId = b.id;
        this.boardService
          .updateColPos(event.container.data[i].id, event.container.data[i])
          .toPromise();
      }

      
      var coltitle = event.container.data[event.currentIndex].title
      const txt =  "La colonne " + coltitle + " a été déplacée";
      this.pushHistoric(txt);
    }
  }
}
