import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { IUser } from '@interfaces/user/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserEventService {
  private userChangeSubject = new Subject<IUser | null>();

  public get(): Observable<IUser | null> {
    return this.userChangeSubject.asObservable();
  }

  public emit(user: IUser | null): void {
    this.userChangeSubject.next(user);
  }
}
