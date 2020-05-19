import { DwVariable } from './dwcommon';
import { DwType } from '../../public_api';

export interface DwResponse {
  success: boolean;
  errorCodes?: number[];
  errorMessages?: string[];
}

// Authentication

export interface LoginResponse extends DwResponse {
  sessionId?: string;
  roles?: [string];
  requirePasswordChange?: boolean;
}


export interface LogoutResponse extends DwResponse {
}


export interface SessionInfo extends DwResponse {
  params: SessionInfoParams;
}

export interface SessionInfoParams {
  roles: [string];
  requirePasswordChange: boolean;
}

// Variable

export interface ReadResponse extends DwResponse {
  params: ReadParams;
}


export interface ReadParams extends DwVariable {
  status: number;
  data: any[];
}


export interface WriteResponse extends DwResponse {
}


export interface SubscribeDataResponse extends DwResponse {
  params: SubscribeDataParams;
}

export interface SubscribeDataParams {
  variable: string;
  length: number;
  count: number;
  status: number;
  type: DwType;
  data: any[];
  id: number;
}


export interface SubscribeResponse extends DwResponse {
  params: SubscribeParams;
}

export interface SubscribeParams {
  id: number;
}


export interface UnubscribeResponse extends DwResponse {
}


export interface UnubscribeAllResponse extends DwResponse {
}


export interface NotificationCountResponse extends DwResponse {
  params: NotificationCountParams;
}

export interface NotificationCountParams {
  count: number;
}


export interface UnsubscribeAllResponse extends DwResponse {
  params: UnsubscribeAllParams;
}

export interface UnsubscribeAllParams {
  removed: number;
}


export interface UnsubscribeResponse extends DwResponse {
}


export interface ActionTypeListResponse extends DwResponse {
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


export interface ActionListResponse extends DwResponse {
  params: ActionTypeListParams;
}

export interface ActionListActions {
  actions: ActionType[];
}


export interface EventTypeListResponse extends DwResponse {
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


export interface EventListResponse extends DwResponse {
  params: EventTypeListParams;
}

export interface EventListEvents {
  Events: EventType[];
}


export interface DeviceTypeListResponse extends DwResponse {
  params: DeviceListParams;
}

export interface DwDevice {
  name: string;
  type: DwType;
  state: number;
  lastStateChange: number;
  lastModified: number;
  options?: number;
  status?: number;
  exstatus?: number;
}

export interface DeviceListResponse extends DwResponse {
  params: DeviceListParams;
}
export interface DeviceListParams {
  devices: DwDevice[];
}

export interface DeviceInfoResponse extends DwResponse {
  params: DeviceInfoParameters;
}

export interface DeviceInfoParameters {
  description: string;
  name: string;
  options: number;
  state: number;
  type: DwType;
  typeName: string;
  deviceProperties?: DeviceInfoProperty[];
  variableInfo?: DeviceInfoVariable[];
  structures?: DeviceInfoStructure[];
  attributes?: DeviceInfoAttribute[];
  commands?: DeviceInfoVariable[];
  mappedDescriptions?: DeviceInfoVariable[];
  runtimeStatus?: number[];
}

export interface DeviceInfoProperty {
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

export interface DeviceInfoStructure {
  length: number;
  name: string;
  options: number;
  structId: number;
  vinfo: DeviceInfoVariable[];
}

export interface DeviceInfoAttribute {
  name: string;
  nameNls: string;
  value: string;
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


export interface DeviceStartResponse extends DwResponse {
  params: any;
}


export interface DeviceStopResponse extends DwResponse {
  params: any;
}

// Trigger

export interface TriggerListResponse extends DwResponse {
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


export interface TriggerStartResponse extends DwResponse {
}


export interface TriggerFireResponse extends DwResponse {
}


export interface TriggerStopResponse extends DwResponse {
}


export interface SubTriggerFireResponse extends DwResponse {
  params: SubTriggerFireParams;
}

export interface SubTriggerFireParams {
  resultStatus: number;
  eventStatus: number;
  count: number;
  output: SubscribeDataParams[];
}

// Project

export interface ProjectListResponse extends DwResponse {
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

export interface ProjectStartResponse extends DwResponse { }

export interface ProjectStopResponse extends DwResponse { }

// Channel

export interface ChannelSubscribeResponse extends DwResponse {
  params: ChannelSubscribeParams;
}

export interface ChannelSubscribeParams {
  id: number;
}


export interface ChannelUnsubscribeResponse extends DwResponse {
}


export interface ChannelUnsubscribeAllResponse extends DwResponse {
}

// Diagnostics

export interface PingResponse extends DwResponse {
  params: PingParams;
}

export interface PingParams {
  pings: number[];
}

// SQLite

export interface SqlResponse extends DwResponse {
  params: SqlParams;
}

export interface SqlParams {
  columns: string[];
  count: number;
  results: any[];
  table: string;
}

// System

export interface ReferenceListResponse extends DwResponse {
  params: any;
}

export interface StagingFileListResponse extends DwResponse {
  params: StagingFileListParams;
}

export interface StagingFileListParams {
  files: StagingFile[];
}

export interface StagingFile {
  type: string;
  name: string;
  size: number;
  created: number;
  modified: number;
}
