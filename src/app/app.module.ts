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
import {DragDropModule} from '@angular/cdk/drag-drop';

import { DevicewiseTestComponent, SettingsComponent } from './devicewise-test/devicewise-test.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubTriggerPipe } from './devicewise-test/custom-pipes.pipe';
import { FooterComponent } from './footer/footer.component';
import {NgxPageScrollModule} from 'ngx-page-scroll';
import { DevicewiseAngularModule } from 'devicewise-angular';
import { SideNavComponent } from './side-nav/side-nav.component';

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
  entryComponents: [SettingsComponent],
  imports: [
    DevicewiseAngularModule,
    DragDropModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPageScrollModule,
    MatIconModule,
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
    MatChipsModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatSidenavModule,
    MatToolbarModule
  ],
  providers: [SubTriggerPipe, DevicewiseTestComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
