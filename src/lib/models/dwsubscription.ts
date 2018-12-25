import * as DwResponse from './dwresponse';
import * as DwRequest from './dwrequest';
import { Subject } from 'rxjs';

export class Subscription {
  request: DwRequest.Subscribe;
  response: DwResponse.Subscribe;
  subscription: Subject<DwResponse.Subscription>;
}
