import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NewsService } from '../news.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsModel } from '../news-model';

@Component({
  selector: 'news-entity-info',
  templateUrl: './news-entity-info.component.html',
  styleUrls: ['./news-entity-info.component.css']
})
export class NewsEntityInfoComponent implements OnInit {
  newsEntity: NewsModel;
  form: FormGroup = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    author: new FormControl(''),
    url: new FormControl(''),
    urlToImage: new FormControl('')
  });

  get saveButtonText(): string {
    return this.newsEntity && this.newsEntity['_id'] ? 'Update' : 'Add';
  }

  get showDeleteButton(): boolean {
    return this.newsEntity && this.newsEntity._id != null;
  }

  constructor(
    private newsService: NewsService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.newsService
      .getById(this.activatedRoute.snapshot.params['id'])
      .subscribe(data => {
        this.newsEntity = data;

        this.form.controls['title'].setValue(data.title);
        this.form.controls['description'].setValue(data.description);
        this.form.controls['author'].setValue(data.author);
        this.form.controls['url'].setValue(data.url);
        this.form.controls['urlToImage'].setValue(data.urlToImage);
      });
  }

  ngOnInit() {}

  save() {
    Object.assign(this.newsEntity, this.form.getRawValue());
    this.newsService
      .saveNewsEntity(this.newsEntity)
      .subscribe(() => this.router.navigate(['/']));
  }

  delete() {
    this.newsService
      .delete(this.newsEntity._id)
      .subscribe(() => this.router.navigate(['/']));
  }
}
