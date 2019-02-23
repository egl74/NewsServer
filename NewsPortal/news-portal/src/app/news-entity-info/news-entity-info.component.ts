import { Component, OnInit, Input } from "@angular/core";
import { NewsEntityServiceService } from '../news-entity-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "news-entity-info",
  templateUrl: "./news-entity-info.component.html",
  styleUrls: ["./news-entity-info.component.css"]
})
export class NewsEntityInfoComponent implements OnInit {
  @Input() id: any;
  newsEntity = {};

  constructor(private newsEntityServiceService: NewsEntityServiceService,
    private activatedRoute: ActivatedRoute) {
    this.newsEntity = this.newsEntityServiceService.getById(this.activatedRoute.snapshot.params['id']);
  }

  ngOnInit() {}
}
