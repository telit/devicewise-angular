import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { AppMaterialModules } from './material.module';

import { DevicewiseAngularModule } from 'devicewise-angular';

import { AppComponent } from './app.component';
import { DevicewiseTestComponent, SettingsComponent } from './devicewise-test/devicewise-test.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { SideNavComponent } from './side-nav/side-nav.component';

import { SubTriggerPipe } from './devicewise-test/custom-pipes.pipe';

@NgModule({
    declarations: [
        AppComponent,
        DevicewiseTestComponent,
        NavBarComponent,
        SubTriggerPipe,
        SettingsComponent,
        FooterComponent,
        SideNavComponent
    ],
    imports: [
        DevicewiseAngularModule.forRoot(),
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        NgxJsonViewerModule,
        AppMaterialModules
    ],
    providers: [SubTriggerPipe, DevicewiseTestComponent],
    bootstrap: [AppComponent]
})
export class AppModule {}
