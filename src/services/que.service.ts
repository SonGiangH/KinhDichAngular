import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { QueDTO } from 'src/dtos/que.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QueService {
  // private apiUrl1 = `http://localhost:8088/api/v1/kinhdich/que`;     // 8088 - connect local host via Xammp
  // private apiUrl = `http://localhost:8099/api/v1/kinhdich/que`;      // 8099 - connect via Docker Container
  private apiUrl = `http://103.101.163.117:8099/api/v1/kinhdich/que`; // 8099 - connect via server VPS

  constructor(private http: HttpClient) {}

  // Ham submit Que trong service
  checkQue(QueDTO: QueDTO): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(this.apiUrl, QueDTO, { headers });
  }
}
