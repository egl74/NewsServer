import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NewsModel } from './news-model';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private readonly newsAggregatorApiUrl = 'https://newsapi.org/v1';
  private _sourceChanged : BehaviorSubject<any> = new BehaviorSubject([]);
  sourceChanged: Observable<any> = this._sourceChanged.asObservable();

  constructor(private httpClient: HttpClient) { }

  public getAll() {
    return this.httpClient.get<NewsModel[]>(`${environment.apiUrl}`);
  }

  public getById(id) {
    return this.httpClient.get<NewsModel>(`${environment.apiUrl}?id=${id}`);
  }

  public getNewsSources() {
    return this.httpClient.get<string[]>(`${this.newsAggregatorApiUrl}/sources?apiKey=${environment.newsApiKey}`);
  }

  public changeNewsSource(sourceId: string) {
    this.httpClient.get(`${this.newsAggregatorApiUrl}/articles?source=${sourceId}&apiKey=${environment.newsApiKey}`)
      .subscribe(data => {
        this._sourceChanged.next(data['articles']);
      });
  }
}
