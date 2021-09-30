import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutes } from '../routing/app.routing'

import { HomeComponent } from '../components/home/home.component';
import { NavMenuComponent } from '../components/nav-menu/nav-menu.component';
import { AppComponent } from '../components/app/app.component';
import { UserlistComponent } from '../components/userlist/userlist.component';
import { RestrictedComponent } from '../components/restricted/restricted.component';
import { LoginComponent } from '../components/login/login.component';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { JwtInterceptor } from '../interceptors/jwt.interceptor'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared.module';
import { EditUserComponent } from '../components/edit-user/edit-user.component';
import { SetFocusDirective } from '../directives/setfocus.directive';
import { DialogCreateBoardComponent } from '../components/home/dialog-create-board/dialog-create-board.component';
import { BoardComponent } from '../components/board/board.component';
import { CreateColumnComponent } from '../components/board/create-column/create-column.component';

import { CardLineComponent } from '../components/board/card-line/card-line.component';
import { EditCardComponent } from '../components/board/edit-card/edit-card.component';


import { environment } from 'src/environments/environment';
import { EditColabComponent } from '../components/board/edit-colab/edit-colab.component';
import { ConfirmBoxComponent } from '../components/confirm-box/confirm-box.component';
import { DatePipe } from '@angular/common';
import { HistoryComponent } from '../components/board/history/history.component';
import { ColorSketchModule } from 'ngx-color/sketch';
import { BackgroundpickerComponent } from '../components/backgroundpicker/backgroundpicker.component';

import * as firebase from 'firebase/app';
import 'firebase/storage';
import { AttachFilesListComponent } from '../components/board/attach-files-list/attach-files-list.component';

firebase.default.initializeApp(environment.firebaseConfig);



@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    UserlistComponent,
    RestrictedComponent,
    LoginComponent,
    UnknownComponent,
    EditUserComponent,
    SetFocusDirective,
    BoardComponent,
    DialogCreateBoardComponent,
    CreateColumnComponent,
    CardLineComponent,
    EditCardComponent,
    EditColabComponent,
    ConfirmBoxComponent,
    HistoryComponent,
    BackgroundpickerComponent,
    AttachFilesListComponent
  ],
  entryComponents: [EditUserComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    AppRoutes,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SharedModule,
    ColorSketchModule
  ],
  providers: [ DatePipe,
    {
      provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
