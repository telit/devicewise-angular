import { switchMap } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import {
  Variable,
  DevicewiseMultisubscribeService,
  MultiSubscribeParams
} from './devicewise-multisubscribe.service';
import { DevicewiseApiService } from './devicewise-api.service';
import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DevicewiseMultisubscribeStoreService implements OnDestroy {
  private multiSub$: ReplaySubject<MultiSubscribeParams> = new ReplaySubject<MultiSubscribeParams>(1);
  private mutliSubRequest$: ReplaySubject<Observable<MultiSubscribeParams>> = new ReplaySubject<Observable<MultiSubscribeParams>>(1);
  public url = '';
  public requestVariables: Variable[] = [];

  constructor(private devicewiseMultisubscribeService: DevicewiseMultisubscribeService, private apiService: DevicewiseApiService) {
    this.apiService.getEndpointasObservable().subscribe((url) => {
      this.url = url;
    });
  }

  /**
   * Returns an observable for a multisubscribe store which contains one multisubscribe stream.
   * Emits on change of value.
   *
   * ## Example
   * Subscribe to a variable 'CPU.CPU Usage' from device 'System Monitor' and then unsubscribe a second later.
   * ```ts
   * const variables = [{ device: 'System Monitor', variable: 'CPU.CPU Usage', type: DwType.INT1, count: 1, length: -1}];
   * const subscription = service.subscriptionAsObservable().subscribe((data) => console.log(data));
   *
   * service.addRequestVariables(variables);
   * setTimeout(() => { subscription.unsubscribe(); }, 1000);
   * ```
   *
   * @returns observable of multisubscribe store stream.
   * @method subscriptionAsObservable
   */
  public subscriptionAsObservable(): Observable<MultiSubscribeParams> {
    return this.mutliSubRequest$.pipe(
      switchMap((val) => val)
    );
  }

  /**
   * Get all variables in the multisubscribe store.
   *
   * @return Request variables from multisubscribe store.
   * @method getRequestVariables
   */
  public getRequestVariables(): Variable[] {
    console.log('got request variables', this.requestVariables);
    return this.requestVariables;
  }

  /**
   * Add request variables to multisubscribe store.
   *
   * @param variables requestVariables Variables to add.
   * @method addRequestVariables
   */
  public addRequestVariables(variables: Variable[]) {
    console.log('adding request variables', this.requestVariables);
    variables.forEach((variable) => {
      const foundVar = this.requestVariables.indexOf(variable);
      if (foundVar  === -1) {
        this.requestVariables.push(variable);
      }
    });
    // this.requestVariables = this.requestVariables.concat(variables);
    console.log('added request variables', this.requestVariables);
    this.reSubscribe();
  }

  /**
   * Remove request variables to multisubscribe store.
   *
   * @param requestVariables requestVariables Variables to remove.
   * @method removeRequestVariables
   */
  public removeRequestVariables(variables: Variable[]) {
    console.log('removing request variables', this.requestVariables);
    variables.forEach((variable) => {
      const foundIndex = this.requestVariables.findIndex(
        (requestVariable) => (requestVariable.device === variable.device) && (requestVariable.variable === variable.variable)
      );
      this.requestVariables.splice(foundIndex, 1);
    });
    console.log('removed request variables', this.requestVariables);
    this.reSubscribe();
  }

  private reSubscribe() {
    const sub: Observable<MultiSubscribeParams> = this.devicewiseMultisubscribeService.multiSubscribe(this.requestVariables);
    this.mutliSubRequest$.next(sub);
  }

  ngOnDestroy(): void {
    this.multiSub$.complete();
    this.multiSub$.unsubscribe();
    this.mutliSubRequest$.complete();
    this.multiSub$.unsubscribe();
  }

}
