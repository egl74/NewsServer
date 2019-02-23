import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'news-entity',
  templateUrl: './news-entity.component.html',
  styleUrls: ['./news-entity.component.css']
})
export class NewsEntityComponent implements OnInit {

  constructor(private router: Router) { }

  @Input() newsEntity: any;

  ngOnInit() {
  }

  edit(id: any){
    this.router.navigate([`/newsEntity/${id}/edit`]);
  }
}
