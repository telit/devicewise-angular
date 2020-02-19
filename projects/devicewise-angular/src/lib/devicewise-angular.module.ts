import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { DevicewiseAuthService } from './devicewise-auth.service';
import { DevicewiseApiService } from './devicewise-api.service';
import { DevicewiseSubscribeService } from './devicewise-subscribe.service';
import { DevicewiseMultisubscribeService } from './devicewise-multisubscribe.service';
import { DevicewiseMultisubscribeStoreService } from './devicewise-multisubscribe-store.service';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule
  ],
  exports: [],
  providers: [CookieService, DevicewiseAuthService]
})
export class DevicewiseAngularModule {
  static forRoot(): ModuleWithProviders<DevicewiseAngularModule> {
    return {
      ngModule: DevicewiseAngularModule,
      providers: [
        DevicewiseAuthService,
        DevicewiseApiService,
        DevicewiseSubscribeService,
        DevicewiseMultisubscribeService,
        DevicewiseMultisubscribeStoreService
      ]
    };
  }
}
