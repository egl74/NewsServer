import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  private readonly urlPattern =
    '^https?:\/\/(.*)';
  form: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(5)]),
    description: new FormControl('', [Validators.required]),
    author: new FormControl('', [Validators.required]),
    url: new FormControl('', [
      Validators.required,
      Validators.pattern(this.urlPattern)
    ]),
    urlToImage: new FormControl('', [
      Validators.required,
      Validators.pattern(this.urlPattern)
    ])
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

  get title() {
    return this.form.get('title');
  }

  get description() {
    return this.form.get('description');
  }

  get author() {
    return this.form.get('author');
  }

  get url() {
    return this.form.get('url');
  }

  get urlToImage() {
    return this.form.get('urlToImage');
  }

  ngOnInit() {}

  save() {
    if (!this.form.invalid) {
      Object.assign(this.newsEntity, this.form.getRawValue());
      this.newsService
        .saveNewsEntity(this.newsEntity)
        .subscribe(() => this.router.navigate(['/']));
    }
  }

  delete() {
    this.newsService
      .delete(this.newsEntity._id)
      .subscribe(() => this.router.navigate(['/']));
  }
}
