import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject, ReplaySubject, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import fetchStream from 'fetch-readablestream';
import * as DwResponse from './models/dwresponse';
import * as DwRequest from './models/dwrequest';
import * as DwSubscription from './models/dwsubscription';

const httpOptions = {
  headers: new HttpHeaders({}),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class DevicewiseAngularService {
  private url = location.origin;
  private loggedIn = false;
  private activeSubscriptions: { [key: string]: Subject<DwResponse.Subscription> } = {};
  private notificationsController;
  private messageCount = 0;

  constructor(private cookieService: CookieService, private http: HttpClient) {
    console.log('IT WORKS AUSTEN!');
  }

  setEndpoint(endpoint: string): void {
    this.url = endpoint;
  }

  getEndpoint(): string {
    return this.url;
  }

  setLoginStatus(status: boolean) {
    this.loggedIn = status;
  }

  getLoginStatus(): boolean {
    return this.loggedIn;
  }

  login(endpoint: string, username: string, password: string): Observable<DwResponse.Login> {
    this.url = endpoint;
    return this.http
      .post<DwResponse.Login>(this.url + '/api/login', {
        auth: {
          username: username,
          password: password
        }
      });
  }

  easyLogin(endpoint: string, username: string, password: string): Observable<DwResponse.Login> {
    const loginSubject: Subject<DwResponse.Login> = new Subject();

    this.ping('localhost', 4).subscribe((ping) => {
      if (!ping.success) {
        this.login(endpoint, username, password).subscribe((login) => {
          loginSubject.next(login);
          loginSubject.complete();
          if (!login.success) {
            return;
          }
          this.setLoginStatus(true);
          this.cookieService.deleteAll();
          this.cookieService.set('sessionId', login.sessionId);
          this.unsubscribeAll();
        }, (error) => {
          loginSubject.next({
            success: false,
            sessionId: '',
            roles: [''], // TODO
            requirePasswordChange: false
          });
        });
      } else {
        this.setLoginStatus(true);
        this.unsubscribeAll();
        loginSubject.next({
          success: true,
          sessionId: this.cookieService.get('sessionId'),
          roles: [''], // TODO
          requirePasswordChange: false
        });
      }
    }, (error) => {
      this.login(endpoint, username, password).subscribe((login) => {
        loginSubject.next(login);
        loginSubject.complete();
        if (!login.success) {
          return;
        }
        this.setLoginStatus(true);
        this.cookieService.deleteAll();
        this.cookieService.set('sessionId', login.sessionId);
        this.unsubscribeAll();
      }, (error2) => {
        loginSubject.next({
          success: false,
          sessionId: '',
          roles: [''], // TODO
          requirePasswordChange: false
        });
      });
    });

    return loginSubject.asObservable();
  }

  logout(): Observable<DwResponse.Logout> {
    return this.http.post<DwResponse.Logout>(this.url + '/api/logout', null, httpOptions).pipe(
      tap(response => {
        if (response.success) {
          this.cookieService.delete('sessionId');
        }
      })
    );
  }

  read(device: string, variable: string, type: number, count: number, length: number): Observable<DwResponse.Read> {
    return this.http.post<DwResponse.Read>(
      this.url + '/api',
      {
        command: 'variable.read',
        params: {
          device: device,
          variable: variable,
          type: type,
          count: count,
          length: length
        }
      },
      httpOptions
    );
  }

  write(device: string, variable: string, type: number, count: number, length: number, data: any): Observable<DwResponse.Write> {
    return this.http.post<DwResponse.Write>(
      this.url + '/api',
      {
        command: 'variable.write',
        params: {
          device: device,
          variable: variable,
          type: type,
          count: count,
          length: length,
          data: data
        }
      },
      httpOptions
    );
  }

  // Variables

  subscribe(
    device: string,
    variable: string,
    rate: number,
    type: number,
    count: number,
    length: number
  ): Observable<DwResponse.Subscribe> {
    return this.http.post<DwResponse.Subscribe>(
      this.url + '/api',
      {
        command: 'variable.subscribe',
        params: {
          device: device,
          variable: variable,
          type: type,
          count: count,
          length: length
        }
      },
      httpOptions
    );
  }

  unsubscribe(id: number): Observable<DwResponse.Unsubscribe> {
    return this.http.post<DwResponse.Unsubscribe>(
      this.url + '/api',
      {
        command: 'variable.unsubscribe',
        params: { id: id }
      },
      httpOptions
    );
  }

  unsubscribeAll(): Observable<DwResponse.UnsubscribeAll> {
    return this.http.post<DwResponse.UnsubscribeAll>(
      this.url + '/api',
      {
        command: 'variable.unsubscribe.all'
      },
      httpOptions
    );
  }

  notificationGet(): Observable<any> {
    return this.http.post(
      this.url + '/api',
      {
        command: 'notification.get'
      },
      httpOptions
    );
  }

  notificationCount(): Observable<DwResponse.NotificationCount> {
    return this.http.post<DwResponse.NotificationCount>(
      this.url + '/api',
      {
        command: 'notification.count'
      },
      httpOptions
    );
  }

  getSubscription(variable: DwSubscription.Subscription): Observable<DwResponse.Subscribe> {
    const newSubscription: Subject<DwResponse.Subscription> = new Subject();
    variable.subscription = newSubscription.asObservable();

    return this.http.post<DwResponse.Subscribe>(this.url + '/api', variable.request, httpOptions).pipe(
      tap((response) => {
          variable.response = response;
          if (response.success) {
            this.activeSubscriptions[response.params.id] = newSubscription;

            this.read(
              variable.request.params.device,
              variable.request.params.variable,
              variable.request.params.type,
              variable.request.params.count,
              variable.request.params.length
            ).subscribe(readResponse => {
              if (readResponse.success) {
                newSubscription.next({
                  success: true,
                  params: {
                    variable: readResponse.params.variable,
                    length: readResponse.params.length,
                    count: readResponse.params.count,
                    status: readResponse.params.status,
                    type: readResponse.params.type,
                    data: readResponse.params.data,
                    id: response.params.id
                  }
                });
              }
            });
          } else {
            if (response.errorCodes[0] === -6428) {
              console.warn('DeviceWISE subscription error. Subscription Already Exists.');
            } else {
              console.warn('Variable name: ' + variable.request.params.variable);
              console.warn(response);
            }
          }
        }, (error) => {
          console.log('subError', error);
          if (error.status === 401) {
            this.logout().subscribe();
          }
        }
      )
    );
  }

  getNotifications() {
    this.notificationsController = new AbortController();

    console.log('Getting notifications...');
    fetchStream(this.url + '/api', {
      signal: this.notificationsController.signal,
      method: 'POST',
      body: JSON.stringify({
        command: 'notification.get'
      }),
      credentials: 'include'
    })
      .then(response => {
        const reader = response.body.getReader();
        const chunks = '';
        this.pump(reader, chunks);
      })
      .catch(error => {
        console.log('FETCH STREAM ERROR');
      });
  }

  pump(reader, chunks) {
    let toRead = 0;
    let length = 0;
    let subString;
    let subObj;
    const oldcharactersToRead = toRead;

    reader.read().then(({ value, done }) => {
      chunks = chunks.concat(new TextDecoder('utf-8').decode(value));
      if (done) {
        return;
      }
      return this.pump(reader, chunks);
    });

    while (chunks.length > 10) {
      if (isNaN((toRead = parseInt(chunks, 10)))) {
        console.warn('Pump parseInt failure when reading chunk length.');
        toRead = oldcharactersToRead;
        length = 0;
      } else {
        length = toRead.toString().length;
      }

      subString = chunks.substring(length, toRead + length);
      try {
        subObj = JSON.parse(subString);
        if (subObj.success === false) {
          this.abortNotifications();
          console.warn('DeviceWISE subscription error. Abort notifications', subObj);
          if (subObj.errorCodes[0] === -1451) {
            this.logout();
          } else {
            this.getNotifications();
          }
          return;
        } else {
          if (this.activeSubscriptions[subObj.params.id]) {
            this.activeSubscriptions[subObj.params.id].next(subObj);
            const readLength = toRead + toRead.toString().length;
            chunks = chunks.substr(readLength);
          }
        }
      } catch {
        console.log('failed to parse', subString);
      }
      if (chunks.length >= 65536) {
        console.warn('Chunk too long! Resetting Chunk.');
        chunks = '';
        this.abortNotifications();
        this.getNotifications();
        return;
      }
    }
  }

  abortNotifications() {
    if (this.notificationsController) {
      this.notificationsController.abort();
    }
  }

  // Device

deviceList(): Observable<DwResponse.DeviceList> {
  return this.http.post<DwResponse.DeviceList>(this.url + '/api', { command: 'device.list' }, httpOptions);
}

  deviceInfo(device: string, options: number): Observable<DwResponse.DeviceInfo> {
    return this.http.post<DwResponse.DeviceInfo>(
      this.url + '/api',
      { command: 'device.info', params: { name: device, opts: options } },
      httpOptions
    );
  }

  deviceTypeList(): Observable<DwResponse.DeviceDataType> {
    return this.http.post<DwResponse.DeviceDataType>(this.url + '/api', { command: 'devicetype.enum' }, httpOptions);
  }

  deviceStart(device: string): Observable<DwResponse.DeviceStart> {
    return this.http.post<DwResponse.DeviceStart>(
      this.url + '/api',
      { command: 'device.start', params: { name: device } },
      httpOptions
    );
  }

  deviceStop(device: string): Observable<DwResponse.DeviceStop> {
    return this.http.post<DwResponse.DeviceStop>(
      this.url + '/api',
      { command: 'device.stop', params: { name: device } },
      httpOptions
    );
  }

  // Trigger

  triggerList(project: string): Observable<DwResponse.TriggerList> {
    return this.http.post<DwResponse.TriggerList>(
      this.url + '/api',
      { command: 'trigger.list', params: { project: project } },
      httpOptions
    );
  }

  triggerStart(project: string, trigger: string): Observable<DwResponse.TriggerStart> {
    return this.http.post<DwResponse.TriggerStart>(
      this.url + '/api',
      { command: 'trigger.start', params: { name: trigger, project: project } },
      httpOptions
    );
  }

  triggerFire(project: string, trigger: string): Observable<DwResponse.TriggerFire> {
    return this.http.post<DwResponse.TriggerFire>(
      this.url + '/api',
      { command: 'trigger.fire', params: { name: trigger, project: project } },
      httpOptions
    );
  }

  triggerStop(project: string, trigger: string): Observable<DwResponse.TriggerStop> {
    return this.http.post<DwResponse.TriggerStop>(
      this.url + '/api',
      { command: 'trigger.stop', params: { name: trigger, project: project } },
      httpOptions
    );
  }

  subTriggerFire(project: string, trigger: string, reporting: boolean, input: any[]): Observable<DwResponse.SubTriggerFire> {
    return this.http.post<DwResponse.SubTriggerFire>(
      this.url + '/api',
      { command: 'subtrigger.fire', params: { name: trigger, project: project, reportingEnabled: reporting, input: input } },
      httpOptions
    );
  }

  // Project

  projectList(): Observable<DwResponse.ProjectList> {
    return this.http.post<DwResponse.ProjectList>(this.url + '/api', { command: 'project.list' }, httpOptions);
  }

  projectStart(name): Observable<DwResponse.ProjectStart> {
    return this.http.post<DwResponse.ProjectStart>(
      this.url + '/api',
      { command: 'project.start', params: { name: name } },
      httpOptions
    );
  }

  projectStop(name): Observable<DwResponse.ProjectStop> {
    return this.http.post<DwResponse.ProjectStop>(
      this.url + '/api',
      { command: 'project.stop', params: { name: name } },
      httpOptions
    );
  }

  // Channel

  // TODO
  channelSubscribe(channel: string): Observable<DwResponse.ChannelSubscribe> {
    return this.http.post<DwResponse.ChannelSubscribe>(
      this.url + '/api',
      {
        command: 'channel.subscribe',
        params: {
          channel: channel
        }
      },
      httpOptions
    );
  }

  channelUnsubscribe(id: string): Observable<DwResponse.ChannelUnsubscribe> {
    return this.http.post<DwResponse.ChannelUnsubscribe>(
      this.url + '/api',
      {
        command: 'channel.unsubscribe',
        params: { id: id }
      },
      httpOptions
    );
  }

  channelUnsubscribeAll(): Observable<DwResponse.ChannelUnsubscribeAll> {
    return this.http.post<DwResponse.ChannelUnsubscribeAll>(
      this.url + '/api',
      {
        command: 'channel.unsubscribe.all'
      },
      httpOptions
    );
  }

  // SQLite

  sql(query): Observable<DwResponse.Sql> {
    return this.http.post<DwResponse.Sql>(
      this.url + '/api',
      {
        command: 'sqlite.execute',
        params: { query: query }
      },
      httpOptions
    );
  }

  // System

  referenceList(type: string, key: string, flag: string): Observable<DwResponse.ReferenceList> {
    return this.http.post<DwResponse.ReferenceList>(
      this.url + '/api',
      {
        command: 'reference.list',
        params: { type: type, key: key, flag: flag }
      },
      httpOptions
    );
  }

  // Diagnostics

  ping(address: string, count: number): Observable<DwResponse.Ping> {
    return this.http.post<DwResponse.Ping>(
      this.url + '/api',
      {
        command: 'network.ping',
        params: {
          address: address,
          count: count
        }
      },
      httpOptions
    );
  }
}
