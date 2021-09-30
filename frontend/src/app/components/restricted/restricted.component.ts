import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-restricted',
  templateUrl:'restricted.component.html',
    styleUrls: ['restricted.component.css']
})

export class RestrictedComponent implements OnInit {
  constructor(private router: Router,
    private auth: AuthenticationService) { }

  ngOnInit() {
    setTimeout(() => {
      if (this.auth.currentUser)
        this.router.navigate(['/home']);
      else
        this.router.navigate(['/login']);
    }, 2000);
  }
}