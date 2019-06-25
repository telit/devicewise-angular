import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as DwResponse from './models/dwresponse';

const httpOptions = {
  headers: new HttpHeaders({}),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class DevicewiseApiService {
  private url = location.origin;

  constructor(private http: HttpClient) { }

  setEndpoint(endpoint: string): void {
    this.url = endpoint;
  }

  // Authentication

  login(endpoint: string, username: string, password: string): Observable<DwResponse.Login> {
    this.url = endpoint;
    return this.http
      .post<DwResponse.Login>(this.url + '/api/login', {
        auth: {
          username: username,
          password: password
        }
      });
  }

  logout(): Observable<DwResponse.Logout> {
    return this.http.post<DwResponse.Logout>(this.url + '/api/logout', null, httpOptions);
  }

  // Variable

  read(device: string, variable: string, type: number, count: number, length: number): Observable<DwResponse.Read> {
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

  write(device: string, variable: string, type: number, count: number, length: number, data: any): Observable<DwResponse.Write> {
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
          data: data
        }
      },
      httpOptions
    );
  }

  // Subscribe

  subscribe(
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

  unsubscribe(id: number): Observable<DwResponse.Unsubscribe> {
    return this.http.post<DwResponse.Unsubscribe>(
      this.url + '/api',
      {
        command: 'variable.unsubscribe',
        params: { id: id }
      },
      httpOptions
    );
  }

  unsubscribeAll(): Observable<DwResponse.UnsubscribeAll> {
    return this.http.post<DwResponse.UnsubscribeAll>(
      this.url + '/api',
      {
        command: 'variable.unsubscribe.all'
      },
      httpOptions
    );
  }

  notificationGet(): Observable<any> {
    return this.http.post(
      this.url + '/api',
      {
        command: 'notification.get'
      },
      httpOptions
    );
  }

  notificationCount(): Observable<DwResponse.NotificationCount> {
    return this.http.post<DwResponse.NotificationCount>(
      this.url + '/api',
      {
        command: 'notification.count'
      },
      httpOptions
    );
  }

  // Device

  deviceList(): Observable<DwResponse.DeviceList> {
    return this.http.post<DwResponse.DeviceList>(this.url + '/api', { command: 'device.list' }, httpOptions);
  }

  deviceInfo(device: string, options: number): Observable<DwResponse.DeviceInfo> {
    return this.http.post<DwResponse.DeviceInfo>(
      this.url + '/api',
      { command: 'device.info', params: { name: device, opts: options } },
      httpOptions
    );
  }

  deviceTypeList(): Observable<DwResponse.DeviceDataType> {
    return this.http.post<DwResponse.DeviceDataType>(this.url + '/api', { command: 'devicetype.enum' }, httpOptions);
  }

  deviceStart(device: string): Observable<DwResponse.DeviceStart> {
    return this.http.post<DwResponse.DeviceStart>(
      this.url + '/api',
      { command: 'device.start', params: { name: device } },
      httpOptions
    );
  }

  deviceStop(device: string): Observable<DwResponse.DeviceStop> {
    return this.http.post<DwResponse.DeviceStop>(
      this.url + '/api',
      { command: 'device.stop', params: { name: device } },
      httpOptions
    );
  }

  // Trigger

  triggerList(project: string): Observable<DwResponse.TriggerList> {
    return this.http.post<DwResponse.TriggerList>(
      this.url + '/api',
      { command: 'trigger.list', params: { project: project } },
      httpOptions
    );
  }

  triggerStart(project: string, trigger: string): Observable<DwResponse.TriggerStart> {
    return this.http.post<DwResponse.TriggerStart>(
      this.url + '/api',
      { command: 'trigger.start', params: { name: trigger, project: project } },
      httpOptions
    );
  }

  triggerFire(project: string, trigger: string): Observable<DwResponse.TriggerFire> {
    return this.http.post<DwResponse.TriggerFire>(
      this.url + '/api',
      { command: 'trigger.fire', params: { name: trigger, project: project } },
      httpOptions
    );
  }

  triggerStop(project: string, trigger: string): Observable<DwResponse.TriggerStop> {
    return this.http.post<DwResponse.TriggerStop>(
      this.url + '/api',
      { command: 'trigger.stop', params: { name: trigger, project: project } },
      httpOptions
    );
  }

  subTriggerFire(project: string, trigger: string, reporting: boolean, input: any[]): Observable<DwResponse.SubTriggerFire> {
    return this.http.post<DwResponse.SubTriggerFire>(
      this.url + '/api',
      { command: 'subtrigger.fire', params: { name: trigger, project: project, reportingEnabled: reporting, input: input } },
      httpOptions
    );
  }

  // Project

  projectList(): Observable<DwResponse.ProjectList> {
    return this.http.post<DwResponse.ProjectList>(this.url + '/api', { command: 'project.list' }, httpOptions);
  }

  projectStart(name): Observable<DwResponse.ProjectStart> {
    return this.http.post<DwResponse.ProjectStart>(
      this.url + '/api',
      { command: 'project.start', params: { name: name } },
      httpOptions
    );
  }

  projectStop(name): Observable<DwResponse.ProjectStop> {
    return this.http.post<DwResponse.ProjectStop>(
      this.url + '/api',
      { command: 'project.stop', params: { name: name } },
      httpOptions
    );
  }

  // Channel

  // TODO
  channelSubscribe(channel: string): Observable<DwResponse.ChannelSubscribe> {
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

  channelUnsubscribe(id: string): Observable<DwResponse.ChannelUnsubscribe> {
    return this.http.post<DwResponse.ChannelUnsubscribe>(
      this.url + '/api',
      {
        command: 'channel.unsubscribe',
        params: { id: id }
      },
      httpOptions
    );
  }

  channelUnsubscribeAll(): Observable<DwResponse.ChannelUnsubscribeAll> {
    return this.http.post<DwResponse.ChannelUnsubscribeAll>(
      this.url + '/api',
      {
        command: 'channel.unsubscribe.all'
      },
      httpOptions
    );
  }

  // SQLite

  sql(query): Observable<DwResponse.Sql> {
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

  referenceList(type: string, key: string, flag: string): Observable<DwResponse.ReferenceList> {
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

  ping(address: string, count: number): Observable<DwResponse.Ping> {
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
}
