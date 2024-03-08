import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IUser } from '@interfaces/user/user.interface';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  create(user: IUser | FormData): Observable<IUser> {
    return this.http.post<IUser>(`${this.baseUrl}/user`, user);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/user/${id}`);
  }

  get(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.baseUrl}/user/${id}`);
  }

  update(id: string, user: IUser | FormData): Observable<IUser> {
    return this.http.patch<IUser>(`${this.baseUrl}/user/${id}`, user);
  }

  getPhotoUrl(photo: string): string {
    return `${this.baseUrl}/user/uploads/${photo}`;
  }
}
