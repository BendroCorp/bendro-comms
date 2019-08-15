import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // https://stackoverflow.com/questions/47369850/property-get-does-not-exist-on-type-httpclientmodule
import * as moment from 'moment';
import { tap, catchError } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { Subject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from './message.service';
import { Globals } from '../globals';
import { StatusMessage } from '../models/message.model';
import { UserSessionResponse } from '../models/user.model';

@Injectable()
export class AuthService {
  // https://www.metaltoad.com/blog/angular-5-making-api-calls-httpclient-service
  // https://blog.angular-university.io/angular-jwt-authentication/
  constructor(public http: HttpClient,
    public messageService: MessageService,
    public err: ErrorService,
    public globals: Globals,
    public router: Router) { }

  private dataRefreshSource = new Subject();
  dataRefreshAnnounced$ = this.dataRefreshSource.asObservable();
  refreshData() {
    console.log('Auth service data refresh called!');
    this.dataRefreshSource.next();
  }

  /** Log the user in. */
  login(email: string, password: string, code?: string) {
    const device = 'Comms Client';
    const perpetual = true;

    return this.http.post<UserSessionResponse>(`${this.globals.baseUrlRoot}/auth`, { 'session': { email, password, code, device, perpetual } }).pipe(
      tap(result => {
        this.messageService.addSuccess('Login Successful! Welcome back!')
      }),
      catchError(this.err.handleError('Login', []))
    );
  }
 
  // Internal stuff below here

  public hasClaim(roleId: number): boolean {
    if (this.isLoggedIn()) {
      if ((this.retrieveUserSession() as UserSessionResponse).claims.length > 0) {
        const claim = (this.retrieveUserSession() as UserSessionResponse).claims.find(x => x.id === roleId)
        if (claim) {
          return true
        }
      }
      return false
    } else {
      return false
    }
  }

  setSession(authResult): Observable<boolean> {
    if (authResult !== 'undefined') {
      localStorage.setItem('userObject', JSON.stringify(authResult));
      return of(true)
    } else {
      console.error('Undefined authResult passed to setSession!');
      return of(false)
    }
  }

  logout(): Observable<boolean> {
    // let didLogout = localStorage.removeItem('userObject') ? of(true) : of(false);
    // return didLogout
    localStorage.removeItem('userObject')
    return of(true)
  }

  public isLoggedIn() {
    const session = this.retrieveUserSession();
    if (session) {
      const notExpired = session.token_expires ? moment().isBefore(this.getExpiration()) : true;
      return notExpired;
    } else {
      // this.logout();
      return false;
    }
  }

  // tslint:disable-next-line:member-ordering
  public static retrieveUser() {
    if (localStorage.getItem('userObject') !== null && localStorage.getItem('userObject') !== 'undefined') {
      const retrieved = localStorage.getItem('userObject')
      const user = JSON.parse(retrieved)
      // console.log(user);
      return user;
    }
  }

  setOnAuthRedirect(uri: string) {
    localStorage.setItem('authRedirect', uri)
  }

  unSetOnAuthRedirect() {
    localStorage.removeItem('authRedirect')
  }

  getOnAuthRedirect(): string {
    return localStorage.getItem('authRedirect')
  }

  retrieveUserSession(): UserSessionResponse {
    if (localStorage.getItem('userObject') !== null && localStorage.getItem('userObject') !== 'undefined') {
      const retrieved = localStorage.getItem('userObject')
      const user = JSON.parse(retrieved)
      // console.log(user);
      return user;
    }
  }

  isLoggedOut() {
      return !this.isLoggedIn();
  }

  getExpiration() {
      const userObject = this.retrieveUserSession();
      return moment(userObject.token_expires);
  }

}