import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  tfaCode: string;

  loginSubmitting: boolean = false;
  constructor(private authService: AuthService, private messageService: MessageService, private router: Router) { }

  doLogin() {
    if (this.email && this.password) {
      this.loginSubmitting = true;
      this.authService.login(this.email, this.password, this.tfaCode).subscribe((response) => {
        if (!(response instanceof HttpErrorResponse)) {
          console.log(response);
          
          // set the session
          this.authService.setSession(response);

          // direct to the right place
          this.messageService.addInfo('Login successful!');
          this.authService.refreshData(); // cause anything watching the current user status to refresh

          this.router.navigateByUrl('/');

          // var auth_redirect = this.authService.getOnAuthRedirect()

          // if (auth_redirect && auth_redirect != '/login') {
          //   this.authService.unSetOnAuthRedirect();                
          //   try {
          //     // TODO: Implement this better
          //     this.router.navigateByUrl(auth_redirect);
          //   } catch (error) {
          //     // if for some reason the route causes a problem then just go to the root
          //     // TODO: Find out why this sometimes gets segments
          //     this.router.navigateByUrl('/');
          //   }
          // } else {
          //   this.router.navigateByUrl('/');
          // }

        } else {
          console.error('Login failed!');
        }
      });
      this.loginSubmitting = false;
    } else {
      this.messageService.addInfo('Enter your username AND password to login!');
    }
  }

  ngOnInit() {
  }

}
