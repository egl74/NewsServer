import { Component, OnInit, Input } from "@angular/core";
import { NewsService } from "../news.service";

@Component({
  selector: "news-list",
  templateUrl: "./news-list.component.html",
  styleUrls: ["./news-list.component.css"]
})
export class NewsListComponent implements OnInit {
  newsEntities = [];
  constructor(private newsService: NewsService) {
    this.newsService.sourceChanged.subscribe(data => {
      this.newsEntities = data;
    });

    this.newsService.getAll().subscribe(data => {
      this.newsEntities = data;
    });
  }

  ngOnInit() {}
}
