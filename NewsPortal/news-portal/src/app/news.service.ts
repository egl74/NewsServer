import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor(private httpClient: HttpClient) { }

  public getAll() {
    return this.httpClient.get<any[]>(`${environment.apiUrl}`);
  }

  public getById(id) {
    return this.httpClient.get<any>(`${environment.apiUrl}?id=${id}`);
  }
}
