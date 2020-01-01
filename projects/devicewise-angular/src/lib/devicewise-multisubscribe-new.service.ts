import { map, tap, share, concatAll, retryWhen, switchMap } from 'rxjs/operators';
import { Observable, throwError, observable, of } from 'rxjs';
import { DevicewiseApiService } from './devicewise-api.service';
import { Injectable } from '@angular/core';

interface FetchData {
  buffer: string;
}

export interface Variable {
  device: string;
  variable: string;
  type: number;
  count: number;
  length: number;
}

export interface MultiSubscribeResponse {
  success: boolean;
  params: MultiSubscribeParams;
  errorCodes?: number[];
  errorMessages?: string[];
}

export interface MultiSubscribeParams {
  device: string;
  variable: string;
  data: number[];
}

@Injectable({
  providedIn: 'root'
})
export class DevicewiseMultisubscribeNewService {
  public url = '';
  public multiSubscribeShared: Observable<MultiSubscribeParams>;

  constructor(private apiService: DevicewiseApiService) {
    this.apiService.getEndpointasObservable().subscribe((url) => this.url = url);
  }

/**
 * Subscribe to multiple `requestVariables`. emits inital value and then on change of value.
 * Observable, and emits the resulting values as an Observable.
 *
 * See [Documentation](https://docs.devicewise.com/Content/home.htm)
 *
 * ## Example
 * Subscribe to a variable 'OEE' from device 'Machine1' and then unsubscribe a second later.
 * ```ts
 * import { DevicewiseMultisubscribeNewService } from './devicewise-multisubscribe-new.service';
 * import { DwSubscription } from './models/dwsubscription';
 * import { DwType } from './models/dwconstants';
 *
 * const variables = [new DwSubscription('Machine1', 'OEE', DwType.INT4, 1, -1).request.params];
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
  public multiSubscribe(requestVariables: Variable[]): Observable<MultiSubscribeParams> {
    let buffer = '';
    let lastCharactersToReadNumber = 0;

    return this.fetchObservable(this.url + '/api', {
      method: 'POST',
      body: JSON.stringify({
        command: 'multisubscribe',
        params: {
          minimal: true,
          subscriptions: {
            variable: requestVariables
          }
        }
      }),
      credentials: 'include'
    }).pipe(
      tap((data) => buffer += data),
      map(() => {
        const objs: MultiSubscribeResponse[] = [];
        while (buffer.length > 0) {
          let obj: MultiSubscribeResponse;
          let charactersToReadNumber = 0;
          let charactersToReadStringLength = 0;

          if (isNaN((charactersToReadNumber = parseInt(buffer, 10)))) {
            charactersToReadNumber = lastCharactersToReadNumber;
            charactersToReadStringLength = 0;
          } else {
            lastCharactersToReadNumber = charactersToReadNumber;
            charactersToReadStringLength = charactersToReadNumber.toString().length;
          }

          const subString = buffer.substring(charactersToReadStringLength, charactersToReadStringLength + charactersToReadNumber);

          try {
            obj = JSON.parse(subString);
          } catch {
            buffer = buffer.substring(charactersToReadStringLength);
            break;
          }

          if (obj.success === true) {
            objs.push(obj);
          } else {
            buffer = buffer.substring(charactersToReadStringLength + charactersToReadNumber);
            throw obj;
          }

          buffer = buffer.substring(charactersToReadStringLength + charactersToReadNumber);
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
      share(),
    );
  }

  private fetchObservable(input: RequestInfo, init?: RequestInit): Observable<string> {
    let abortController = new AbortController();

    return new Observable((observer) => {
      abortController = new AbortController();
      fetch(input, { signal: abortController.signal, ...init }).then((response) => {
        const reader = response.body.getReader();
        const stream = new ReadableStream({
          start(controller: ReadableStreamDefaultController<any>) {
            function push() {
              reader.read().then((result: ReadableStreamReadResult<any>) => {
                if (result.done) {
                  controller.close();
                  return;
                }

                const resultData: string = new TextDecoder('utf-8').decode(result.value);
                observer.next(resultData);

                controller.enqueue(result.value);
                push();
              }).catch((err) => {
                if (err.code !== 20) { } // Ignore
              });
            }
            push();
          }
        });
      }).catch((err) => {
        if (err.code !== 20) {
          observer.error(err);
        }
      });

      return () => {
        abortController.abort();
        observer.complete();
      };
    });
  }

}
