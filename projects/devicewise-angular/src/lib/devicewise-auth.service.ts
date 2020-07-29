import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, map, flatMap, catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { DevicewiseApiService } from './devicewise-api.service';
import * as DwResponse from './models/dwresponse';

@Injectable({
  providedIn: 'root'
})
export class DevicewiseAuthService {
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

  public getSessionInfo(): Observable<DwResponse.SessionInfo> {
    return this.apiService.sessionInfo();
  }

  public easyLogin(endpoint: string, username: string, password: string): Observable<DwResponse.LoginResponse> {
    this.apiService.setEndpoint(endpoint);
    return this.getSessionInfo().pipe(
      flatMap((sessionInfo: DwResponse.SessionInfo) => {
        if (sessionInfo.success) {
          this.apiService.setEndpoint(endpoint);
          this.setLoginStatus(true);
          return of({
            success: sessionInfo.success,
            sessionId: null,
            roles: sessionInfo.params.roles,
            requirePasswordChange: sessionInfo.params.requirePasswordChange,
            features: sessionInfo.params.features
          });
        } else {
          return of({
            success: sessionInfo.success,
            errorCodes: sessionInfo.errorCodes,
            errorMessages: sessionInfo.errorMessages
          });
          return this.login(endpoint, username, password);
        }
      }),
      catchError((err) => this.login(endpoint, username, password))
    );
  }

  public login(endpoint: string, username: string, password: string): Observable<DwResponse.LoginResponse> {
    this.apiService.setEndpoint(endpoint);
    return this.apiService.login(endpoint, username, password).pipe(
      tap((login) => {
        this.setLoginStatus(login.success);
        if (login.success) {
          this.cookieService.set('sessionId', login.sessionId, (new Date).getHours() + 1, null, null, false, 'Strict');
          this.cookieService.set('roles', login.roles[0], (new Date).getHours() + 1, null, null, false, 'Strict');
        }
        return login;
      })
    );
  }

  public logout(): Observable<DwResponse.LogoutResponse> {
    return this.apiService.logout().pipe(
      tap((response) => {
        if (response.success) {
          this.setLoginStatus(false);
        }
      })
    );
  }

}
