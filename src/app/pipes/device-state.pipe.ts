import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deviceState'
})
export class DeviceStatePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    switch(value) {
      case 1:
        return 'Started'
      case 2:
        return 'Stopped'
      case 3:
        return 'Disabled'
      case 4:
        return 'Starting'
      case 5:
        return 'Stopping'
      default:
        return 'Unknown'
    }
    return null;
  }

}
