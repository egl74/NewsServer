import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'news-entity',
  templateUrl: './news-entity.component.html',
  styleUrls: ['./news-entity.component.css']
})
export class NewsEntityComponent implements OnInit {

  constructor() { }

  @Input() newsEntity: any;

  ngOnInit() {
  }

}
