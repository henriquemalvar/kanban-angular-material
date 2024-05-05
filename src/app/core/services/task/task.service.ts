import { ITask } from '@interfaces/task/task.interface';
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

  create(userId: string, task: ITask): Observable<ITask> {
    return this.http.post<ITask>(`${this.baseUrl}/card/${userId}`, task);
  }

  get(userId: string, filters?: Partial<ITask>): Observable<ITask[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        const value = filters[key as keyof ITask];
        if (value !== null && value !== undefined) {
          params = params.append(key, value.toString());
        }
      });
    }
    return this.http.get<ITask[]>(`${this.baseUrl}/card/${userId}`, { params });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/card/${id}`);
  }

  update(id: string, task: ITask): Observable<ITask> {
    console.log("🚀 ~ TaskService ~ update ~ task:", task)
    return this.http.patch<ITask>(`${this.baseUrl}/card/${id}`, task);
  }
}
