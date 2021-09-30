import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AsyncValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import * as _ from 'lodash-es';
import { User, Role } from 'src/app/models/user';

@Component({
  selector: 'app-edit-user-mat',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {
  public frm: FormGroup;
  public ctlPseudo: FormControl;
  public ctlFirstName: FormControl;
  public ctlLastName: FormControl;
  public ctlPassword: FormControl;
  public ctlBirthDate: FormControl;


  public ctlConfirmPassword: FormControl;


  public ctlRole: FormControl;
  public ctlEmail: FormControl;
  public isNew: boolean;
  public signup: boolean;


  private user: User;

  constructor(public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User; isNew: boolean; signup?: boolean },
    private fb: FormBuilder,
    private userService: UserService
  ) {


    this.user = data.user;
    this.ctlPseudo = this.fb.control('', [
      Validators.required,
      Validators.minLength(3),
      this.forbiddenValue('abc')
    ], [this.pseudoUsed()]);
    this.ctlPassword = this.fb.control('', data.isNew ? [Validators.required, Validators.minLength(3)] : []);
    this.ctlConfirmPassword = this.fb.control('', []);



    this.ctlFirstName = this.fb.control('', []);
    this.ctlLastName = this.fb.control('', []);

    this.ctlEmail = new FormControl('', [Validators.required, Validators.email], [this.emailUsed()]);
    this.ctlBirthDate = this.fb.control('', [this.validateBirthDate()]);
    this.ctlRole = this.fb.control(Role.Member, []);

    this.frm = this.fb.group({
      pseudo: this.ctlPseudo,
      password: this.ctlPassword,
      confirmPassword: this.ctlConfirmPassword,
      firstName: this.ctlFirstName,
      lastName: this.ctlLastName,
      birthDate: this.ctlBirthDate,
      email: this.ctlEmail,
      role: this.ctlRole
    });

    this.signup = data.signup;
    this.isNew = data.isNew;
    this.frm.patchValue(data.user);


    if (this.signup) {
      this.ctlConfirmPassword.setValidators([
        Validators.required,
        Validators.minLength(3)
      ])
      this.frm.setValidators([this.validatorPassword]);
    }


  }






  forbiddenValue(val: string): any {
    return (ctl: FormControl) => {
      if (ctl.value === val) {
        return { forbiddenValue: { currentValue: ctl.value, forbiddenValue: val } };
      }
      return null;
    };
  }


  validateBirthDate(): any {
    return (ctl: FormControl) => {
      const date = new Date(ctl.value);
      const diff = Date.now() - date.getTime();
      if (diff < 0)
        return { futureBorn: true }
      var age = new Date(diff).getUTCFullYear() - 1970;
      if (age < 18)
        return { tooYoung: true };
      return null;
    };
  }


  pseudoUsed(): AsyncValidatorFn {
    let timeout: NodeJS.Timer;
    return (ctl: FormControl) => {
      clearTimeout(timeout);
      const pseudo = ctl.value;
      return new Promise(resolve => {
        timeout = setTimeout(() => {
          if (ctl.pristine) {
            resolve(null);
          } else {
            if (this.user === undefined) {
              this.userService.IsAvailablePseudo(pseudo).subscribe(exist => {
                return (exist ? null : this.ctlPseudo.setErrors({ pseudoUsed: true }));
              });
            } else if (pseudo !== this.user.pseudo) {
              this.userService.IsAvailablePseudo(pseudo).subscribe(exist => {
                return (exist ? null : this.ctlPseudo.setErrors({ pseudoUsed: true }));
              });
            }
            resolve(null);
          }

        }, 300);

      });
    };
  }

  emailUsed(): AsyncValidatorFn {
    let timeout: NodeJS.Timer;
    return (ctl: FormControl) => {
      clearTimeout(timeout);
      const email = ctl.value;
      return new Promise(resolve => {
        timeout = setTimeout(() => {
          if (ctl.pristine) {
            resolve(null);
          } else {
            if (this.user === undefined) {
              this.userService.emailExist(email).subscribe(exist => {
                return (exist ? null : this.ctlEmail.setErrors({ emailUsed: true }));
              });

            } else if (email !== this.user.email) {
              this.userService.emailExist(email).subscribe(exist => {
                return (exist ? null : this.ctlEmail.setErrors({ emailUsed: true }));
              });
            }
            resolve(null);
          }

        }, 300);
      });
    };
  }


  validatorPassword(formGroup: FormGroup): ValidationErrors {
    let password: string = formGroup.controls.password.value;
    let confirmPassword: string = formGroup.controls.confirmPassword.value;

    if (password === null && (confirmPassword === null || confirmPassword === undefined || confirmPassword === "")) return null;
    return password === confirmPassword ? null : { passwordNotEqual: true };
  }





  onNoClick(): void {
    this.dialogRef.close();
  }

  update() {
    this.dialogRef.close(this.frm.value);
  }

  cancel() {
    this.dialogRef.close();
  }
}