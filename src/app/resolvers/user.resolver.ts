// src/app/resolvers/user.resolver.ts
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user/user.service';

@Injectable({ providedIn: 'root' })
export class UserResolver implements Resolve<any> {
  constructor(private userService: UserService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const userId = route.paramMap.get('userId')!;
    return this.userService.getUserById(userId);
  }
}
