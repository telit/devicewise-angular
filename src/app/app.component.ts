import { Component, OnDestroy } from '@angular/core';
import { PageScrollConfig } from 'ngx-page-scroll';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnDestroy {

  constructor() {
    PageScrollConfig.defaultScrollOffset = 64;
    PageScrollConfig.defaultDuration = 333;
  }

  ngOnDestroy(): void {
  }
}
