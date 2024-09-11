import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private httpClient = inject(HttpClient);
  constructor() { }

  authenticateUser(data: any) {
    return this.httpClient.post<any>('http://localhost:3000/api/v1/users/authenticate', data);
  }

  cancelRegistration(data: any, userId: string) {
    return this.httpClient.post<any>('http://localhost:3000/api/v1/users/cancel/' + userId, data);
  }

  getDebt(userId: string) {
    return this.httpClient.get<any>('http://localhost:3000/api/v1/users/debt/' + userId);
  }

  changeRegistration(data: any, userId: string) {
    return this.httpClient.put<any>('http://localhost:3000/api/v1/users/changeRegistration/' + userId, data);
  }

  register(data: any) {
    return this.httpClient.post<any>('http://localhost:3000/api/v1/users/register', data);
  }
}
