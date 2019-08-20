// Authentication

export class Login {
  auth: LoginAuth;
}

export interface LoginAuth {
  username: string;
  password: string;
}

export class Logout {}

// Variable

export class Read {}

export class Write {
  command: string;
  params: WriteParams;
}
export  interface WriteParams {
  device: string;
  variable: string;
  type: string;
  count: string;
  length: string;
  data: string;
}

export class Subscribe {
  command: string;
  params: SubscribeParams;
}
export interface SubscribeParams {
  device: string;
  variable: string;
  type: number;
  count: number;
  length: number;
}

export class Unubscribe {}

export class UnubscribeAll {}

export class NotificationCount {}

// MultiSubscribe

export class DwmultisubscribeRequest {
  command: string;
  params: DwmultisubscribeRequestParams;
}

export class DwmultisubscribeRequestParams {
  minimal: boolean;
  subscriptions: DwmultisubscribeRequestSubscriptions;
}

export interface DwmultisubscribeRequestSubscriptions {
  variable: DwmultisubscribeRequestVariableSubscription[];
  channel: DwmultisubscribeRequestChannelSubscription[];
}

export interface DwmultisubscribeRequestVariableSubscription {
  device: string;
  variable: string;
  type: number|string;
  count: number|string;
  length: number|string;
}

export interface DwmultisubscribeRequestChannelSubscription {
  channel: string;
}

// Device

export class DeviceList {}

export class DeviceInfo {}

export class DeviceTypeList {}

export class DeviceStart {}

export class DeviceStop {}

// Trigger

export class TriggerList {}
export class TriggerStart {}
export class TriggerFire {}
export class TriggerStop {}
export class SubTriggerFire {}

export class SubTriggerFireParams {
  name: string;
  project: string;
  reportingEnabled: boolean;
  input: any[];
}


// Project

export class ProjectList {}

// Diagnostics

export class Ping {}

// SQLite

export class Sql {}
