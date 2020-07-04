import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DevicewiseAuthService } from 'devicewise-angular';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('admin'),
    password: new FormControl('admin'),
    nodeAddress: new FormControl('http://localhost:8080'),
  });

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onLogin() {
    const username = this.loginForm.get('username').value;
    const password = this.loginForm.get('password').value;
    const nodeAddress = this.loginForm.get('nodeAddress').value;
    this.auth.setEndpoint(nodeAddress);
    this.auth.login(username, password).subscribe((rsp) => {
      this.router.navigate(['/']);
    });
  }
}
