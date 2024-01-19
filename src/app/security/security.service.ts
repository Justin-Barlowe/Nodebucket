//Name: Justin Barlowe
//File: security.service.ts
//Date: 01/18/2024
//Description: Security service

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(private http: HttpClient) { }

  findEmployeeById(empId: number) {
    return this.http.get('/api/employees/' + empId);
  }
}
