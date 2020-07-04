import { Component, OnInit, ViewChild, Input, SimpleChange, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DwResponse, DevicewiseApiService } from 'devicewise-angular';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { interval, Subscription } from 'rxjs';

interface HashTable<T> {
  [key: number]: T;
}

export interface Device extends DwResponse.DwDevice {
}

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['select', 'name', 'type',  'state', 'lastStateChange', 'lastModified', 'status','exstatus'];
  dataSource: MatTableDataSource<Device>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  devices: DwResponse.DwDevice[];
  deviceTypes: HashTable<DwResponse.DeviceDataType> = {};
  selection = new SelectionModel<Device>(true, []);
  subscriptions: Subscription[] = [];
  private readonly refreshInterval = 5000;

  constructor(
    private dwApi: DevicewiseApiService
  ) {
    this.dataSource = new MatTableDataSource(this.devices);
  }

  ngOnInit() {
    this.dwApi.deviceTypeList().subscribe((deviceTypeResponse) => {
      deviceTypeResponse.params.deviceTypes.forEach((deviceType) => this.deviceTypes[deviceType.typeId] = deviceType);
      this.dwApi.deviceList().subscribe((devices) => {
        this.devices = devices.params.devices
        this.dataSource.data = this.devices;
        const sub = interval(this.refreshInterval).subscribe((x) => this.refreshDevices());
        this.subscriptions.push(sub);
      });
    });
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  refreshDevices() {
    this.dwApi.deviceList().subscribe((devices) => {
      devices.params.devices.forEach((device) => {
        let foundDevice = this.devices.find((d) => d.name === device.name);
        if (foundDevice) {
          Object.assign(foundDevice, device);
        } else {
          this.devices.push(device);
        }
      })
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Device): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name}`;
  }

  selectRow(row) {
    this.selection.toggle(row);
  }

  selectionStateNotEqual(state: number): boolean {
    if (!this.selection.hasValue()) return true;
    let isEqual = true;
    this.selection.selected.forEach((selected) => {
      if (selected.state != state) {
        isEqual = false;
        return;
      }
    });
    return isEqual;
  }

  startSelectedDevices() {
    this.selection.selected.forEach((selection) => this.startDevice(selection.name));
  }

  stopSelectedDevices() {
    this.selection.selected.forEach((selection) => this.stopDevice(selection.name));
  }

  startDevice(device: string) {
    let foundDevice = this.devices.find((d) => d.name === device);
    const lastState = foundDevice.state;
    foundDevice.state = 4;
    this.dwApi.deviceStart(device).subscribe((rsp) => {
      if (rsp.success) {
        foundDevice.state = 1;
      }
    }, err => foundDevice.state = lastState);
  }

  stopDevice(device: string) {
    let foundDevice = this.devices.find((d) => d.name === device);
    const lastState = foundDevice.state;
    foundDevice.state = 5;
    this.dwApi.deviceStop(device).subscribe((rsp) => {
      if (rsp.success) {
        foundDevice.state = 2;
      }
    }, err => foundDevice.state = lastState);
  }
}
