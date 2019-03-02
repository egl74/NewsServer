export class NewsModel {
  _id: string;
  author: string;
  title: string;
  description: string;
  url: string;
  publishedAt: Date;
  urlToImage: string;

  constructor(
    options: {
      _id?: string;
      author?: string;
      title?: string;
      description?: string;
      url?: string;
      urlToImage?: string;
    } = {}
  ) {
    this._id = options._id || '';
    this.author = options.author || '';
    this.title = options.title || '';
    this.description = options.description || '';
    this.url = options.url || '';
    this.urlToImage = options.urlToImage || '';
  }
}
