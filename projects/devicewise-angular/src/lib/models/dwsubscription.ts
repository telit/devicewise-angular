import * as DwResponse from './dwresponse';
import * as DwRequest from './dwrequest';
import { Observable } from 'rxjs';
import { DwType } from '../../public_api';

export class DwSubscription {
  request: DwRequest.SubscribeRequest;
  response: DwResponse.SubscribeResponse;
  subscription: Observable<DwResponse.SubscribeDataResponse>;

  constructor(device: string, variable: string, type: DwType, count: number, length: number) {
    this.request = {
      command: 'variable.subscribe',
      params: {
        device: device,
        variable: variable,
        type: type,
        count: count,
        length: length
      }
    };
  }
}
