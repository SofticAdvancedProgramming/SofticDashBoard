import { Injectable } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(private permissionsService: NgxPermissionsService) {}

  loadPermissions(roles: string[]): void {
    this.permissionsService.loadPermissions(roles);
  }

  clearPermissions(): void {
    this.permissionsService.flushPermissions();
  }
}
