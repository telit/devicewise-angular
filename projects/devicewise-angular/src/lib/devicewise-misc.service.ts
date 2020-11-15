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
      errorString = `Unknown Error`;
      if (e) {
        errorString += ` ${JSON.stringify(e)}`;
      }
    }
    return new Error(errorString);
  }

}
