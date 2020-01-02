import { finalize, share, multicast, refCount, publish, tap, findIndex, take } from 'rxjs/operators';
import { Observable, Subscription, Subject, ReplaySubject, Observer } from 'rxjs';
import {
  Variable,
  DevicewiseMultisubscribeService,
  MultiSubscribeParams } from './devicewise-multisubscribe.service';
import { DevicewiseApiService } from './devicewise-api.service';
import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DevicewiseMultisubscribeStoreService implements OnDestroy {
  public url = '';
  requestVariables: Variable[] = [];
  subject: ReplaySubject<MultiSubscribeParams> = new ReplaySubject<MultiSubscribeParams>(1);
  subscription: Subscription;
  status = 0;

  constructor(private devicewiseMultisubscribeService: DevicewiseMultisubscribeService, private apiService: DevicewiseApiService) {
    this.apiService.getEndpointasObservable().subscribe((url) => this.url = url);
  }

  public subscriptionAsObservable() {
    if (!this.subscription) {
      this.startMultisubscribe(true);
    }
    return this.subject.asObservable().pipe(
      share(),
      finalize(() => this.stopMultisubscribe())
    );
  }

  public getRequestVariables(): Variable[] {
    return this.requestVariables;
  }

  public addRequestVariables(variables: Variable[]) {
    this.requestVariables = this.requestVariables.concat(variables);
    // const newRequestVariables = this.requestVariables.concat(variables);
    this.startMultisubscribe(false).pipe(take(1)).subscribe(
      null,
      (err) => console.log(err)
    );
  }

  public removeRequestVariables(variables: Variable[]) {
    variables.forEach((variable, index) => {
      const foundIndex = this.requestVariables.findIndex(
        (requestVariable) => {
          return requestVariable.device === variable.device && requestVariable.variable === variable.variable;
        }
      );
      this.requestVariables.splice(foundIndex, 1);
    });
    this.startMultisubscribe(false);
  }

  private clearRequestVariables(variables: Variable[]) {
    this.requestVariables = [];
  }

  private startMultisubscribe(newSubject: boolean) {
    this.stopMultisubscribe();
    const sub = this.devicewiseMultisubscribeService.multiSubscribe(this.requestVariables); //.pipe(tap((x) => console.log('tap', x)));
    if (newSubject === true || this.subject.observers.length > 0) {
      this.subscription = sub.subscribe(this.subject);
    }
    return sub;
  }

  private stopMultisubscribe() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  public getMultiSubscribeStatus() {
    return this.status;
  }

  ngOnDestroy(): void {
    this.stopMultisubscribe();
    if (this.subject) {
      this.subject.complete();
      this.subject.unsubscribe();
    }
  }

}
