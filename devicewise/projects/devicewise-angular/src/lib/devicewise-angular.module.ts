import { NgModule } from '@angular/core';
import { DevicewiseAngularComponent } from './devicewise-angular.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [DevicewiseAngularComponent],
  imports: [
    HttpClientModule
  ],
  exports: [DevicewiseAngularComponent]
})
export class DevicewiseAngularModule { }
