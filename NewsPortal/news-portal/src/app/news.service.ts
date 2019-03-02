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
  private _listRefreshed: BehaviorSubject<any> = new BehaviorSubject([]);
  listRefreshed: Observable<any> = this._listRefreshed.asObservable();

  constructor(private httpClient: HttpClient) {}

  public getAll() {
    return this.httpClient.get<NewsModel[]>(`${environment.apiUrl}`);
  }

  public getById(id) {
    return this.httpClient.get<NewsModel>(`${environment.apiUrl}?id=${id}`);
  }

  public getNewsSources() {
    return this.httpClient.get<string[]>(
      `${this.newsAggregatorApiUrl}/sources?apiKey=${environment.newsApiKey}`
    );
  }

  public updateNewsList(sourceId: string | null = null) {
    if (sourceId) {
      this.httpClient
        .get(
          `${this.newsAggregatorApiUrl}/articles?source=${sourceId}&apiKey=${
            environment.newsApiKey
          }`
        )
        .subscribe(data => {
          this._listRefreshed.next(data['articles']);
        });
    } else {
      this.getAll().subscribe(data => {
        this._listRefreshed.next(data);
      });
    }
  }

  public saveNewsEntity(newsEntity: NewsModel) {
    if (newsEntity._id) {
      return this.httpClient.put<any>(
        `${environment.apiUrl}?id=${newsEntity._id}`,
        newsEntity
      );
    } else {
      newsEntity.publishedAt = newsEntity.publishedAt || new Date();
      return this.httpClient.post<any>(`${environment.apiUrl}`, newsEntity);
    }
  }

  public delete(id) {
    return this.httpClient.delete(`${environment.apiUrl}?id=${id}`);
  }
}
