import { ICategory } from '@interfaces/category/category.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  create(userId: string, category: ICategory): Observable<ICategory> {
    return this.http.post<ICategory>(
      `${this.baseUrl}/category/${userId}`,
      category
    );
  }

  get(userId: string): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${this.baseUrl}/category/${userId}`);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/category/${id}`);
  }
}
