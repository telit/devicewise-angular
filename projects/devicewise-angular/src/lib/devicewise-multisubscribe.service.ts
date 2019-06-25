import { Injectable, Pipe } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import fetchStream from 'fetch-readablestream';
import { DevicewiseApiService } from './devicewise-api.service';
import * as DwResponse from './models/dwresponse';
import * as DwSubscription from './models/dwsubscription';

const httpOptions = {
  headers: new HttpHeaders({}),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})

export class DevicewiseMultisubscribeService {
  private activeSubscriptions: { [key: string]: Subject<DwResponse.Subscription> } = {};
  private notificationsController;
  private url = location.origin;

  constructor(private api: DevicewiseApiService) {
  }

  setEndpoint(endpoint: string): void {
    this.url = endpoint;
  }

  getSubscription(variable: DwSubscription.Subscription): Observable<DwResponse.Subscribe> {
    const newSubscription: Subject<DwResponse.Subscription> = new Subject();
    variable.subscription = newSubscription.asObservable();

    return this.api.subscribe(
      variable.request.params.device,
      variable.request.params.variable,
      1,
      variable.request.params.type,
      variable.request.params.count,
      variable.request.params.length
    ).pipe(
      tap((response) => {
        variable.response = response;
        if (response.success) {
          this.activeSubscriptions[response.params.id] = newSubscription;

          this.api.read(
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
          this.api.logout().subscribe();
        }
      }
      )
    );
  }

  unsubscribeAll(): Observable<DwResponse.UnsubscribeAll> {
    return this.api.unsubscribeAll();
  }

  unsubscribe(id: number): Observable<DwResponse.Unsubscribe> {
    return this.api.unsubscribe(id);
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
            this.api.logout();
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

}
