import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NewsListComponent } from './news-list/news-list.component';
import { NewsEntityComponent } from './news-entity/news-entity.component';
import { NewsEntityInfoComponent } from './news-entity-info/news-entity-info.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NewsListComponent,
    NewsEntityComponent,
    NewsEntityInfoComponent
  ],
  imports: [
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    BsDropdownModule.forRoot(),
    ReactiveFormsModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
