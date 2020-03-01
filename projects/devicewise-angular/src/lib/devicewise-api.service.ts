import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import * as DwResponse from './models/dwresponse';
import { DwType } from './models/dwcommon';

const httpOptions = {
  headers: new HttpHeaders({}),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class DevicewiseApiService {
  public url = '';
  public url$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private http: HttpClient) { }

  setEndpoint(endpoint: string): void {
    this.url = endpoint;
    this.url$.next(endpoint);
  }

  getEndpoint(): string {
    return this.url;
  }

  getEndpointasObservable(): Observable<string> {
    return this.url$.asObservable();
  }

  // Authentication
  public login(endpoint: string, username: string, password: string): Observable<DwResponse.LoginResponse> {
    return this.http
      .post<DwResponse.LoginResponse>(this.url + '/api/login', {
        auth: {
          username: username,
          password: password
        }
      }, httpOptions);
  }

  public logout(): Observable<DwResponse.LogoutResponse> {
    return this.http.post<DwResponse.LogoutResponse>(this.url + '/api/logout', null, httpOptions);
  }

  // Variable
  public read(device: string, variable: string, type: number, count: number, length: number): Observable<DwResponse.Response> {
    return this.http.post<DwResponse.Response>(
      this.url + '/api',
      {
        command: 'variable.read',
        params: {
          device: device,
          variable: variable,
          type: type,
          count: count,
          length: length
        }
      },
      httpOptions
    );
  }

  public write(device: string, variable: string, type: number, count: number, length: number, data: any): Observable<DwResponse.WriteResponse> {
    return this.http.post<DwResponse.WriteResponse>(
      this.url + '/api',
      {
        command: 'variable.write',
        params: {
          device: device,
          variable: variable,
          type: type,
          count: count,
          length: length,
          data: JSON.stringify(data)
        }
      },
      httpOptions
    );
  }

  // Subscribe
  public subscribe(
    device: string,
    variable: string,
    rate: number,
    type: number,
    count: number,
    length: number
  ): Observable<DwResponse.SubscribeResponse> {
    return this.http.post<DwResponse.SubscribeResponse>(
      this.url + '/api',
      {
        command: 'variable.subscribe',
        params: {
          device: device,
          variable: variable,
          type: type,
          count: count,
          length: length
        }
      },
      httpOptions
    );
  }

  public unsubscribe(id: number): Observable<DwResponse.UnsubscribeResponse> {
    return this.http.post<DwResponse.UnsubscribeResponse>(
      this.url + '/api',
      {
        command: 'variable.unsubscribe',
        params: { id: id }
      },
      httpOptions
    );
  }

  public unsubscribeAll(): Observable<DwResponse.UnsubscribeAllResponse> {
    return this.http.post<DwResponse.UnsubscribeAllResponse>(
      this.url + '/api',
      {
        command: 'variable.unsubscribe.all'
      },
      httpOptions
    );
  }

  public notificationGet(): Observable<any> {
    return this.http.post(
      this.url + '/api',
      {
        command: 'notification.get'
      },
      httpOptions
    );
  }

  public notificationCount(): Observable<DwResponse.NotificationCountResponse> {
    return this.http.post<DwResponse.NotificationCountResponse>(
      this.url + '/api',
      {
        command: 'notification.count'
      },
      httpOptions
    );
  }

  // Multisubscribe

  // Device
  public deviceList(): Observable<DwResponse.DeviceListResponse> {
    return this.http.post<DwResponse.DeviceListResponse>(this.url + '/api', { command: 'device.list' }, httpOptions);
  }

  public deviceInfo(device: string, options: number): Observable<DwResponse.DeviceInfoResponse> {
    return this.http.post<DwResponse.DeviceInfoResponse>(
      this.url + '/api',
      { command: 'device.info', params: { name: device, opts: options } },
      httpOptions
    );
  }

  public deviceTypeList(): Observable<DwResponse.DeviceDataTypeResponse> {
    return this.http.post<DwResponse.DeviceDataTypeResponse>(this.url + '/api', { command: 'devicetype.enum' }, httpOptions);
  }

  public deviceStart(device: string): Observable<DwResponse.DeviceStartResponse> {
    return this.http.post<DwResponse.DeviceStartResponse>(
      this.url + '/api',
      { command: 'device.start', params: { name: device } },
      httpOptions
    );
  }

  public deviceStop(device: string): Observable<DwResponse.DeviceStopResponse> {
    return this.http.post<DwResponse.DeviceStopResponse>(
      this.url + '/api',
      { command: 'device.stop', params: { name: device } },
      httpOptions
    );
  }

  // Trigger
  public triggerList(project: string): Observable<DwResponse.TriggerListResponse> {
    return this.http.post<DwResponse.TriggerListResponse>(
      this.url + '/api',
      { command: 'trigger.list', params: { project: project } },
      httpOptions
    );
  }

  public triggerStart(project: string, trigger: string): Observable<DwResponse.TriggerStartResponse> {
    return this.http.post<DwResponse.TriggerStartResponse>(
      this.url + '/api',
      { command: 'trigger.start', params: { name: trigger, project: project } },
      httpOptions
    );
  }

  public triggerFire(project: string, trigger: string): Observable<DwResponse.TriggerFireResponse> {
    return this.http.post<DwResponse.TriggerFireResponse>(
      this.url + '/api',
      { command: 'trigger.fire', params: { name: trigger, project: project } },
      httpOptions
    );
  }

  public triggerStop(project: string, trigger: string): Observable<DwResponse.TriggerStopResponse> {
    return this.http.post<DwResponse.TriggerStopResponse>(
      this.url + '/api',
      { command: 'trigger.stop', params: { name: trigger, project: project } },
      httpOptions
    );
  }

  public subTriggerFire(project: string, trigger: string, reporting: boolean, input: any[]): Observable<DwResponse.SubTriggerFireResponse> {
    return this.http.post<DwResponse.SubTriggerFireResponse>(
      this.url + '/api',
      { command: 'subtrigger.fire', params: { name: trigger, project: project, reportingEnabled: reporting, input: input } },
      httpOptions
    );
  }

  public actionTypeList(): Observable<DwResponse.ActionTypeListResponse> {
    return this.http.post<DwResponse.ActionTypeListResponse>(this.url + '/api', { command: 'actiontype.enum' }, httpOptions);
  }

  public eventTypeList(): Observable<DwResponse.EventTypeListResponse> {
    return this.http.post<DwResponse.EventTypeListResponse>(this.url + '/api', { command: 'eventtype.enum' }, httpOptions);
  }

  // Project
  public projectList(): Observable<DwResponse.ProjectListResponse> {
    return this.http.post<DwResponse.ProjectListResponse>(this.url + '/api', { command: 'project.list' }, httpOptions);
  }

  public projectStart(name): Observable<DwResponse.ProjectStartResponse> {
    return this.http.post<DwResponse.ProjectStartResponse>(
      this.url + '/api',
      { command: 'project.start', params: { name: name } },
      httpOptions
    );
  }

  public projectStop(name): Observable<DwResponse.ProjectStopResponse> {
    return this.http.post<DwResponse.ProjectStopResponse>(
      this.url + '/api',
      { command: 'project.stop', params: { name: name } },
      httpOptions
    );
  }

  // Channel

  // TODO
  public channelSubscribe(channel: string): Observable<DwResponse.ChannelSubscribeResponse> {
    return this.http.post<DwResponse.ChannelSubscribeResponse>(
      this.url + '/api',
      {
        command: 'channel.subscribe',
        params: {
          channel: channel
        }
      },
      httpOptions
    );
  }

  public channelUnsubscribe(id: string): Observable<DwResponse.ChannelUnsubscribeResponse> {
    return this.http.post<DwResponse.ChannelUnsubscribeResponse>(
      this.url + '/api',
      {
        command: 'channel.unsubscribe',
        params: { id: id }
      },
      httpOptions
    );
  }

  public channelUnsubscribeAll(): Observable<DwResponse.ChannelUnsubscribeAllResponse> {
    return this.http.post<DwResponse.ChannelUnsubscribeAllResponse>(
      this.url + '/api',
      {
        command: 'channel.unsubscribe.all'
      },
      httpOptions
    );
  }

  // SQLite
  public sql(query): Observable<DwResponse.SqlResponse> {
    return this.http.post<DwResponse.SqlResponse>(
      this.url + '/api',
      {
        command: 'sqlite.execute',
        params: { query: query }
      },
      httpOptions
    );
  }

  // System
  public referenceList(type: string, key: string, flag: string): Observable<DwResponse.ReferenceListResponse> {
    return this.http.post<DwResponse.ReferenceListResponse>(
      this.url + '/api',
      {
        command: 'reference.list',
        params: { type: type, key: key, flag: flag }
      },
      httpOptions
    );
  }

  // Diagnostics
  public ping(address: string, count: number): Observable<DwResponse.PingResponse> {
    return this.http.post<DwResponse.PingResponse>(
      this.url + '/api',
      {
        command: 'network.ping',
        params: {
          address: address,
          count: count
        }
      },
      httpOptions
    );
  }

  // Util
  public dwTypeToNumber(dwType: string) {
    switch (dwType) {
      case 'INT1':
        return DwType.INT1;
      case 'INT2':
        return DwType.INT2;
      case 'INT4':
        return DwType.INT4;
      case 'INT8':
        return DwType.INT8;
      case 'UINT1':
        return DwType.UINT1;
      case 'UINT2':
        return DwType.UINT2;
      case 'UINT4':
        return DwType.UINT4;
      case 'UINT8':
        return DwType.UINT8;
      case 'FLOAT4':
        return DwType.FLOAT4;
      case 'FLOAT8':
        return DwType.FLOAT8;
      case 'BOOL':
        return DwType.BOOL;
      case 'STRING':
        return DwType.STRING;
      case 'TIMESTAMP':
        return DwType.TIMESTAMP;
      case 'BINARY':
        return DwType.BINARY;
      default:
        return DwType.UNKNOWN;
    }
  }

  public dwTypeToString(number: number) {
    switch (number) {
      case DwType.INT1:
        return 'INT1';
      case DwType.INT2:
        return 'INT2';
      case DwType.INT4:
        return 'INT4';
      case DwType.INT8:
        return 'INT8';
      case DwType.UINT1:
        return 'UINT1';
      case DwType.UINT2:
        return 'UINT2';
      case DwType.UINT4:
        return 'UINT4';
      case DwType.UINT8:
        return 'UINT8';
      case DwType.FLOAT4:
        return 'FLOAT4';
      case DwType.FLOAT8:
        return 'FLOAT8';
      case DwType.BOOL:
        return 'BOOL';
      case DwType.STRING:
        return 'STRING';
      case DwType.TIMESTAMP:
        return 'TIMESTAMP';
      case DwType.BINARY:
        return 'BINARY';
      default:
        return 'UNKNOWN';
    }
  }
}
