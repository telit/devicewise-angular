import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DevicewiseMiscService } from './devicewise-misc.service';
import { DwType } from './models/dwcommon';
import * as DwResponse from './models/dwresponse';

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

  constructor(
    private http: HttpClient,
    private dwMisc: DevicewiseMiscService
  ) { }

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

  public dwApiSend(command: string, params?: any): Observable<DwResponse.DwResponse> {
    return this.http.post<DwResponse.DwResponse>(
      this.url + '/api',
      {
        command: command,
        params: params
      },
      httpOptions
    ).pipe(
      map((e) => {
        if (e.success === false) {
          const error = this.dwMisc.dwHandleError(e);
          throw error;
        }
        return e;
      })
    );
  }

  // Authentication
  public login(endpoint: string, username: string, password: string): Observable<DwResponse.LoginResponse> {
    return this.http
      .post<DwResponse.LoginResponse>(this.url + '/api/login', {
        auth: {
          username: username,
          password: password
        }
      }, httpOptions).pipe(
        map((e) => {
          if (e.success === false) {
            const error = this.dwMisc.dwHandleError(e);
            throw error;
          }
          this.setEndpoint(endpoint);
          return e;
        })
      );
  }

  public logout(): Observable<DwResponse.LogoutResponse> {
    return this.http.post<DwResponse.LogoutResponse>(this.url + '/api/logout', null, httpOptions);
  }

  public sessionInfo(): Observable<DwResponse.SessionInfo> {
    return this.dwApiSend('session.info').pipe(
      tap((e) => this.setEndpoint(this.url))
    );
  }

  public systemInfo(): Observable<DwResponse.SystemInfo> {
    return this.dwApiSend('system.info');
  }

  public systemVariables(): Observable<DwResponse.SystemVariables> {
    return this.dwApiSend('system.sysvar.list');
  }

  // Variable
  public read(device: string, variable: string, type?: DwType, count?: number, length?: number): Observable<DwResponse.ReadResponse> {
    return this.dwApiSend('variable.read.v2', {
      device: device,
      variable: variable,
      type: type,
      count: count,
      length: length
    });
  }

  public readV1(device: string, variable: string, type: DwType, count: number, length: number): Observable<DwResponse.ReadResponse> {
    return this.dwApiSend('variable.read', {
      device: device,
      variable: variable,
      type: type,
      count: count,
      length: length
    });
  }

  public write(device: string, variable: string, type: DwType, count: number, length: number, data: any): Observable<DwResponse.WriteResponse> {
    return this.dwApiSend('variable.write.v2', {
      device: device,
      variable: variable,
      type: type,
      count: count,
      length: length,
      data: data
    });
  }

  public writeV1(device: string, variable: string, type: DwType, count: number, length: number, data: any): Observable<DwResponse.WriteResponse> {
    return this.dwApiSend('variable.write', {
      device: device,
      variable: variable,
      type: type,
      count: count,
      length: length,
      data: data
    });
  }

  // Subscribe
  public subscribe(
    device: string,
    variable: string,
    rate: number,
    type: DwType,
    count: number,
    length: number
  ): Observable<DwResponse.SubscribeResponse> {
    return this.dwApiSend('variable.subscribe', {
      device: device,
      variable: variable,
      type: type,
      count: count,
      length: length
    });
  }

  public subscribeV1(
    device: string,
    variable: string,
    rate: number,
    type: DwType,
    count: number,
    length: number
  ): Observable<DwResponse.SubscribeResponse> {
    return this.dwApiSend('variable.subscribe', {
      device: device,
      variable: variable,
      type: type,
      count: count,
      length: length
    });
  }

  public unsubscribe(id: number): Observable<DwResponse.UnsubscribeResponse> {
    return this.dwApiSend('variable.unsubscribe', { id: id });
  }

  public unsubscribeAll(): Observable<DwResponse.UnsubscribeAllResponse> {
    return this.dwApiSend('variable.unsubscribe.all');
  }

  public notificationGet(): Observable<any> {
    return this.dwApiSend('notification.get');
  }

  public notificationCount(): Observable<DwResponse.NotificationCountResponse> {
    return this.dwApiSend('notification.count');
  }

  // Multisubscribe

  // Device
  public deviceList(): Observable<DwResponse.DeviceListResponse> {
    return this.dwApiSend('device.list');
  }

  public deviceInfo(device: string, options: number): Observable<DwResponse.DeviceInfoResponse> {
    return this.dwApiSend('device.info', { name: device, opts: options });
  }

  public deviceVariables(device: string): Observable<DwResponse.DeviceVariablesResponse> {
    return this.dwApiSend('device.variables', { name: device });
  }

  public deviceTypeList(): Observable<DwResponse.DeviceTypeListResponse> {
    return this.dwApiSend('devicetype.enum');
  }

  public deviceStart(device: string): Observable<DwResponse.DeviceStartResponse> {
    return this.dwApiSend('device.start', { name: device });
  }

  public deviceStop(device: string): Observable<DwResponse.DeviceStopResponse> {
    return this.dwApiSend('device.stop', { name: device });
  }

  // Trigger
  public triggerList(project: string): Observable<DwResponse.TriggerListResponse> {
    return this.dwApiSend('trigger.list', { project: project });
  }

  public triggerStart(project: string, trigger: string): Observable<DwResponse.TriggerStartResponse> {
    return this.dwApiSend('trigger.start', { name: trigger, project: project });
  }

  public triggerFire(project: string, trigger: string): Observable<DwResponse.TriggerFireResponse> {
    return this.dwApiSend('trigger.fire', { name: trigger, project: project });
  }

  public triggerStop(project: string, trigger: string): Observable<DwResponse.TriggerStopResponse> {
    return this.dwApiSend('trigger.stop', { name: trigger, project: project });
  }

  public subTriggerFire(project: string, trigger: string, reporting: boolean, input: any[]): Observable<DwResponse.SubTriggerFireResponse> {
    return this.dwApiSend('subtrigger.fire', { name: trigger, project: project, reportingEnabled: reporting, input: input });
  }

  public actionTypeList(): Observable<DwResponse.ActionTypeListResponse> {
    return this.dwApiSend('actiontype.enum');
  }

  public eventTypeList(): Observable<DwResponse.EventTypeListResponse> {
    return this.dwApiSend('eventtype.enum');
  }

  // Project
  public projectList(): Observable<DwResponse.ProjectListResponse> {
    return this.dwApiSend('project.list');
  }

  public projectStart(name): Observable<DwResponse.ProjectStartResponse> {
    return this.dwApiSend('project.start', { name: name });
  }

  public projectStop(name): Observable<DwResponse.ProjectStopResponse> {
    return this.dwApiSend('project.stop', { name: name });
  }

  // Channel

  // TODO
  public channelSubscribe(channel: string): Observable<DwResponse.ChannelSubscribeResponse> {
    return this.dwApiSend('channel.subscribe', { channel: channel });
  }

  public channelUnsubscribe(id: string): Observable<DwResponse.ChannelUnsubscribeResponse> {
    return this.dwApiSend('channel.unsubscribe', { id: id });
  }

  public channelUnsubscribeAll(): Observable<DwResponse.ChannelUnsubscribeAllResponse> {
    return this.dwApiSend('channel.unsubscribe.all');
  }

  // SQLite
  public sql(query): Observable<DwResponse.SqlResponse> {
    return this.dwApiSend('sqlite.execute', { query: query });
  }

  public sqlSystem(query): Observable<DwResponse.SqlResponse> {
    return this.dwApiSend('system.sqlite.execute', { query: query });
  }

  // System
  public referenceList(type: string, key: string, flag: string): Observable<DwResponse.ReferenceListResponse> {
    return this.dwApiSend('reference.list', { type: type, key: key, flag: flag });
  }

  // Misc
  public ping(address: string, count: number): Observable<DwResponse.PingResponse> {
    return this.dwApiSend('network.ping', { address: address, count: count });
  }

  public stagingFileList(path: string): Observable<DwResponse.StagingFileListResponse> {
    return this.dwApiSend('filesystem.staging.dir.list', { path: path });
  }

  // Util
  public dwTypeToNumber(dwType: string): DwType {
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

  public dwTypeToString(number: number): string {
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

