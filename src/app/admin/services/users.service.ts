import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateUserRequest, UsersResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly apiUrl = `${environment.backendUrl}/api/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(this.apiUrl);
  }

  getUserById(id: string): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${this.apiUrl}/${id}`);
  }

  createUser(userData: CreateUserRequest): Observable<UsersResponse> {
    return this.http.post<UsersResponse>(this.apiUrl, userData);
  }

  updateUser(id: string, userData: Partial<CreateUserRequest>): Observable<UsersResponse> {
    return this.http.put<UsersResponse>(`${this.apiUrl}/${id}`, userData);
  }

  deleteUser(id: string): Observable<UsersResponse> {
    return this.http.delete<UsersResponse>(`${this.apiUrl}/${id}`);
  }
}

