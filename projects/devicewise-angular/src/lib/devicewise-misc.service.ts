import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DevicewiseMiscService {

  constructor() { }

  public dwHandleError(e): Error {
    let errorString = '';
    if (e && e.errorMessages) {
      e.errorMessages.forEach((errorMessage, i) => {
        errorString += `${e.errorMessages[i]} `;
        if (e.errorCodes[i]) {
          errorString += `(${e.errorCodes[0]})`;
        }
      });
    }
    if (!errorString) {
      if (e instanceof Error) {
        errorString += e.toString();
        errorString = errorString.replace('TypeError: ', '');
      } else if (typeof e === 'object') {
        errorString += JSON.stringify(e);
      } else if (typeof e === 'string') {
        errorString += e;
      }
    }
    return new Error(errorString);
  }

}
