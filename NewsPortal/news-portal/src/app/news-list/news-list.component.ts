import { Component, OnInit } from '@angular/core';
import { NewsEntityServiceService } from '../news-entity-service.service';

@Component({
  selector: 'news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit {

  newsEntities = [];
  constructor(private newsEntityServiceService: NewsEntityServiceService) {
    this.newsEntities = newsEntityServiceService.getAll();
  }

  ngOnInit() {
  }
}
