import { NgModule } from '@angular/core';
import { DevicewiseAngularComponent } from './devicewise-angular.component';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [DevicewiseAngularComponent],
  imports: [
    HttpClientModule
  ],
  exports: [DevicewiseAngularComponent],
  providers: [CookieService]
})
export class DevicewiseAngularModule { }
