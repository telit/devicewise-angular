import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  @Output() snavOpened = new EventEmitter<boolean>();
  snavOpenedBoolean = false;

  constructor() { }

  snavToggle() {
    console.log('emitting toggle');
    this.snavOpenedBoolean = !this.snavOpenedBoolean;
    this.snavOpened.emit(this.snavOpenedBoolean);
  }

}
