import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, map, flatMap, catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { DevicewiseApiService } from './devicewise-api.service';
import * as DwResponse from './models/dwresponse';

@Injectable({
  providedIn: 'root'
})
export class DevicewiseAngularService {
  public url = '';
  private loggedIn = false;

  constructor(
    private cookieService: CookieService,
    private apiService: DevicewiseApiService
  ) {
    this.apiService.getEndpointasObservable().subscribe((url) => this.url = url);
  }

  private setLoginStatus(status: boolean) {
    this.loggedIn = status;
  }

  public getLoginStatus(): boolean {
    return this.loggedIn;
  }

  public easyLogin(endpoint: string, username: string, password: string): Observable<DwResponse.Login> {
    console.log('logging in...', endpoint);
    this.apiService.setEndpoint(endpoint);
    return this.apiService.channelUnsubscribeAll().pipe(
      flatMap((channelUnsubscribeResponse: any) => {
        if (channelUnsubscribeResponse.success) {
          const loginResponse: DwResponse.Login = {
            success: true,
            sessionId: this.cookieService.get('sessionId'),
            roles: [this.cookieService.get('roles')],
            requirePasswordChange: false
          };
          this.setLoginStatus(true);
          return of(loginResponse);
        }
        return this.login(endpoint, username, password);
      }),
      catchError((err) => this.login(endpoint, username, password))
    );
  }

  private login(endpoint: string, username: string, password: string) {
    return this.apiService.login(endpoint, username, password).pipe(
      tap((login) => {
        this.setLoginStatus(login.success);
        if (login.success) {
          this.cookieService.deleteAll();
          this.cookieService.set('sessionId', login.sessionId);
          this.cookieService.set('roles', login.roles[0]);
        }
        return login;
      })
    );
  }

  public logout(): Observable<DwResponse.Logout> {
    return this.apiService.logout().pipe(
      tap((response) => {
        if (response.success) {
          this.cookieService.deleteAll();
          this.setLoginStatus(false);
        }
      })
    );
  }

}
