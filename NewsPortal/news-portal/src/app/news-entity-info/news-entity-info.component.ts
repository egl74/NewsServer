import { Component, OnInit, Input } from "@angular/core";
import { NewsService } from '../news.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "news-entity-info",
  templateUrl: "./news-entity-info.component.html",
  styleUrls: ["./news-entity-info.component.css"]
})
export class NewsEntityInfoComponent implements OnInit {
  newsEntity = {};

  constructor(private newsService: NewsService,
    private activatedRoute: ActivatedRoute) {
    this.newsService.getById(this.activatedRoute.snapshot.params['id'])
      .subscribe(data => this.newsEntity = data);
  }

  ngOnInit() {}
}
