import { Component, OnInit, Inject, Input, ElementRef, ViewChild } from '@angular/core';
import { DevicewiseAngularService } from 'devicewise-angular';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import * as DwResponse from 'devicewise-angular/lib/models/dwresponse';
import * as DwRequest from 'devicewise-angular/lib/models/dwresponse';
import * as DwSubscription from 'devicewise-angular/lib/models/dwsubscription';
import { BehaviorSubject, Subject } from 'rxjs';
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
import { FormControl, FormGroupDirective, NgForm, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { variable } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-devicewise-test',
  templateUrl: './devicewise-test.component.html',
  styleUrls: ['./devicewise-test.component.css'],
  providers: [SubTriggerPipe]
})
export class DevicewiseTestComponent implements OnInit {
  url = location.origin;
  loaded = false;
  loggedIn = false;
  username = '';
  panelOpenState = false;
  currentProject: string;
  currentDevice: string;
  currentVariableString: string;
  currentVariable: DwSubscription.Subscription;
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
  subscriptionResponses: DwSubscription.Subscription[] = [];
  subscriptionResponsesSubject: BehaviorSubject<DwSubscription.Subscription[]> = new BehaviorSubject([]);
  subTriggerVariables: DwRequest.SubTriggerVariable[] = [];
  subTriggerVariablesSubject: BehaviorSubject<DwRequest.SubTriggerVariable[]> = new BehaviorSubject([]);
  loginResponse;
  logoutResponse;
  readResponse;
  writeResponse;
  subscribeResponse;
  unsubscribeResponse;
  unsubscribeAllResponse;
  deviceInfoResponse;
  deviceStartResponse;
  deviceStopResponse;
  deviceListResponse;
  deviceDataTypeResponse;
  triggerListResponse;
  triggerStartResponse;
  triggerFireResponse;
  triggerStopResponse;
  subTriggerFireResponse;
  projectListResponse;
  projectStartResponse;
  projectStopResponse;
  pingResponse;
  sqlResponse;
  referenceListResponse;
  channelSubscribeResponse;
  channelUnsubscribeResponse;
  channelUnsubscribeAllResponse;

  objectKeys = Object.keys;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('subscriptionInput') subscriptionInput: ElementRef<HTMLInputElement>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  triggerFireFormControl = new FormControl('', [Validators.required]);

  constructor(
    private devicewise: DevicewiseAngularService,
    public snackBar: MatSnackBar,
    private subTriggerPipe: SubTriggerPipe,
    private bottomSheet: MatBottomSheet
  ) {}

  forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? { forbiddenName: { value: control.value } } : null;
    };
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.url = this.devicewise.getEndpoint();
    this.devicewise.setEndpoint('http://localhost:88');

    this.devicewise.ping('127.0.0.1', 4).subscribe(
      data => {
        if (!data.success) {
          this.loaded = true;
          this.openSnackBar('Welcome. Please login.', 'DISMISS');
          return;
        }
        this.loggedIn = true;
        this.loaded = true;
        this.openSnackBar('Welcome. You\'re already logged in!', 'DISMISS');

        this.refreshLists();
      },
      error => {
        this.loaded = true;
        this.openSnackError(error);
      }
    );
  }

  refreshLists() {
    this.devicewise.projectList().subscribe(data2 => {
      this.projects.next(data2.params.projects);
    });

    // this.devicewise.triggerList(this.currentProject).subscribe((data2) => {
    //   this.triggers.next(data2.params.triggers);
    // });

    this.devicewise.deviceList().subscribe(data2 => {
      this.devices.next(data2.params.devices);
    });

    // setInterval(() => {
    //   this.devicewise.deviceList().subscribe(data2 => {
    //     this.devices.next(data2.params.devices);
    //   });
    // }, 10000);
  }

  login(endpoint: string, username: string, password: string) {
    this.devicewise.login(endpoint, username, password).subscribe(
      data => {
        this.username = username;
        this.loginResponse = data;
        if (data.success) {
          this.loggedIn = true;
          this.openSnackBar('Welcome. You\'re logged in as ' + username + '!', 'DISMISS');
          this.refreshLists();
        }
      },
      error => {
        this.openSnackError(error);
      }
    );
  }

  logout() {
    this.devicewise.logout().subscribe(
      data => {
        this.logoutResponse = data;
        if (data.success) {
          this.loggedIn = false;
        }
      },
      error => this.openSnackError(error)
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

    this.devicewise.read(device, variable, type, count, length).subscribe(
      data => {
        this.readResponse = data;
      },
      error => this.openSnackError(error)
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

    this.devicewise.write(device, variable, type, count, length, varData).subscribe(
      data => {
        this.writeResponse = data;
      },
      error => this.openSnackError(error)
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

  subscribe(device, variable, rate?, type?, count?, length?) {
    const subscription: Subject<DwResponse.Subscription> = new Subject();

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

    this.devicewise.subscribe(device, variable, rate, type, count, length).subscribe(
      data => {
        this.subscribeResponse = data;
        if (!data.success) {
          return;
        }
        this.subscriptionResponses.push({
          request: {
            command: 'variable.subscribe',
            params: {
              device: device,
              variable: variable,
              type: type,
              count: count,
              length: length
            }
          },
          response: data,
          subscription: subscription
        });
        this.subscriptionResponsesSubject.next(this.subscriptionResponses);
        this.openSnackBar('Subscription to ' + variable + ' successful!', 'DISMISS');
      },
      error => this.openSnackError(error)
    );
  }

  // subscribeCurrentVariable(device?, variable?) {
  //   const subscription: Subject<DwResponse.Subscription> = new Subject();
  //   const type = this.dwTypeToNumber(this.selectedVariable.type);
  //   const count = this.selectedVariable.xdim ? this.selectedVariable.xdim : 1;
  //   const length = this.selectedVariable.length ? this.selectedVariable.length : -1;
  //   this.devicewise.subscribe(device, variable, 1, type, count, length).subscribe(
  //     data => {
  //       this.subscribeResponse = data;
  //       if (!data.success) {
  //         return;
  //       }
  //       this.subscriptionResponses.push({
  //         request: {
  //           command: 'variable.subscribe',
  //           params: {
  //             device: device,
  //             variable: variable,
  //             type: String(type),
  //             count: String(count),
  //             length: String(length)
  //           }
  //         },
  //         response: data,
  //         subscription: subscription
  //       });
  //       this.subscriptionResponsesSubject.next(this.subscriptionResponses);
  //     },
  //     error => this.openSnackError(error)
  //   );
  // }

  unsubscribe(id) {
    this.devicewise.unsubscribe(id).subscribe(
      data => {
        this.unsubscribeResponse = data;
        if (!data.success) {
          return;
        }

        let removeIndex = 0;
        if (
          this.subscriptionResponses.find((subscription, subscriptionResponseIndex) => {
            if (subscription.response.params.id === id) {
              removeIndex = subscriptionResponseIndex;
              return true;
            }
          })
        ) {
          this.subscriptionResponses.splice(removeIndex, 1);
          this.subscriptionResponsesSubject.next(this.subscriptionResponses);
        }
      },
      error => this.openSnackError(error)
    );
  }

  unsubscribeAll() {
    this.devicewise.unsubscribeAll().subscribe(
      data => {
        this.unsubscribeAllResponse = data;
        if (!data.success) {
          return;
        }
        this.subscriptionResponses = [];
        this.subscriptionResponsesSubject.next(this.subscriptionResponses);
      },
      error => this.openSnackError(error)
    );
  }

  listDevices() {
    this.devicewise.deviceList().subscribe(
      data => {
        this.devices.next(data.params.devices);
        this.deviceListResponse = data;
      },
      error => this.openSnackError(error)
    );
  }

  deviceTypeList() {
    this.devicewise.deviceTypeList().subscribe(
      data => {
        this.deviceDataTypeResponse = data;
      },
      error => this.openSnackError(error)
    );
  }

  deviceInfo(device: string, options: number) {
    this.devicewise.deviceInfo(device, Number(options)).subscribe(
      data => {
        this.deviceInfoResponse = data;
      },
      error => this.openSnackError(error)
    );
  }

  startDevice(device: string) {
    this.devicewise.deviceStart(device).subscribe(
      data => {
        this.deviceStartResponse = data;
      },
      error => this.openSnackError(error)
    );
  }

  stopDevice(device: string) {
    this.devicewise.deviceStop(device).subscribe(
      data => {
        this.deviceStopResponse = data;
      },
      error => this.openSnackError(error)
    );
  }

  triggerList(project?: string) {
    if (!project) {
      project = this.currentProject;
    }
    return this.devicewise.triggerList(project).subscribe(
      data => {
        this.triggerListResponse = data;
        if (!data.success) {
          this.triggers.next([]);
          return;
        }
        this.triggers.next(data.params.triggers);
      },
      error => this.openSnackError(error)
    );
  }

  triggerStart(project: string, trigger: string) {
    return this.devicewise.triggerStart(project, trigger).subscribe(
      data => {
        this.triggerStartResponse = data;
      },
      error => this.openSnackError(error)
    );
  }

  triggerFire(project: string, trigger: string) {
    return this.devicewise.triggerFire(project, trigger).subscribe(
      data => {
        this.triggerFireResponse = data;
      },
      error => this.openSnackError(error)
    );
  }

  triggerStop(project: string, trigger: string) {
    return this.devicewise.triggerStop(project, trigger).subscribe(
      data => {
        this.triggerStopResponse = data;
      },
      error => this.openSnackError(error)
    );
  }

  subTriggerFire(project: string, trigger: string, reporting: boolean, input: { name: string; value: string }[]) {
    console.log(project, trigger, reporting, input);
    return this.devicewise.subTriggerFire(project, trigger, reporting, input).subscribe(
      data => {
        this.subTriggerFireResponse = data;
      },
      error => this.openSnackError(error)
    );
  }

  subTriggerAddVariable(variableName: string, variableData: any) {
    console.log(variableName, variableData);
    this.subTriggerVariables.push({name: variableName, data: variableData});
    this.subTriggerVariablesSubject.next(this.subTriggerVariables);
  }

  projectList() {
    return this.devicewise.projectList().subscribe(
      data => {
        this.projectListResponse = data;
        if (!data.success) {
          return;
        }
        this.projects.next(data.params.projects);
      },
      error => this.openSnackError(error)
    );
  }

  projectStart(name) {
    return this.devicewise.projectStart(name).subscribe(
      data => {
        this.projectStartResponse = data;
      },
      error => this.openSnackError(error)
    );
  }

  projectStop(name) {
    return this.devicewise.projectStop(name).subscribe(
      data => {
        this.projectStopResponse = data;
      },
      error => this.openSnackError(error)
    );
  }

  // Channel

  channelSubscribe(channel) {
    this.devicewise.channelSubscribe(channel).subscribe(
      data => {
        this.channelSubscribeResponse = data;
      },
      error => this.openSnackError(error)
    );
  }

  channelUnsubscribe(id) {
    this.devicewise.channelUnsubscribe(id).subscribe(
      data => {
        this.channelUnsubscribeResponse = data;
      },
      error => this.openSnackError(error)
    );
  }

  channelUnsubscribeAll() {
    this.devicewise.channelUnsubscribeAll().subscribe(
      data => {
        this.channelUnsubscribeAllResponse = data;
      },
      error => this.openSnackError(error)
    );
  }

  // Diagnostic

  ping(address: string, count: number) {
    this.devicewise.ping(address, count).subscribe(
      data => {
        this.pingResponse = data;
        if (data.success) {
          this.loggedIn = true;
        }
      },
      error => this.openSnackError(error)
    );
  }

  // System

  referenceList(type: string, source: string, direction: string) {
    this.devicewise.referenceList(type, source, direction).subscribe(
      data => {
        this.referenceListResponse = data;
      },
      error => this.openSnackError(error)
    );
  }

  // SQLite

  sqlQuery(query: string) {
    this.devicewise.sql(query).subscribe(
      data => {
        this.sqlResponse = data;
        this.displayedColumns = data.params.columns;
        this.dataSource.data = data.params.results;
        this.paginator._changePageSize(this.paginator.pageSize);
      },
      error => this.openSnackError(error)
    );
  }

  // Other

  openSettings(): void {
    console.log('selection!');
    this.deviceSelection.subscribe(data => console.log(data));
    this.variableSelection.subscribe(data => console.log(data));
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

    this.devicewise.deviceInfo(this.currentDevice, 2).subscribe(
      data => {
        console.log(data.params);
        this.variables.next(data.params.variableInfo);
      },
      error => this.openSnackError(error)
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

    console.log(error);
    if (error.error.errorMessages) {
      message = 'ERROR: ' + error.error.errorMessages;
    } else if (error.message) {
      message = 'ERROR: ' + error.message;
    } else {
      message = 'ERROR: Unknown';
    }
    this.snackBar.open(message, 'Acknowledge', {
      duration: 10000
    });
  }

  dwTypeToNumber(dwType: string) {
    switch (dwType) {
      case 'INT1':
        return 1;
      case 'INT2':
        return 2;
      case 'INT4':
        return 3;
      case 'INT8':
        return 4;
      case 'UINT1':
        return 5;
      case 'UINT2':
        return 6;
      case 'UINT4':
        return 7;
      case 'UINT8':
        return 8;
      case 'FLOAT4':
        return 9;
      case 'FLOAT8':
        return 10;
      case 'BOOL':
        return 1;
      case 'STRING':
        return 16;
      default:
        return 0;
    }
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
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
  ) {
    console.log(data.deviceSelection.getValue());
    console.log(data.variableSelection.getValue());
  }

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
