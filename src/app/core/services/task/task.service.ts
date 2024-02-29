import { Task } from '@interfaces/task/task.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  create(userId: string, task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/task/${userId}`, task);
  }

  get(userId: string, filters?: Partial<Task>): Observable<Task[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        const value = filters[key as keyof Task];
        if (value !== null && value !== undefined) {
          params = params.append(key, value.toString());
        }
      });
    }
    return this.http.get<Task[]>(`${this.baseUrl}/task/${userId}`, { params });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/task/${id}`);
  }

  update(id: string, task: Task): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}/task/${id}`, task);
  }
}
