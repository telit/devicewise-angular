import { finalize, share, multicast, refCount, publish, tap, findIndex } from 'rxjs/operators';
import { Observable, Subscription, Subject, ReplaySubject, Observer } from 'rxjs';
import { Variable, DevicewiseMultisubscribeNewService, MultiSubscribeResponse, MultiSubscribeParams } from './devicewise-multisubscribe-new.service';
import { DevicewiseApiService } from './devicewise-api.service';
import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DevicewiseMultisubscribeStoreService implements OnDestroy {
  public url = '';
  requestVariables: Variable[] = [];
  subject: ReplaySubject<MultiSubscribeParams> = new ReplaySubject<MultiSubscribeParams>(1);
  multiSubscribe$: Observable<MultiSubscribeParams>;
  subscription: Subscription;
  status = 0;

  constructor(private devicewiseMultisubscribeService: DevicewiseMultisubscribeNewService, private apiService: DevicewiseApiService) {
    this.apiService.getEndpointasObservable().subscribe((url) => {
      this.url = url;
    });
  }

  getRequestVariables(): Variable[] {
    return this.requestVariables;
  }

  addRequestVariables(variables: Variable[]) {
    this.requestVariables = this.requestVariables.concat(variables);
    this.restartMultisubscribe();
  }

  removeRequestVariables(variables: Variable[]) {
    variables.forEach((variable, index) => {
      const foundIndex = this.requestVariables.findIndex(
        (requestVariable) => {
          return requestVariable.device === variable.device && requestVariable.variable === variable.variable;
        }
      );
      this.requestVariables.splice(foundIndex, 1);
    });
    this.restartMultisubscribe();
  }

  clearRequestVariables(variables: Variable[]) {
    this.requestVariables = [];
    this.stopMultisubscribe();
  }

  restartMultisubscribe() {
    this.stopMultisubscribe();
    this.subscription = this.startMultisubscribe().subscribe((data) => {
      this.subject.next(data);
    });
  }

  startMultisubscribe(): Observable<MultiSubscribeParams> {
    return this.devicewiseMultisubscribeService.multiSubscribe(this.requestVariables).pipe(
      tap((data) => this.subject.next(data))
    );
  }

  stopMultisubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getMultiSubscribeStatus() {
    return this.status;
  }

  ngOnDestroy(): void {
    if (this.subject) {
      this.subject.complete();
      this.subject.unsubscribe();
    }
    this.stopMultisubscribe();
  }

  subscriptionAsObservable() {
    return this.subject.asObservable().pipe(
      share(),
      finalize(() => {
        console.log('finalize');
        this.stopMultisubscribe();
      })
    );
  }
}
