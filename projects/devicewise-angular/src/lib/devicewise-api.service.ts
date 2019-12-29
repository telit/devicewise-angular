import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import * as DwResponse from './models/dwresponse';
import { DwType } from './models/dwconstants';
import { DevicewiseAngularService } from './devicewise-angular.service';

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
  public login(endpoint: string, username: string, password: string): Observable<DwResponse.Login> {
    return this.http
      .post<DwResponse.Login>(this.url + '/api/login', {
        auth: {
          username: username,
          password: password
        }
      }, httpOptions);
  }

  public logout(): Observable<DwResponse.Logout> {
    return this.http.post<DwResponse.Logout>(this.url + '/api/logout', null, httpOptions);
  }

  // Variable
  public read(device: string, variable: string, type: number, count: number, length: number): Observable<DwResponse.Read> {
    return this.http.post<DwResponse.Read>(
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

  public write(device: string, variable: string, type: number, count: number, length: number, data: any): Observable<DwResponse.Write> {
    return this.http.post<DwResponse.Write>(
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
  ): Observable<DwResponse.Subscribe> {
    return this.http.post<DwResponse.Subscribe>(
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

  public unsubscribe(id: number): Observable<DwResponse.Unsubscribe> {
    return this.http.post<DwResponse.Unsubscribe>(
      this.url + '/api',
      {
        command: 'variable.unsubscribe',
        params: { id: id }
      },
      httpOptions
    );
  }

  public unsubscribeAll(): Observable<DwResponse.UnsubscribeAll> {
    return this.http.post<DwResponse.UnsubscribeAll>(
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

  public notificationCount(): Observable<DwResponse.NotificationCount> {
    return this.http.post<DwResponse.NotificationCount>(
      this.url + '/api',
      {
        command: 'notification.count'
      },
      httpOptions
    );
  }

  // Multisubscribe

  // Device
  public deviceList(): Observable<DwResponse.DeviceList> {
    return this.http.post<DwResponse.DeviceList>(this.url + '/api', { command: 'device.list' }, httpOptions);
  }

  public deviceInfo(device: string, options: number): Observable<DwResponse.DeviceInfo> {
    return this.http.post<DwResponse.DeviceInfo>(
      this.url + '/api',
      { command: 'device.info', params: { name: device, opts: options } },
      httpOptions
    );
  }

  public deviceTypeList(): Observable<DwResponse.DeviceDataType> {
    return this.http.post<DwResponse.DeviceDataType>(this.url + '/api', { command: 'devicetype.enum' }, httpOptions);
  }

  public deviceStart(device: string): Observable<DwResponse.DeviceStart> {
    return this.http.post<DwResponse.DeviceStart>(
      this.url + '/api',
      { command: 'device.start', params: { name: device } },
      httpOptions
    );
  }

  public deviceStop(device: string): Observable<DwResponse.DeviceStop> {
    return this.http.post<DwResponse.DeviceStop>(
      this.url + '/api',
      { command: 'device.stop', params: { name: device } },
      httpOptions
    );
  }

  // Trigger
  public triggerList(project: string): Observable<DwResponse.TriggerList> {
    return this.http.post<DwResponse.TriggerList>(
      this.url + '/api',
      { command: 'trigger.list', params: { project: project } },
      httpOptions
    );
  }

  public triggerStart(project: string, trigger: string): Observable<DwResponse.TriggerStart> {
    return this.http.post<DwResponse.TriggerStart>(
      this.url + '/api',
      { command: 'trigger.start', params: { name: trigger, project: project } },
      httpOptions
    );
  }

  public triggerFire(project: string, trigger: string): Observable<DwResponse.TriggerFire> {
    return this.http.post<DwResponse.TriggerFire>(
      this.url + '/api',
      { command: 'trigger.fire', params: { name: trigger, project: project } },
      httpOptions
    );
  }

  public triggerStop(project: string, trigger: string): Observable<DwResponse.TriggerStop> {
    return this.http.post<DwResponse.TriggerStop>(
      this.url + '/api',
      { command: 'trigger.stop', params: { name: trigger, project: project } },
      httpOptions
    );
  }

  public subTriggerFire(project: string, trigger: string, reporting: boolean, input: any[]): Observable<DwResponse.SubTriggerFire> {
    return this.http.post<DwResponse.SubTriggerFire>(
      this.url + '/api',
      { command: 'subtrigger.fire', params: { name: trigger, project: project, reportingEnabled: reporting, input: input } },
      httpOptions
    );
  }

  public actionTypeList(): Observable<DwResponse.ActionTypeList> {
    return this.http.post<DwResponse.ActionTypeList>(this.url + '/api', { command: 'actiontype.enum' }, httpOptions);
  }

  public eventTypeList(): Observable<DwResponse.EventTypeList> {
    return this.http.post<DwResponse.EventTypeList>(this.url + '/api', { command: 'eventtype.enum' }, httpOptions);
  }

  // Project
  public projectList(): Observable<DwResponse.ProjectList> {
    return this.http.post<DwResponse.ProjectList>(this.url + '/api', { command: 'project.list' }, httpOptions);
  }

  public projectStart(name): Observable<DwResponse.ProjectStart> {
    return this.http.post<DwResponse.ProjectStart>(
      this.url + '/api',
      { command: 'project.start', params: { name: name } },
      httpOptions
    );
  }

  public projectStop(name): Observable<DwResponse.ProjectStop> {
    return this.http.post<DwResponse.ProjectStop>(
      this.url + '/api',
      { command: 'project.stop', params: { name: name } },
      httpOptions
    );
  }

  // Channel

  // TODO
  public channelSubscribe(channel: string): Observable<DwResponse.ChannelSubscribe> {
    return this.http.post<DwResponse.ChannelSubscribe>(
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

  public channelUnsubscribe(id: string): Observable<DwResponse.ChannelUnsubscribe> {
    return this.http.post<DwResponse.ChannelUnsubscribe>(
      this.url + '/api',
      {
        command: 'channel.unsubscribe',
        params: { id: id }
      },
      httpOptions
    );
  }

  public channelUnsubscribeAll(): Observable<DwResponse.ChannelUnsubscribeAll> {
    return this.http.post<DwResponse.ChannelUnsubscribeAll>(
      this.url + '/api',
      {
        command: 'channel.unsubscribe.all'
      },
      httpOptions
    );
  }

  // SQLite
  public sql(query): Observable<DwResponse.Sql> {
    return this.http.post<DwResponse.Sql>(
      this.url + '/api',
      {
        command: 'sqlite.execute',
        params: { query: query }
      },
      httpOptions
    );
  }

  // System
  public referenceList(type: string, key: string, flag: string): Observable<DwResponse.ReferenceList> {
    return this.http.post<DwResponse.ReferenceList>(
      this.url + '/api',
      {
        command: 'reference.list',
        params: { type: type, key: key, flag: flag }
      },
      httpOptions
    );
  }

  // Diagnostics
  public ping(address: string, count: number): Observable<DwResponse.Ping> {
    return this.http.post<DwResponse.Ping>(
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
      default:
        return 'UNKNOWN';
    }
  }
}
