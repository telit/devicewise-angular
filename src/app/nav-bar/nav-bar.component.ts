import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  @Output() snavOpened = new EventEmitter<boolean>();
  snavOpenedBoolean = false;

  constructor() { }

  ngOnInit() {
  }

  snavToggle() {
    console.log('emitting toggle');
    this.snavOpenedBoolean = !this.snavOpenedBoolean;
    this.snavOpened.emit(this.snavOpenedBoolean);
  }

}
