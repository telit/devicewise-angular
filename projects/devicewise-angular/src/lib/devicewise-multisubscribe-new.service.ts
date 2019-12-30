import { map, finalize, tap, share, takeWhile, expand, take, concatAll, flatMap, concatMap } from 'rxjs/operators';
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

  public multiSubscribe(requestVariables: Variable[]): Observable<MultiSubscribeParams> {
    let buffer = '';
    let lastCharactersToReadNumber = 0;

    const fetchObservable$ = this.fetchObservable(this.url + '/api', {
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
      // tap((data) => console.log('data1', data)),
      tap((data) => buffer += data),
      map((data) => {
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

          if (obj.success === false) {
            throwError(obj.errorMessages[0]);
            continue;
          }

          objs.push(obj);
          buffer = buffer.substring(charactersToReadStringLength + charactersToReadNumber);
        }

        return objs;
      }),
      // tap((data) => console.log('data2', data)),
      concatAll(),
      map((data) => data.params),
      // tap((data) => console.log('emitting multiSubscribe', data)),
      share(),
      // tap((data) => console.log('subscriber got data', data)),
    );

    return fetchObservable$;
  }

  private fetchObservable(input: RequestInfo, init?: RequestInit): Observable<string> {
    const abortController = new AbortController();

    return new Observable((observer) => {
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
              }).catch((err) => observer.error(err));
            }
            push();
          }
        });
      }).catch((err) => observer.error(err));

      return () => {
        abortController.abort();
        observer.complete();
      };
    });
  }

}
