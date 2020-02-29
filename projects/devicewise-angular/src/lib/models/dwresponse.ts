// Authentication

export class Response {
  success: boolean;
  errorCodes?: number[];
  errorMessages?: string[];
}

export class Login extends Response {
  sessionId: string;
  roles: [string];
  requirePasswordChange: boolean;
}

export class Logout extends Response {
}

// Variable

export class Read extends Response {
  params: ReadParams;
}

export interface ReadParams {
  variable: string;
  length: number;
  count: number;
  status: number;
  type: number;
  data: any[];
}

export class Write extends Response {
}

export class Subscription extends Response {
  params: SubscriptionParams;
}

interface SubscriptionParams {
  variable: string;
  length: number;
  count: number;
  status: number;
  type: number;
  data: any[];
  id: number;
}

export class Subscribe extends Response {
  params: SubscribeParams;
}
export interface SubscribeParams {
  id: number;
}

export class Unubscribe extends Response {
}

export class UnubscribeAll extends Response {
}

export class NotificationCount extends Response {
  params: NotificationCountParams;
}

export interface NotificationCountParams {
  count: number;
}

export class UnsubscribeAll extends Response {
  params: UnsubscribeAllParams;
}
export interface UnsubscribeAllParams {
  removed: number;
}

export class Unsubscribe extends Response {
}

export class ActionTypeList extends Response {
  params: ActionTypeListParams;
}

export interface ActionTypeListParams {
  actionTypes: ActionType[];
}

export interface ResultSettings {
  advanced: boolean;
  hex: boolean;
  readonly: boolean;
  required: boolean;
  revalidate: boolean;
  sort: boolean;
}

export interface Results {
  defaultGoTo: string;
  descId: number;
  name: string;
  nameId: number;
  returnCode: number;
  settings: ResultSettings;
}

export interface ActionType {
  defaultErrorRoute: number;
  descNlsId: number;
  group: string;
  groupNlsId: number;
  name: string;
  nameNlsId: number;
  options: number;
  overviewArgs: string[];
  overviewFormat: string;
  propertyDescriptions: DeviceDataTypeProperty[];
  results: Results[];
  type: string;
}

export class ActionList extends Response {
  params: ActionTypeListParams;
}

export interface ActionListActions {
  actions: ActionType[];
}
export class EventTypeList extends Response {
  params: EventTypeListParams;
}

export interface EventTypeListParams {
  eventTypes: EventType[];
}
export interface EventType {
  defaultErrorRoute: number;
  descNlsId: number;
  group: string;
  groupNlsId: number;
  name: string;
  nameNlsId: number;
  options: number;
  overviewArgs: string[];
  overviewFormat: string;
  propertyDescriptions: DeviceDataTypeProperty[];
  results: Results[];
  type: string;
}
export class EventList extends Response {
  params: EventTypeListParams;
}

export interface EventListEvents {
  Events: EventType[];
}
export class DeviceTypeList extends Response {
  params: DeviceTypeListParams;
}

export interface DeviceTypeListParams {
  devices: DeviceType[];
}

export interface DeviceType {
  name: string;
  type: number;
  state: number;
  lastStateChange: number;
  lastModified: number;
  options: number;
  status: number;
  exstatus: number;
}

export class DeviceList extends Response {
  params: DeviceTypeListParams;
}

export interface DeviceListDevices {
  devices: DeviceType[];
}

export class DeviceInfo extends Response {
  params: DeviceInfoParameters;
}

export interface DeviceInfoParameters {
  description: string;
  name: string;
  options: number;
  state: number;
  type: number;
  typeName: string;
  deviceProperties?: DeviceInfoProperties[];
  variableInfo?: DeviceInfoVariable[];
  structures?: DeviceInfoStructures[];
  attributes?: DeviceInfoAttributes[];
  commands?: DeviceInfoVariable[];
  mappedDescriptions?: DeviceInfoVariable[];
  runtimeStatus?: number[];
}

export interface DeviceInfoProperties {
  name: string;
  value: string;
}

export interface DeviceInfoVariable {
  name: string;
  options: number;
  type: string;
  length?: number;
  structId?: number;
  casts?: number;
  xdim?: number;
  xstart?: number;
  ydim?: number;
  ystart?: number;
  zdim?: number;
  zstart?: number;
}

export interface DeviceInfoStructures {
  length: number;
  name: string;
  options: number;
  structId: number;
  vinfo: DeviceInfoVariable[];
}

export interface DeviceInfoAttributes {
  name: string;
  nameNls: string;
  value: string;
}

export class DeviceDataType extends Response {
  params: DeviceDataTypeParams;
}

export interface DeviceDataTypeParams {
  deviceTypes: DeviceDataType[];
}

export interface DeviceDataType {
  typeId: number;
  name: string;
  nameNlsId: number;
  options: number;
  familyName: string;
  familyNlsId: number;
  displayOrder: number;
  propertyDescriptions: DeviceDataTypeProperty[];
  licensed: boolean;
}

export interface DeviceDataTypeProperty {
  key: string;
  name: string;
  nameNls: number;
  descNls: number;
  required: boolean;
  type: string;
}

export class DeviceStart extends Response {
  params: any;
}

export class DeviceStop extends Response {
  params: any;
}

// Trigger

export class TriggerList extends Response {
  params: TriggerListParams;
}
export interface TriggerListParams {
  triggers: TriggerListTrigger[];
}
export interface TriggerListTrigger {
  name: string;
  state: number;
  lastStateChange: number;
  lastMofified: number;
  context: string;
  lastFired: number;
  countSuccess: number;
  countPending: number;
  countFailure: number;
  countOverflow: number;
  averageExecution: number;
  lastUser: string;
  loadState: number;
  executionMax: number;
  executionMin: number;
  executionLast: number;
  countInQueue: number;
  queueWatermark: number;
  queueWatermarkTimestamp: number;
}

export class TriggerStart extends Response {
}

export class TriggerFire extends Response {
}

export class TriggerStop extends Response {
}

export class SubTriggerFire extends Response {
  params: SubTriggerFireParams;
}
export interface SubTriggerFireParams {
  resultStatus: number;
  eventStatus: number;
  count: number;
  output: SubscriptionParams[];
}

// Project

export class ProjectList extends Response {
  params: ProjectListParams;
}
export interface ProjectListParams {
  projects: ProjectListProject[];
}
export interface ProjectListProject {
  name: string;
  state: string;
  laststatechange: number;
  lastmodified: number;
}

export class ProjectStart { }

export class ProjectStop { }

// Channel

export class ChannelSubscribe extends Response {
  params: ChannelSubscribeParams;
}
export interface ChannelSubscribeParams {
  id: number;
}

export class ChannelUnsubscribe extends Response {
}

export class ChannelUnsubscribeAll extends Response {
}

// Diagnostics

export class Ping extends Response {
  params: PingParams;
}

export interface PingParams {
  pings: number[];
}

// SQLite

export class Sql extends Response {
  params: SqlParams;
}

export interface SqlParams {
  columns: string[];
  count: number;
  results: any[];
  table: string;
}

// System

export class ReferenceList extends Response {
  // params: ReferenceListParams;
}

// export interface ReferenceListParams {}
