import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  DevicewiseAngularService,
  DevicewiseApiService,
  DevicewiseSubscribeService,
  DevicewiseMultisubscribeService,
  DwRequest,
  DwResponse,
  DwSubscription,
  DwType,
  Variable
} from 'devicewise-angular';
import { BehaviorSubject, forkJoin } from 'rxjs';
import {
  MatBottomSheet,
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
  MatSnackBar,
  MatPaginator,
  MatTableDataSource,
  MatAutocompleteSelectedEvent
} from '@angular/material';
import { SubTriggerPipe } from './custom-pipes.pipe';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-devicewise-test',
  templateUrl: './devicewise-test.component.html',
  styleUrls: ['./devicewise-test.component.css'],
  providers: [SubTriggerPipe]
})
export class DevicewiseTestComponent implements OnInit {
  url: string;
  loaded = false;
  loggedIn = false;
  username = '';
  panelOpenState = false;
  currentProject: string;
  currentDevice: string;
  currentVariableString: string;
  currentVariable: DwSubscription;
  deviceSelection: BehaviorSubject<boolean> = new BehaviorSubject(true);
  variableSelection: BehaviorSubject<boolean> = new BehaviorSubject(true);
  subscriptionSelection: BehaviorSubject<boolean> = new BehaviorSubject(true);
  triggerSelection: BehaviorSubject<boolean> = new BehaviorSubject(true);
  projectSelection: BehaviorSubject<boolean> = new BehaviorSubject(true);
  devices: BehaviorSubject<DwResponse.DeviceType[]> = new BehaviorSubject([]);
  triggers: BehaviorSubject<DwResponse.TriggerListTrigger[]> = new BehaviorSubject([]);
  projects: BehaviorSubject<DwResponse.ProjectListProject[]> = new BehaviorSubject([]);
  variables: BehaviorSubject<DwResponse.DeviceInfoVariable[]> = new BehaviorSubject([]);
  selectedVariable: DwResponse.DeviceInfoVariable;
  // subscriptionResponses: DwSubscription[] = [];
  // subscriptionResponsesSubject: BehaviorSubject<DwSubscription[]> = new BehaviorSubject([]);
  subTriggerVariables: any[] = [];
  subTriggerVariablesSubject: BehaviorSubject<any[]> = new BehaviorSubject([]);
  subscriptions = {};
  subscriptionsSubject: BehaviorSubject<{}> = new BehaviorSubject({});
  multiSubscribeVariables: Variable[] = [];
  multiSubsciptionsSubject: BehaviorSubject<{}> = new BehaviorSubject({});
  loginResponse;
  logoutResponse;
  readResponse;
  writeResponse;
  subscribeResponse;
  unsubscribeResponse;
  unsubscribeAllResponse;
  multiSubscribeResponse;
  deviceInfoResponse;
  deviceStartName;
  deviceStartResponse;
  deviceStopResponse;
  deviceListResponse;
  deviceDataTypeResponse;
  triggerListResponse;
  triggerStartResponse;
  triggerFireResponse;
  triggerStopResponse;
  subTriggerFireResponse;
  actionTypeResponse: DwResponse.ActionTypeList;
  eventTypeResponse: DwResponse.EventTypeList;
  projectListResponse;
  projectStartResponse;
  projectStopResponse;
  pingResponse;
  sqlResponse;
  referenceListResponse;
  channelSubscribeResponse;
  channelUnsubscribeResponse;
  channelUnsubscribeAllResponse;
  private messageCount = 0;
  private time = 0;

  objectKeys = Object.keys;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('subscriptionInput', { static: false }) subscriptionInput: ElementRef<HTMLInputElement>;
  @ViewChild('multiSubscribeInput', { static: false }) multiSubscribeInput: ElementRef<HTMLInputElement>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor(
    private devicewise: DevicewiseAngularService,
    private dwApi: DevicewiseApiService,
    private dwSubscribe: DevicewiseSubscribeService,
    private dwMultiSubscribe: DevicewiseMultisubscribeService,
    public snackBar: MatSnackBar,
    private bottomSheet: MatBottomSheet
  ) { }

  ngOnInit() {
    this.url = location.origin;
    // this.url = '';
    this.dataSource.paginator = this.paginator;
    this.devicewise.easyLogin(this.url, '', '').subscribe((login) => {
      console.log('logged in!');
      this.loaded = true;
      if (!login.success) {
        return;
      }
      this.loggedIn = true;
      this.refreshLists();
    }, (error) => {
      this.loaded = true;
    });
  }

  refreshLists() {
    this.dwApi.projectList().subscribe(data2 => {
      this.projects.next(data2.params.projects);
    });

    this.dwApi.deviceList().subscribe(data2 => {
      this.devices.next(data2.params.devices);
    });

    // const observables = [this.dwApi.projectList(), this.dwApi.deviceList()];
    // return forkJoin(observables).pipe(
    //   tap((response) => {
    //     this.projects.next(response[0].params.projects);
    //     this.devices.next(response[1].params.devices);
    //   })
    // )
  }

  login(endpoint: string, username: string, password: string) {
    this.devicewise.easyLogin(endpoint, username, password).subscribe((login) => {
      if (!login.success) {
        return;
      }
      this.loggedIn = true;
      this.openSnackBar('Welcome. You\'re logged in as ' + username + '!', 'DISMISS');
      this.refreshLists();
    }, (error) => {
      this.openSnackError(error);
    });
  }

  logout() {
    this.dwApi.logout().subscribe(
      (data) => {
        this.logoutResponse = data;
        if (data.success) {
          this.loggedIn = false;
        }
      },
      (error) => this.openSnackError(error)
    );
  }

  read(device, variable, type?, count?, length?) {
    if (!type) {
      type = this.dwTypeToNumber(this.selectedVariable.type);
    }
    if (!count) {
      count = this.selectedVariable.xdim ? this.selectedVariable.xdim : 1;
    }
    if (!length) {
      length = this.selectedVariable.length ? this.selectedVariable.length : -1;
    }

    this.dwApi.read(device, variable, type, count, length).subscribe(
      (data) => {
        this.readResponse = data;
      },
      (error) => this.openSnackError(error)
    );
  }

  write(device, variable, type?, count?, length?, varData?) {
    if (!type) {
      type = this.dwTypeToNumber(this.selectedVariable.type);
    }
    if (!count) {
      count = this.selectedVariable.xdim ? this.selectedVariable.xdim : 1;
    }
    if (!length) {
      length = this.selectedVariable.length ? this.selectedVariable.length : -1;
    }
    if (!varData) {
      return -1;
    }

    this.dwApi.write(device, variable, type, count, length, varData).subscribe(
      (data) => {
        this.writeResponse = data;
      },
      (error) => this.openSnackError(error)
    );
  }

  subVariableSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedVariable = this.variables.getValue().find((variable, varIndex) => {
      return event.option.viewValue === variable.name;
    });
    let count = this.selectedVariable.xdim * this.selectedVariable.ydim * this.selectedVariable.zdim;
    if (!count) {
      count = 1;
    }
    let length = this.selectedVariable.length;
    if (!length) {
      length = -1;
    }

    this.subscribe(this.currentDevice, event.option.viewValue, 1, this.dwTypeToNumber(this.selectedVariable.type), count, length);
    this.subscriptionInput.nativeElement.value = '';
  }

  multiSubscibeVariableSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedVariable = this.variables.getValue().find((variable, varIndex) => {
      return event.option.viewValue === variable.name;
    });
    let count = this.selectedVariable.xdim * this.selectedVariable.ydim * this.selectedVariable.zdim;
    if (!count) {
      count = 1;
    }
    let length = this.selectedVariable.length;
    if (!length) {
      length = -1;
    }

    this.multiSubscribe(this.currentDevice, event.option.viewValue, 1, this.dwTypeToNumber(this.selectedVariable.type), count, length);
    this.multiSubscribeInput.nativeElement.value = '';
  }

  subscribe(device, variable, rate?, type?, count?, length?) {
    if (!type) {
      type = this.dwTypeToNumber(this.selectedVariable.type);
    }
    if (!count) {
      count = this.selectedVariable.xdim ? this.selectedVariable.xdim : 1;
    }
    if (!length) {
      length = this.selectedVariable.length ? this.selectedVariable.length : -1;
    }
    if (!rate) {
      rate = 1;
    }

    const newSubscription = new DwSubscription(device, variable, type, count, length);

    this.dwSubscribe.getSubscription(newSubscription).subscribe((data) => {
      this.subscribeResponse = data;
      if (!data.success) {
        this.openSnackBar('Subscription to ' + variable + ' failed! ' + data.errorMessages[0], 'DISMISS');
        return;
      }

      const start = new Date();
      this.time = start.getTime();
      console.log('Started... ', this.time);

      setInterval(() => {
        const now = new Date();
        const now_time = now.getTime();
        const elapsed = now_time - this.time;
        const secs_elapsed = elapsed / 1000;
        const msg_p_sec = this.messageCount / secs_elapsed;
        console.log('Time Elapsed:', secs_elapsed, ' - Messages Per Second:', msg_p_sec);
      }, 5000);

      this.openSnackBar('Subscription to ' + variable + ' successful!', 'DISMISS');
      this.subscriptions[data.params.id] = newSubscription;
      this.subscriptionsSubject.next(this.subscriptions);

      newSubscription.subscription.subscribe(() => {
        this.messageCount++;
      });

      this.dwSubscribe.getNotifications();
    },
      (error) => this.openSnackError(error)
    );
  }

  multiSubscribe(device, variable, rate?, type?, count?, length?) {
    if (!type) {
      type = this.dwTypeToNumber(this.selectedVariable.type);
    }
    if (!count) {
      count = this.selectedVariable.xdim ? this.selectedVariable.xdim : 1;
    }
    if (!length) {
      length = this.selectedVariable.length ? this.selectedVariable.length : -1;
    }
    if (!rate) {
      rate = 1;
    }

    const newSubscription: Variable = {
      device: device,
      variable: variable,
      type: type,
      count: count,
      length: length,
  };
    this.multiSubscribeVariables.push(newSubscription);

    this.dwMultiSubscribe.multiSubscribe(this.multiSubscribeVariables).subscribe((data) => {
    }, (error) => this.openSnackError(error)
    );
  }

  startSubscriptions() {
    this.dwSubscribe.getNotifications();
  }

  stopSubscriptions() {
    this.dwSubscribe.abortNotifications();
  }

  unsubscribe(id) {
    this.dwSubscribe.unsubscribe(id).subscribe(
      (data) => {
        this.unsubscribeResponse = data;
        if (!data.success) {
          return;
        }

        if (this.subscriptions[id]) {
          delete this.subscriptions[id];
          this.subscriptionsSubject.next(this.subscriptions);
        }
      },
      (error) => this.openSnackError(error)
    );
  }

  unsubscribeAll() {
    this.dwSubscribe.unsubscribeAll().subscribe(
      (data) => {
        this.unsubscribeAllResponse = data;
        if (!data.success) {
          return;
        }
        this.subscriptions = {};
        this.subscriptionsSubject.next(this.subscriptions);
      },
      (error) => this.openSnackError(error)
    );
  }

  listDevices() {
    this.dwApi.deviceList().subscribe(
      (data) => {
        this.devices.next(data.params.devices);
        this.deviceListResponse = data;
      },
      (error) => this.openSnackError(error)
    );
  }

  deviceTypeList() {
    this.dwApi.deviceTypeList().subscribe(
      (data) => {
        this.deviceDataTypeResponse = data;
      },
      (error) => this.openSnackError(error)
    );
  }

  deviceInfo(device: string, options: number) {
    this.dwApi.deviceInfo(device, Number(options)).subscribe(
      (data) => {
        this.deviceInfoResponse = data;
      },
      (error) => this.openSnackError(error)
    );
  }

  startDevice(device: string) {
    this.dwApi.deviceStart(device).subscribe(
      (data) => {
        this.deviceStartResponse = data;
      },
      (error) => this.openSnackError(error)
    );
  }

  stopDevice(device: string) {
    this.dwApi.deviceStop(device).subscribe(
      (data) => {
        this.deviceStopResponse = data;
      },
      (error) => this.openSnackError(error)
    );
  }

  triggerList(project?: string) {
    if (!project) {
      project = this.currentProject;
    }
    return this.dwApi.triggerList(project).subscribe(
      (data) => {
        this.triggerListResponse = data;
        if (!data.success) {
          this.triggers.next([]);
          return;
        }
        this.triggers.next(data.params.triggers);
      },
      (error) => this.openSnackError(error)
    );
  }

  triggerStart(project: string, trigger: string) {
    return this.dwApi.triggerStart(project, trigger).subscribe(
      (data) => {
        this.triggerStartResponse = data;
      },
      (error) => this.openSnackError(error)
    );
  }

  triggerFire(project: string, trigger: string) {
    return this.dwApi.triggerFire(project, trigger).subscribe(
      (data) => {
        this.triggerFireResponse = data;
      },
      (error) => this.openSnackError(error)
    );
  }

  triggerStop(project: string, trigger: string) {
    return this.dwApi.triggerStop(project, trigger).subscribe(
      (data) => {
        this.triggerStopResponse = data;
      },
      (error) => this.openSnackError(error)
    );
  }

  subTriggerFire(project: string, trigger: string, reporting: boolean, input?: any[]) {
    if (!input) {
      input = this.subTriggerVariables;
    }
    return this.dwApi.subTriggerFire(project, trigger, reporting, input).subscribe(
      (data) => {
        this.subTriggerFireResponse = data;
      },
      (error) => this.openSnackError(error)
    );
  }

  subTriggerAddVariable(variableName: string, variableData: any) {
    const newVariable = {};
    newVariable[variableName] = variableData;
    this.subTriggerVariables.push(newVariable);
    this.subTriggerVariablesSubject.next(this.subTriggerVariables);
  }

  subTriggerRemoveVariable(variableName: string) {
    this.subTriggerVariables.splice(
      this.subTriggerVariables.findIndex(variable => {
        return Object.keys(variable)[0] === variableName;
      }),
      1
    );
    this.subTriggerVariablesSubject.next(this.subTriggerVariables);
  }

  actionTypeList() {
    this.dwApi.actionTypeList().subscribe(
      (data) => {
        this.actionTypeResponse = data;
      },
      (error) => this.openSnackError(error)
    );
  }

  eventTypeList() {
    this.dwApi.eventTypeList().subscribe(
      (data) => {
        this.eventTypeResponse = data;
      },
      (error) => this.openSnackError(error)
    );
  }

  projectList() {
    return this.dwApi.projectList().subscribe(
      (data) => {
        this.projectListResponse = data;
        if (!data.success) {
          return;
        }
        this.projects.next(data.params.projects);
      },
      (error) => this.openSnackError(error)
    );
  }

  projectStart(name) {
    return this.dwApi.projectStart(name).subscribe(
      (data) => {
        this.projectStartResponse = data;
      },
      (error) => this.openSnackError(error)
    );
  }

  projectStop(name) {
    return this.dwApi.projectStop(name).subscribe(
      (data) => {
        this.projectStopResponse = data;
      },
      (error) => this.openSnackError(error)
    );
  }

  // Channel

  channelSubscribe(channel) {
    this.dwApi.channelSubscribe(channel).subscribe(
      (data) => {
        this.channelSubscribeResponse = data;
      },
      (error) => this.openSnackError(error)
    );
  }

  channelUnsubscribe(id) {
    this.dwApi.channelUnsubscribe(id).subscribe(
      (data) => {
        this.channelUnsubscribeResponse = data;
      },
      (error) => this.openSnackError(error)
    );
  }

  channelUnsubscribeAll() {
    this.dwApi.channelUnsubscribeAll().subscribe(
      (data) => {
        this.channelUnsubscribeAllResponse = data;
      },
      (error) => this.openSnackError(error)
    );
  }

  // Diagnostic

  ping(address: string, count: number) {
    this.dwApi.ping(address, count).subscribe(
      (data) => {
        this.pingResponse = data;
        if (data.success) {
          this.loggedIn = true;
        }
      },
      (error) => this.openSnackError(error)
    );
  }

  // System

  referenceList(type: string, source: string, direction: string) {
    this.dwApi.referenceList(type, source, direction).subscribe(
      (data) => {
        this.referenceListResponse = data;
      },
      (error) => this.openSnackError(error)
    );
  }

  // SQLite

  sqlQuery(query: string) {
    this.dwApi.sql(query).subscribe(
      (data) => {
        this.sqlResponse = data;
        this.displayedColumns = data.params.columns;
        this.dataSource.data = data.params.results;
        this.paginator._changePageSize(this.paginator.pageSize);
      },
      (error) => this.openSnackError(error)
    );
  }

  // Other

  openSettings(): void {
    this.bottomSheet.open(SettingsComponent, {
      data: {
        deviceSelection: this.deviceSelection,
        variableSelection: this.variableSelection,
        projectSelection: this.projectSelection,
        triggerSelection: this.triggerSelection
      }
    });
  }

  changeDevice(input) {
    this.currentDevice = input.value;

    this.dwApi.deviceInfo(this.currentDevice, 2).subscribe((data) => {
      console.log(data);
      if (!data.params.variableInfo) {
        this.variables.next([]);
      } else {
        const filteredData = data.params.variableInfo.filter((value) => !value.structId);
        this.variables.next(filteredData);
      }
    }, (error) => this.openSnackError(error)
    );
  }

  changeProject(input) {
    this.currentProject = input.value;
    this.triggerList();
  }

  changeVariable(input) {
    this.currentVariableString = input.value;
    this.selectedVariable = this.variables.getValue().find((variable, varIndex) => {
      return input.value === variable.name;
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }

  openSnackError(error: any) {
    let message = '';

    if (error.error.errorMessages) {
      message = 'ERROR: ' + error.error.errorMessages;
    } else if (error.message) {
      message = 'ERROR: ' + error.message;
    } else {
      message = 'ERROR: Unknown';
    }
    this.snackBar.open(message, 'ACKNOWLEDGE', {
      duration: 10000
    });
  }

  dwTypeToNumber(dwType: string) {
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
}

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.html',
  styles: ['form > * { width:100%; }']
})
export class SettingsComponent {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private devicewiseTestComponent: DevicewiseTestComponent,
    private bottomSheetRef: MatBottomSheetRef<SettingsComponent>
  ) { }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

  changeDeviceInput(input) {
    if (input.value === 'manual') {
      this.devicewiseTestComponent.openSnackBar('Device input method changed to manual.', 'DISMISS');
      this.data.deviceSelection.next(false);
      this.data.variableSelection.next(false);
    } else if (input.value === 'selection') {
      this.devicewiseTestComponent.listDevices();
      this.devicewiseTestComponent.openSnackBar('Device input method changed to selection.', 'DISMISS');
      this.data.deviceSelection.next(true);
    }
  }
  changeVariableInput(input) {
    if (input.value === 'manual') {
      this.devicewiseTestComponent.openSnackBar('Variable input method changed to manual.', 'DISMISS');
      this.data.variableSelection.next(false);
    } else if (input.value === 'selection') {
      if (this.data.deviceSelection.getValue() === false) {
        return;
      }
      this.devicewiseTestComponent.listDevices();
      this.devicewiseTestComponent.openSnackBar('Variable input method changed to selection.', 'DISMISS');
      this.data.variableSelection.next(true);
    }
  }

  changeProjectInput(input) {
    if (input.value === 'manual') {
      this.devicewiseTestComponent.openSnackBar('Project input method changed to manual.', 'DISMISS');
      this.data.projectSelection.next(false);
      this.data.triggerSelection.next(false);
    } else if (input.value === 'selection') {
      this.devicewiseTestComponent.projectList();
      this.devicewiseTestComponent.openSnackBar('Project input method changed to selection.', 'DISMISS');
      this.data.projectSelection.next(true);
    }
  }

  changeTriggerInput(input) {
    if (input.value === 'manual') {
      this.devicewiseTestComponent.openSnackBar('Trigger input method changed to manual.', 'DISMISS');
      this.data.triggerSelection.next(false);
    } else if (input.value === 'selection') {
      if (this.data.projectSelection.getValue() === false) {
        return;
      }
      this.devicewiseTestComponent.triggerList();
      this.devicewiseTestComponent.openSnackBar('Trigger input method changed to selection.', 'DISMISS');
      this.data.triggerSelection.next(true);
    }
  }
}
