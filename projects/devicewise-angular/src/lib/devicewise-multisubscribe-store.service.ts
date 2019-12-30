import { finalize } from 'rxjs/operators';
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
  observer: Observer<any>;

  constructor(private devicewiseMultisubscribeService: DevicewiseMultisubscribeNewService, private apiService: DevicewiseApiService) {
    this.apiService.getEndpointasObservable().subscribe((url) => this.url = url);
  }

  getRequestVariables(): Variable[] {
    return this.requestVariables;
  }

  addRequestVariables(variables: Variable[]) {
    this.requestVariables = this.requestVariables.concat(variables);
    this.restartMultisubscribe();
  }

  removeRequestVariables(variables: Variable[]) {
    variables.forEach((variable) => {
      this.requestVariables = this.requestVariables.filter(
        (requestVariable) => requestVariable.device !== variable.device && requestVariable.variable !== variable.variable
      );
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
      console.log('data', data);
      this.subject.next(data);
    });
  }

  startMultisubscribe(): Observable<MultiSubscribeParams> {
    return this.devicewiseMultisubscribeService.multiSubscribe(this.requestVariables);
  }

  stopMultisubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
      finalize(() => this.stopMultisubscribe())
    );
  }
}
