import { Component, OnInit, OnDestroy } from '@angular/core';
import { DwResponse, DevicewiseApiService } from 'devicewise-angular';
import { Subscription } from 'rxjs';

interface HashTable<T> {
  [key: number]: T;
}

@Component({
  selector: 'app-device-cards',
  templateUrl: './device-cards.component.html',
  styleUrls: ['./device-cards.component.css']
})
export class DeviceCardsComponent implements OnInit, OnDestroy {
  devices: DwResponse.DwDevice[];
  // deviceTypes: DwResponse.DeviceDataType[];
  deviceTypes: HashTable<DwResponse.DeviceDataType> = {};
  subscriptions: Subscription[] = [];
  private readonly refreshInterval = 5000;

  constructor(
    private dwApi: DevicewiseApiService
  ) { }

  ngOnInit(): void {
    this.dwApi.deviceTypeList().subscribe((deviceTypeResponse) => {
      deviceTypeResponse.params.deviceTypes.forEach((deviceType) => this.deviceTypes[deviceType.typeId] = deviceType);
      this.dwApi.deviceList().subscribe((devices) => {
        this.devices = devices.params.devices
        // const sub = interval(this.refreshInterval).subscribe((x) => this.refreshDevices());
        // this.subscriptions.push(sub);
      });
    });
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
