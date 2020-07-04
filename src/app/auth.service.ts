import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DevicewiseAuthService, DwResponse } from 'devicewise-angular';
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public endpoint: string;
  public account: DwResponse.LoginResponse;

  constructor(
    private storage: StorageService,
    private dwAuth: DevicewiseAuthService,
    private router: Router
  ) {
    this.endpoint = this.storage.getLastUsedNode();
  }

  login(user, pass): Observable<DwResponse.LoginResponse> {
    return this.dwAuth.easyLogin(this.endpoint, user, pass).pipe(
      tap((rsp) => {
        if (rsp.success) {
          this.account = rsp;
          this.storage.storeLastUsedNode(this.endpoint);
        }
      })
    );
  }

  logout(): void {
    this.router.navigate(['/login']);
    this.dwAuth.logout().subscribe();
  }

  setEndpoint(endpoint: string): void {
    this.endpoint = endpoint;
  }

  getEndpoint(): string {
    return this.endpoint;
  }
}
