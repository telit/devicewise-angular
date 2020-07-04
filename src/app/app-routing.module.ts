import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from "./auth.guard";
import { HomeComponent } from './home/home.component';
import { DevicesComponent } from './devices/devices.component';
import { ProjectsComponent } from './projects/projects.component';
import { DeviceCardsComponent } from './device-cards/device-cards.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { DeviceComponent } from './device/device.component';

const routes: Routes = [


{ path: 'login', component: LoginComponent },
{
  path: '', component: MainComponent, canActivate: [AuthGuard],
  children: [
    { path: '', redirectTo: 'device', pathMatch: 'prefix' },
    { path: 'home', component: HomeComponent },
    {
      path: 'device', component: DeviceComponent, children: [
        { path: '', redirectTo: 'list', pathMatch: 'prefix' },
        { path: 'list', component: DeviceListComponent },
        { path: 'cards', component: DeviceCardsComponent },
      ]
    },
    {
      path: 'project', component: ProjectsComponent, children: [
        { path: '', redirectTo: 'list', pathMatch: 'prefix' },
        { path: 'list', component: DeviceListComponent },
        { path: 'cards', component: DeviceCardsComponent },
      ]
    },
  ]
},
{ path: '**', redirectTo: '' }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
