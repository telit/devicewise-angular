import { Component, OnDestroy, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { PageScrollConfig } from 'ngx-page-scroll';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnDestroy, OnInit {
  mobileQuery: MediaQueryList;
  @ViewChild('snav') sidenav: any;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    PageScrollConfig.defaultScrollOffset = 64;
    PageScrollConfig.defaultDuration = 333;
  }

  ngOnInit(): void {
  }

  onToggle(snavOpened: boolean) {
    console.log('Snav: ' + snavOpened);
    this.sidenav.toggle();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
