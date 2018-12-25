import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatInputModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatButtonModule,
  MatSelectModule,
  MatExpansionModule,
  MatCardModule,
  MatPaginatorModule,
  MatTableModule,
  MatBottomSheetModule,
  MatDividerModule,
  MatListModule,
  MatIconModule,
  MatChipsModule,
  MatAutocompleteModule,
  MatRadioModule,
  MatFormFieldModule,
  MatSidenavModule,
  MatToolbarModule
} from '@angular/material';
import { DevicewiseTestComponent, SettingsComponent } from './devicewise-test/devicewise-test.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubTriggerPipe } from './devicewise-test/custom-pipes.pipe';
import { FooterComponent } from './footer/footer.component';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { DevicewiseAngularModule } from 'devicewise-angular';

@NgModule({
  declarations: [AppComponent, DevicewiseTestComponent, NavBarComponent, SubTriggerPipe, SettingsComponent, FooterComponent],
  entryComponents: [SettingsComponent],
  imports: [
    DevicewiseAngularModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPageScrollModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    HttpClientModule,
    MatExpansionModule,
    MatSnackBarModule,
    NgxJsonViewerModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatBottomSheetModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatSidenavModule,
    MatToolbarModule
  ],
  providers: [SubTriggerPipe, DevicewiseTestComponent, NgxPageScrollModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
