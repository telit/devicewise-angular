import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { DevicewiseAngularComponent } from './devicewise-angular.component';
import { DevicewiseAngularService } from './devicewise-angular.service';
import { DevicewiseApiService } from './devicewise-api.service';
import { DevicewiseSubscribeService } from './devicewise-subscribe.service';
import { DevicewiseMultisubscribeService } from './devicewise-multisubscribe.service';

@NgModule({
  declarations: [DevicewiseAngularComponent],
  imports: [
    HttpClientModule
  ],
  exports: [DevicewiseAngularComponent],
  providers: [CookieService, DevicewiseAngularService]
})
export class DevicewiseAngularModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DevicewiseAngularModule,
      providers: [
        DevicewiseAngularService,
        DevicewiseApiService,
        DevicewiseSubscribeService,
        DevicewiseMultisubscribeService
      ]
    };
  }
}
