import { DwVariable } from './dwcommon';

// Authentication

export interface DwRequest {
  command: string;
}

export interface LoginRequest {
  auth: LoginAuth;
}

export interface LoginAuth {
  username: string;
  password: string;
}

// Variable

export interface ReadRequest extends DwRequest {
  params: DwVariable;
}

export interface WriteRequest extends DwRequest {
  params: WriteParams;
}

export  interface WriteParams extends DwVariable {
  data: string;
}


export interface SubscribeRequest extends DwRequest {
  params:  DwVariable;
}


export interface UnubscribeRequest extends DwRequest {
  params: UnubscribeParams;
}

export interface UnubscribeParams {
  id: string;
}

// MultiSubscribe

export interface DwMultisubscribeRequest extends DwRequest {
  params: DwmultisubscribeRequestParams;
}

export interface DwmultisubscribeRequestParams {
  minimal: boolean;
  subscriptions: DwmultisubscribeRequestSubscriptions;
}

export interface DwmultisubscribeRequestSubscriptions {
  variable: DwVariable[];
  channel: DwmultisubscribeRequestChannelSubscription[];
}

export interface DwmultisubscribeRequestChannelSubscription {
  channel: string;
}

// Device

export interface DeviceInfoRequest extends DwRequest {
  params: DeviceInfoParams;
}

export interface DeviceInfoParams {
  name: string;
  opts: number;
}


export interface DeviceStartRequest extends DwRequest {
  params: DeviceNameParams;
}


export interface DeviceStopRequest extends DwRequest {
  params: DeviceNameParams;
}

export interface DeviceNameParams {
  name: string;
}

// Trigger

export interface TriggerListRequestRequest extends DwRequest {
  params: TriggerListParams;
}

export interface TriggerListParams {
  project: string;
}


export interface TriggerStartRequest extends DwRequest {
  params: TriggerParams;
}

export interface TriggerParams {
  project: string;
  trigger: string;
}


export interface TriggerFireRequest extends DwRequest {
  params: TriggerParams;
}


export interface TriggerStopRequest extends DwRequest {
  params: TriggerParams;
}


export interface SubTriggerFireRequest extends DwRequest {
  params: TriggerParams;
}

export interface SubTriggerFireParams extends TriggerParams {
  reportingEnabled: boolean;
  input: any[];
}

// Project

export interface ProjectStartRequest extends DwRequest {
  params: ProjectNameParams;
}

export interface ProjectStopRequest extends DwRequest {
  params: ProjectNameParams;
}

export interface ProjectNameParams {
  name: string;
}

// Diagnostics

export interface PingRequest extends DwRequest {
  params: PingParams;
}

export interface PingParams {
  address: string;
  count: string;
}

// SQLite

export interface Sql extends DwRequest {
  params: SqlParams;
}

export interface SqlParams {
  query: string;
}
