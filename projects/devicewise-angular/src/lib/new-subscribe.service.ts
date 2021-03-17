import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DevicewiseAuthService } from './devicewise-auth.service';
import { Observable, of } from 'rxjs';
import { DwVariable } from './models/dwcommon';

const httpOptions = {
  headers: new HttpHeaders({}),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class NewSubscribeService {

  constructor(
    private http: HttpClient,
    private authService: DevicewiseAuthService
  ) {
  }

  public multiSubscribe(requestVariables: DwVariable[]): Observable<HttpEvent<any>> {
    return this.http.post(this.authService.url + '/api', {
      command: 'multisubscribe.v2',
      params: {
        minimal: true,
        subscriptions: {
          variable: requestVariables
        }
      }
    }, {
      responseType: 'text',
      reportProgress: true,
      observe: 'events',
      withCredentials: true
    })
  }
}
