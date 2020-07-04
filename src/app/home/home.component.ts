import { Component, OnInit, OnDestroy } from '@angular/core';
import { DevicewiseApiService, DwResponse, DwType } from 'devicewise-angular';
import { interval, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

}
