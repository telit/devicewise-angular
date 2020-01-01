import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { DevicewiseAngularService } from './devicewise-angular.service';
import { DevicewiseApiService } from './devicewise-api.service';
import { DevicewiseSubscribeService } from './devicewise-subscribe.service';
import { DevicewiseMultisubscribeService } from './devicewise-multisubscribe.service';
import { DevicewiseMultisubscribeNewService } from './devicewise-multisubscribe-new.service';
import { DevicewiseMultisubscribeStoreService } from './devicewise-multisubscribe-store.service';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule
  ],
  exports: [],
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
        DevicewiseMultisubscribeService,
        DevicewiseMultisubscribeNewService,
        DevicewiseMultisubscribeStoreService
      ]
    };
  }
}
