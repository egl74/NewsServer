import { Component, OnInit } from "@angular/core";
import { NewsService } from "../news.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  public newsSources: any[];

  constructor(private router: Router, private newsService: NewsService) {}

  ngOnInit() {
    this.newsService.getNewsSources().subscribe(data => {
      this.newsSources = data["sources"];
    });
  }

  renderNews(sourceId: string) {
    this.newsService.changeNewsSource(sourceId);
  }
}
