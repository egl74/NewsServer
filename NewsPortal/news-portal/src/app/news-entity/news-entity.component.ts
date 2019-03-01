import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";
import { NewsModel } from "../news-model";
import { NewsService } from "../news.service";

@Component({
  selector: "news-entity",
  templateUrl: "./news-entity.component.html",
  styleUrls: ["./news-entity.component.css"]
})
export class NewsEntityComponent implements OnInit {
  constructor(private router: Router, private newsService: NewsService) {}

  @Input() newsEntity: any;

  ngOnInit() {}

  edit(id: any) {
    this.router.navigate([`/newsEntity/${id}/edit`]);
  }

  saveToDb(newsEntity: NewsModel) {
    this.newsService.saveNewsEntity(newsEntity).subscribe(data => {
      Object.assign(newsEntity, data.newsEntity);
    });
  }
}
