import { Injectable } from '@angular/core';
import fetchStream from 'fetch-readablestream';
import { Observable, of, throwError } from 'rxjs';
import { concatAll, map, retryWhen, share, switchMap, tap } from 'rxjs/operators';
import { DevicewiseApiService } from './devicewise-api.service';
import { DwVariable } from './models/dwcommon';

export interface MultiSubscribeResponse {
  success: boolean;
  params: MultiSubscribeResponseParams;
  errorCodes?: number[];
  errorMessages?: string[];
}

export interface MultiSubscribeResponseParams {
  device: string;
  variable: string;
  status:string;
  data: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DevicewiseMultisubscribeService {
  public multiSubscribeShared: Observable<MultiSubscribeResponseParams>;
  private url = '';

  constructor(private apiService: DevicewiseApiService) {
    this.apiService.getEndpointasObservable().subscribe((url) => this.url = url);
  }

  /**
   * Subscribe to multiple `requestVariables`. emits inital value and then on change of value.
   * Observable, and emits the resulting values as an Observable.
   *
   * ## Example
   * Subscribe to a variable 'OEE' from device 'Machine1' and then unsubscribe a second later.
   * ```ts
   * import { DevicewiseMultisubscribeNewService } from './devicewise-multisubscribe-new.service';
   * import { DwSubscription } from './models/dwsubscription';
   * import { DwType } from './models/dwcommon';
   *
   * const variables = [{ device: 'System Monitor', variable: 'CPU.CPU Usage', type: DwType.INT4, count: 1, length: -1 }];
   * const multiSubscribe$ = service.multiSubscribe(variables);
   * const subscription = multiSubscribe$.subscribe({
   *   next: (data) => console.log('next', data),
   *   error: (err) => console.log('error', err),
   *   complete: () => console.log('complete')
   * });
   *
   * setTimeout(() => {
   *   subscription.unsubscribe();
   * }, 1000);
   * ```
   *
   * @param requestVariables requestVariables Variables to subscribe to.
   * @method map
   * @owner Observable
   */
  public multiSubscribe(requestVariables: DwVariable[]): Observable<MultiSubscribeResponseParams> {
    let buffer = '';
    let buffer8: Uint8Array = new Uint8Array();
    let lastCharactersToReadNumber = 0;

    return this.fetchObservable(this.url + '/api', {
      method: 'POST',
      body: JSON.stringify({
        command: 'multisubscribe.v2',
        params: {
          minimal: true,
          subscriptions: {
            variable: requestVariables
          }
        }
      }),
      credentials: 'include'
    }).pipe(
      tap(({ data, sdata }) => {
        buffer += sdata;
        buffer8 = this.concatUint8Arrays(buffer8, data);
      }),
      map(() => {
        const objs: MultiSubscribeResponse[] = [];
        while (buffer.length > 0) {
          let obj: MultiSubscribeResponse;
          let bytesToRead = 0;
          let charactersToRead = 0;
          let bytesToReadStringLength = 0;

          if (isNaN((bytesToRead = parseInt(buffer, 10)))) {
            bytesToRead = lastCharactersToReadNumber;
            bytesToReadStringLength = 0;
          } else {
            lastCharactersToReadNumber = bytesToRead;
            bytesToReadStringLength = bytesToRead.toString().length;
          }

          const subBuffer8 = buffer8.subarray(bytesToReadStringLength, bytesToReadStringLength + bytesToRead);
          const subString = new TextDecoder('utf-8').decode(subBuffer8);
          charactersToRead = subString.length;

          try {
            obj = JSON.parse(subString);
          } catch {
            buffer = buffer.substring(bytesToReadStringLength);
            buffer8 = buffer8.subarray(bytesToReadStringLength);
            break;
          }

          if (obj.success === true) {
            objs.push(obj);
          } else {
            buffer = buffer.substring(bytesToReadStringLength + charactersToRead);
            buffer8 = buffer8.subarray(bytesToReadStringLength + bytesToRead);
            throw obj;
          }

          buffer = buffer.substring(bytesToReadStringLength + charactersToRead);
          buffer8 = buffer8.subarray(bytesToReadStringLength + bytesToRead);
        }

        return objs;
      }),
      concatAll(),
      retryWhen((errors) => errors.pipe(
        switchMap((sourceErr) => {
          if (sourceErr.success === false && (sourceErr.errorCodes[0] === -7002)) {
            return of(true);
          } else {
            return throwError(sourceErr);
          }
        })
      )),
      map((data) => data.params),
      share()
    );
  }

  private fetchObservable(input: RequestInfo, init?: RequestInit): Observable<{ data: Uint8Array, sdata: string }> {
    let abortController = new AbortController();

    return new Observable((observer) => {
      abortController = new AbortController();
      fetchStream(
        input,
        { signal: abortController.signal, ...init }
      ).then(response => {
        const reader = response.body.getReader();
        function pump() {
          return reader.read().then(({ value, done }) => {
            const data: Uint8Array = value;
            if (done) {
              return;
            }

            const sdata: string = new TextDecoder('utf-8').decode(data);
            observer.next({ data, sdata });

            return pump();
          }).catch((err) => {
            if (err.code !== 20) { } // Ignore
            else {console.log('Multisubscribe Error', err);}
            observer.error(err);
          });
        }
        pump();
      }).catch((err) => {
        if (err.code !== 20) { } // Ignore
        else {console.log('Multisubscribe Error2', err);}
        observer.error(err);
      });

      return () => {
        abortController.abort();
        observer.complete();
      };
    });
  }

  private concatUint8Arrays(a: Uint8Array, b: Uint8Array) { // a, b TypedArray of same type
    const c: Uint8Array = new Uint8Array(a.length + b.length);
    c.set(a, 0);
    c.set(b, a.length);
    return c;
  }

}
