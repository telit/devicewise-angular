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
  type: string;
  count: string;
  length: string;
}
export class Unubscribe {}

export class UnubscribeAll {}

export class NotificationCount {}

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
  input: { name: string; value: string }[];
}

// Project

export class ProjectList {}

// Diagnostics

export class Ping {}

// SQLite

export class Sql {}
