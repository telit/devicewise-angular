// Authentication

export class Login {
  success: boolean;
  sessionId: string;
  roles: [string];
  requirePasswordChange: boolean;
  errorCodes?: [number];
  errorMessages?: [string];
}

export class Logout {
  success: boolean;
}

// Variable

export class Read {
  success: boolean;
  params: ReadParams;
  errorCodes?: number[];
  errorMessages?: string[];
}

export interface ReadParams {
  variable: string;
  length: number;
  count: number;
  status: number;
  type: number;
  data: any[];
}

export class Write {
  success: boolean;
  errorCodes?: number[];
  errorMessages?: string[];
}

export class Subscription {
  success: boolean;
  params: SubscriptionParams;
  errorCodes?: number[];
  errorMessages?: string[];
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

export class Subscribe {
  success: boolean;
  params: SubscribeParams;
  errorCodes?: number[];
  errorMessages?: string[];
}
export interface SubscribeParams {
  id: number;
}

export class Unubscribe {
  success: boolean;
  errorCodes?: number[];
  errorMessages?: string[];
}

export class UnubscribeAll {
  success: boolean;
  errorCodes?: number[];
  errorMessages?: string[];
}

export class NotificationCount {
  success: boolean;
  params: NotificationCountParams;
}

export interface NotificationCountParams {
  count: number;
}

export class UnsubscribeAll {
  success: boolean;
  params: UnsubscribeAllParams;
}
export interface UnsubscribeAllParams {
  removed: number;
}

export class Unsubscribe {
  success: boolean;
}

export class ActionTypeList {
  success: boolean;
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

export class ActionList {
  success: boolean;
  params: ActionTypeListParams;
}

export interface ActionListActions {
  actions: ActionType[];
}



export class EventTypeList {
  success: boolean;
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

export class EventList {
  success: boolean;
  params: EventTypeListParams;
}

export interface EventListEvents {
  Events: EventType[];
}



export class DeviceTypeList {
  success: boolean;
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

export class DeviceList {
  success: boolean;
  params: DeviceTypeListParams;
}

export interface DeviceListDevices {
  devices: DeviceType[];
}

export class DeviceInfo {
  success: boolean;
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

export class DeviceDataType {
  success: boolean;
  params: DeviceDataTypeParams;
  errorCodes?: number[];
  errorMessages?: string[];
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

export class DeviceStart {
  success: boolean;
  params: any;
  errorCodes?: number[];
  errorMessages?: string[];
}

export class DeviceStop {
  success: boolean;
  params: any;
  errorCodes?: number[];
  errorMessages?: string[];
}

// Trigger

export class TriggerList {
  success: boolean;
  params: TriggerListParams;
  errorCodes?: number[];
  errorMessages?: string[];
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

export class TriggerStart {
  success: boolean;
  errorCodes?: number[];
  errorMessages?: string[];
}

export class TriggerFire {
  success: boolean;
  errorCodes?: number[];
  errorMessages?: string[];
}

export class TriggerStop {
  success: boolean;
  errorCodes?: number[];
  errorMessages?: string[];
}

export class SubTriggerFire {
  success: boolean;
  params: SubTriggerFireParams;
  errorCodes?: number[];
  errorMessages?: string[];
}
export interface SubTriggerFireParams {
  resultStatus: number;
  eventStatus: number;
  count: number;
  output: SubscriptionParams[];
}

// Project

export class ProjectList {
  success: boolean;
  params: ProjectListParams;
  errorCodes?: number[];
  errorMessages?: string[];
}
export interface ProjectListParams {
  projects: ProjectListProject[];
}
export interface ProjectListProject {
  name: string;
  state: number;
  laststatechange: number;
  lastmodified: number;
}

export class ProjectStart { }

export class ProjectStop { }

// Channel

export class ChannelSubscribe {
  success: boolean;
  params: ChannelSubscribeParams;
  errorCodes?: number[];
  errorMessages?: string[];
}
export interface ChannelSubscribeParams {
  id: number;
}

export class ChannelUnsubscribe {
  success: boolean;
  errorCodes?: number[];
  errorMessages?: string[];
}

export class ChannelUnsubscribeAll {
  success: boolean;
  errorCodes?: number[];
  errorMessages?: string[];
}

// Diagnostics

export class Ping {
  success: true;
  params: PingParams;
  errorCodes?: number[];
  errorMessages?: string[];
}

export interface PingParams {
  pings: number[];
}

// SQLite

export class Sql {
  success: boolean;
  params: SqlParams;
  errorCodes?: number[];
  errorMessages?: string[];
}

export interface SqlParams {
  columns: string[];
  count: number;
  results: any[];
  table: string;
}

// System

export class ReferenceList {
  success: boolean;
  // params: ReferenceListParams;
  errorCodes?: number[];
  errorMessages?: string[];
}

// export interface ReferenceListParams {}
