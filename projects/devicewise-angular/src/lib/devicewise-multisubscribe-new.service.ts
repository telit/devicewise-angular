import { map, finalize, tap } from 'rxjs/operators';
import { Observable, throwError, observable } from 'rxjs';
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

  constructor(private apiService: DevicewiseApiService) {
    this.apiService.getEndpointasObservable().subscribe((url) => this.url = url);
  }

  public multiSubscribe(requestVariables: Variable[]): Observable<MultiSubscribeParams> {
    return this._multiSubscribe(requestVariables).pipe(
      // tap((multiSubscribeRespone) => {
      //   if (!multiSubscribeRespone.success) {
      //     throw new Error('Multisubscribe failed.');
      //   }
      // }),
      map((multiSubscribeResponse) => multiSubscribeResponse.params)
    );
  }

  private _multiSubscribe(requestVariables: Variable[]): Observable<MultiSubscribeResponse> {
    let buffer = '';
    let lastCharactersToReadNumber = 0;

    return new Observable<MultiSubscribeResponse>((observer) => {
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
      }).subscribe((data) => {
        buffer += data;

        // While buffer contains data
        while (buffer.length > 0) {
          let obj: MultiSubscribeResponse;
          let charactersToReadNumber = 0;
          let lengthCharactersToReadNumber = 0;
          // Is there an integer that can be parsed?
          if (isNaN((charactersToReadNumber = parseInt(buffer, 10)))) {
            // No, use last found number
            charactersToReadNumber = 0;
            lengthCharactersToReadNumber = lastCharactersToReadNumber;
          } else {
            // Yes, parse it.
            lastCharactersToReadNumber = charactersToReadNumber;
            lengthCharactersToReadNumber = charactersToReadNumber.toString().length;
          }

          // Create substring from
          const subString = buffer.substring(lengthCharactersToReadNumber, lengthCharactersToReadNumber + charactersToReadNumber);
          // Is there a string that can be parsed to JSON?
          try {
            // Yes, parse it.
            obj = JSON.parse(subString);
          } catch {
            // No, save number, strip off number, and exit.
            buffer = buffer.substring(lengthCharactersToReadNumber);
            break;
          }

          // If the response is not successful throw an error.
          if (obj.success === false) {
            observer.error(obj);
            return;
          }
          // Notify observer.
          observer.next(obj);
          // Strip off number and parsed JSON string.
          buffer = buffer.substring(lengthCharactersToReadNumber + charactersToReadNumber);
        }

      });

      return () => {
        fetchObservable$.unsubscribe();
      };
    });
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
