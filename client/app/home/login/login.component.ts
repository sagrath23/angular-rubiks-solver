import { Component }                 from '@angular/core';
import { OnInit }                    from '@angular/core';
import { Router }                    from '@angular/router';
import { Location }                  from '@angular/common';

import { User } from '../auth/user';

import { AuthService } from '../auth/auth.service';

@Component({
  moduleId: module.id,
  selector: 'login-component',
  templateUrl: 'login.component.html',
  providers: [AuthService]
})

export class LoginComponent {

	title = 'Login Component';

  loggedUser: User;

	constructor(
    private router: Router,
    private authService: AuthService) { }

  login(username:string, password:string): void{
    this.authService.login(username, password)
          .then((data) => {
            this.loggedUser = data;
            if(this.loggedUser.sessionId){
              this.router.navigate(['/videolist']);
            }
          });
  }
}
