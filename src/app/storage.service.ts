import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  static readonly lastUsedNodeKey = 'last-used-node';

  constructor() { }
  
  storeLastUsedNode(connectionSettings: string) {
    try {
      window.localStorage[StorageService.lastUsedNodeKey] = JSON.stringify(connectionSettings);
    } catch { }
  }

  getLastUsedNode(): string | null {
    try {
      return JSON.parse(window.localStorage[StorageService.lastUsedNodeKey]) || null;
    } catch {
      return null;
    }
  }
}
