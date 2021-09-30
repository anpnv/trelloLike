import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { AuthenticationService } from '../../services/authentication.service';
import { User } from 'src/app/models/user';
import { MatDialog } from '@angular/material/dialog';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';
import { BoardService } from 'src/app/services/board.service';
import { promise } from 'protractor';


@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  ctlPseudo: FormControl;
  ctlPassword: FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    public dialog: MatDialog,
  ) {

    if (this.authenticationService.currentUser) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {
    this.ctlPseudo = this.formBuilder.control('', Validators.required);
    this.ctlPassword = this.formBuilder.control('', Validators.required);
    this.loginForm = this.formBuilder.group({
      pseudo: this.ctlPseudo,
      password: this.ctlPassword
    });



    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }


  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.authenticationService.login(this.f.pseudo.value, this.f.password.value)
      .subscribe(
        data => {
          if (data.role == 2 && data.boards.length == 0) {
            this.router.navigate(['/users']);
          } else {
            this.router.navigate([this.returnUrl]);
          }

        },
        error => {
          const errors = error.error.errors;
          for (let field in errors) {
            this.loginForm.get(field.toLowerCase()).setErrors({ custom: errors[field] })
          }
          this.loading = false;
        });
  }



  signup() {
    const user = new User({});
    const dlg = this.dialog.open(EditUserComponent, { data: { user, isNew: true, signup: true }, width: '30vw' });
    dlg.beforeClosed().subscribe(res => {
      if (res) {
        this.authenticationService.signup(res).subscribe();
        this.router.navigate(['/home']);
      }
    })
  }






}