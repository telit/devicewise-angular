import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DevicewiseAngularModule } from 'devicewise-angular';

import { environment } from '../environments/environment';
import { AppMaterialModules } from './material.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Unauthorized } from './unauthorized';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProjectsComponent } from './projects/projects.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { DeviceCardsComponent } from './device-cards/device-cards.component';
import { DeviceStatePipe } from './pipes/device-state.pipe';
import { DeviceComponent } from './device/device.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    HomeComponent,
    PageNotFoundComponent,
    ProjectsComponent,
    DeviceListComponent,
    DeviceCardsComponent,
    DeviceStatePipe,
    DeviceComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppMaterialModules,
    DevicewiseAngularModule.forRoot(),
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: Unauthorized, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule {}
