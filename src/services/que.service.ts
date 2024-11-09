import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { QueDTO } from 'src/dtos/que.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class QueService {

  private apiUrl = `http://localhost:8088/api/v1/kinhdich/que`;

  constructor(private http: HttpClient) {}

  // Ham submit Que trong service
  checkQue(QueDTO: QueDTO): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    return this.http.post(this.apiUrl, QueDTO, { headers });
  }
}
