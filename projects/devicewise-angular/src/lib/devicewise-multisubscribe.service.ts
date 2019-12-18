import { Injectable } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs';
import fetchStream from 'fetch-readablestream';
import * as Dwresponse from './models/dwresponse';
import * as Dwrequest from './models/dwrequest';
import { DwSubscription } from './models/dwsubscription';

@Injectable({
  providedIn: 'root'
})

export class DevicewiseMultisubscribeService {
  private activeSubscriptions: { [key: string]: Subject<Dwresponse.Subscription> } = {};
  private abortControllers: AbortController[] = [];
  private variables: DwSubscription[] = [];
  private permanentVariables: DwSubscription[] = [];
  private permanentSubscriptions: Subject<Dwresponse.Subscription>[] = [];
  private activeReplaySubjects: ReplaySubject<Dwresponse.Subscription>[] = [];
  private url = 'http://localhost:88';

  constructor() {
  }

  setEndpoint(endpoint: string): void {
    this.url = endpoint;
    console.log('multisub endpoint:', this.url);
  }

  dwVariableArrayToMultiSubRequest(variables: DwSubscription[]): Dwrequest.DwmultisubscribeRequestVariableSubscription[] {
    const multiSubArray: Dwrequest.DwmultisubscribeRequestVariableSubscription[] = [];
    variables.forEach((variable, index) => {
      multiSubArray.push({
        device: variable.request.params.device,
        variable: variable.request.params.variable,
        type: variable.request.params.type,
        count: variable.request.params.count,
        length: variable.request.params.length
      });
    });
    return multiSubArray;
  }

  addPermenantVariables(variables: DwSubscription[]) {
    let exist = false;
    variables.forEach((variable) => {
      exist = false;
      // const dwName = variable.request.params.device + '.' + variable.request.params.variable;
      const newSubscription: ReplaySubject<Dwresponse.Subscription> = new ReplaySubject<Dwresponse.Subscription>();
      this.permanentVariables.forEach((existingVariable) => {
        if (existingVariable.request.params.variable === variable.request.params.variable) {
          exist = true;
        }
      });
      if (!exist) {
        variable.subscription = newSubscription.asObservable();
        this.permanentSubscriptions.push(newSubscription);
        this.permanentVariables.push(variable);
      }
    });
  }

  initMultiSubscribe(variables: DwSubscription[]) {
    let newPermanentVariable = false;
    this.activeReplaySubjects.forEach((variable) => {
      variable.complete();
    });
    this.activeReplaySubjects = [];
    this.variables = [];

    if (!variables) variables = [];

    variables.forEach((variable) => {
      const dwVariableName = variable.request.params.device + '.' + variable.request.params.variable;
      const newSubscription: ReplaySubject<Dwresponse.Subscription> = new ReplaySubject<Dwresponse.Subscription>();
      variable.subscription = newSubscription.asObservable();
      this.activeReplaySubjects.push(newSubscription);
      this.activeSubscriptions[dwVariableName] = newSubscription;
    });

    this.permanentVariables.forEach((variable, index) => {
      const dwVariableName = variable.request.params.device + '.' + variable.request.params.variable;
      if (!this.activeSubscriptions[dwVariableName]) {
        newPermanentVariable = true;
        this.activeSubscriptions[dwVariableName] = this.permanentSubscriptions[index];
      }
    });
    this.variables = this.variables.concat(this.permanentVariables, variables);

    return this.multiSubscribe(this.variables);
  }

  multiSubscribe(variables: DwSubscription[]) {
    const abortController = new AbortController();
    if (this.abortControllers.length) {
      this.abortAllNotifications();
    }
    this.abortControllers.push(abortController);

    const requestVariables = this.dwVariableArrayToMultiSubRequest(this.variables);
    // console.log(requestVariables, this.permanentVariables, this.variables);

    fetchStream(this.url + '/api', {
      signal: abortController.signal,
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
    }).then((response) => {
      const reader = response.body.getReader();
      const chunks = '';
      this.pump(reader, chunks);
    }).catch((error) => {
      console.warn('Abort Controller!', error);
      setTimeout(() => {
        console.log('reader error multisub');
        this.multiSubscribe(this.variables);
      }, 1000);
    });
  }

  pump(reader, chunks) {
    let charactersToRead = 0;
    let lengthOfCharactersToRead = 0;
    let oldcharactersToRead = charactersToRead;

    while (chunks.length > 0) {
      oldcharactersToRead = charactersToRead;
      if (isNaN((charactersToRead = parseInt(chunks, 10)))) {
        console.warn('pump(): parseInt failure when reading length.', chunks);
        charactersToRead = oldcharactersToRead;
        lengthOfCharactersToRead = 0;
        break;
      } else {
        lengthOfCharactersToRead = charactersToRead.toString().length;
      }

      try {
        const subString = chunks.substring(lengthOfCharactersToRead, charactersToRead + lengthOfCharactersToRead);
        const subObj = JSON.parse(subString);
        if (subObj.success === false) {
          console.warn('pump(): Aborting and getting notifications again.', subObj, chunks);
          setTimeout(() => {
            console.log('sub object timed out multisub');
            this.multiSubscribe(this.variables);
          });
          return;
        } else {
          const activeSubscription = this.activeSubscriptions[subObj.params.device + '.' + subObj.params.variable];
          if (activeSubscription) {
            activeSubscription.next(subObj);
          } else {
            console.log('Missing active subscription', subObj);
          }
        }
        const readLength = charactersToRead + charactersToRead.toString().length;
        chunks = chunks.substr(readLength);
      } catch {
        break;
      }
    }

    if (chunks.length >= 65536) {
      console.log('Chunk too long! Resetting Chunk. You may be receving data faster than the system can process it. Aborting the stream. The data was lost.');
      chunks = chunks.substring(0, 65536);
    }

    reader.read().then(({ value, done }) => {
      if (done) {
        return;
      }
      chunks = chunks.concat(new TextDecoder('utf-8').decode(value));
      return this.pump(reader, chunks);
    }).catch(error => {
      if (error.name === 'TypeError') {
        console.log('MultiSubscribe Reader: There was a network error.');
        setTimeout(() => {
          console.log('Attempting to resubscribe...');
          this.multiSubscribe(this.variables);
        }, 3333);
      }
    });
  }

  abortAllNotifications() {
    if (!this.abortControllers.length) {
      return;
    }
    this.abortControllers.forEach((abortController) => {
      abortController.abort();
    });
    this.abortControllers = [];
  }
}
