import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { DevicewiseAngularComponent } from './devicewise-angular.component';

@NgModule({
  declarations: [DevicewiseAngularComponent],
  imports: [
    HttpClientModule
  ],
  exports: [DevicewiseAngularComponent],
  providers: [CookieService]
})
export class DevicewiseAngularModule { }
