import { Injectable } from '@angular/core';
// https://stackoverflow.com/questions/47369850/property-get-does-not-exist-on-type-httpclientmodule
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { tap, catchError } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { Subject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from './message.service';
import { Globals } from '../globals';
import { StatusMessage } from '../models/message.model';
import { UserSessionResponse, IdTokenResponse } from '../models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt'

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
  login(email: string, password: string, code?: string): Observable<IdTokenResponse> {
    const device = 'Comms Client';
    const perpetual = true;

    return this.http.post<IdTokenResponse>(`${this.globals.baseUrlRoot}/auth`,
      { 'session': { email, password, code, device, perpetual } }
    ).pipe(
      tap(result => {
        this.messageService.addSuccess('Login Successful! Welcome back!');
      }),
      catchError(this.err.handleError<any>('Login'))
    );
  }

  // Internal stuff below here

  public hasClaim(roleId: number): boolean {
    if (this.isLoggedIn()) {
      if ((this.retrieveUserSession() as UserSessionResponse).roles.length > 0) {
        const roles = (this.retrieveUserSession() as UserSessionResponse).roles;
        const claim = roles.find(x => x === roleId);
        if (claim === roleId) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
  }

  setSession(authResult): Observable<boolean> {
    if (authResult !== 'undefined') {
      localStorage.setItem('userObject', authResult);
      return of(true);
    } else {
      console.error('Undefined authResult passed to setSession!');
      return of(false);
    }
  }

  logout(): Observable<boolean> {
    // let didLogout = localStorage.removeItem('userObject') ? of(true) : of(false);
    // return didLogout
    localStorage.removeItem('userObject');
    return of(true);
  }

  public isLoggedIn() {
    if (this.retrieveUserSession()) {
      const notExpired = moment().isBefore(this.getExpiration());
      console.log(notExpired);

      return notExpired;
    } else {
      // this.logout();
      return false;
    }
  }

  // tslint:disable-next-line:member-ordering
  public static retrieveUser() {
    if (localStorage.getItem('userObject') !== null && localStorage.getItem('userObject') !== 'undefined') {
      const retrieved = localStorage.getItem('userObject');
      const user = JSON.parse(retrieved);
      // console.log(user);
      return user;
    }
  }

  setOnAuthRedirect(uri: string) {
    localStorage.setItem('authRedirect', uri);
  }

  unSetOnAuthRedirect() {
    localStorage.removeItem('authRedirect');
  }

  getOnAuthRedirect(): string {
    return localStorage.getItem('authRedirect');
  }

  /**
   * Retrieve the current JWT token string
   * @returns Session JWT Token
   */
  retrieveSession(): string {
    const encodedJwt = localStorage.getItem('userObject');
    if (encodedJwt) {
      const results = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+\/=]*$/.test(encodedJwt);
      if (results) {
        return encodedJwt;
      } else {
        this.logout();
      }
    }
  }

  retrieveUserSession(): UserSessionResponse {
    const session = this.retrieveSession();
    if (session) {
      const jwtHelper = new JwtHelperService();
      const decodedToken = jwtHelper.decodeToken(session);

      return {
        id: decodedToken.sub,
        roles: decodedToken.roles,
        first_name: decodedToken.given_name,
        last_name: decodedToken.family_name,
        avatar: decodedToken.avatar,
        expires: decodedToken.exp,
        tfa_enabled: decodedToken.tfa_enabled,
        character_id: decodedToken.character_id
      } as UserSessionResponse;
    }
  }

  isLoggedOut() {
      return !this.isLoggedIn();
  }

  getExpiration() {
      const userObject = this.retrieveUserSession();
      console.log(userObject.expires);
      return moment.unix(userObject.expires);
  }

}
