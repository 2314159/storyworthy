import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AuthGuard, AuthModule } from '@auth0/auth0-angular';
import { MarkdownModule } from 'ngx-markdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { StoryListComponent } from './story-list.component';
import { StoryService } from './story.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    StoryListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MarkdownModule.forRoot(),
    HttpClientModule,
    FormsModule,
    AuthModule.forRoot({
      domain: 'storyworthy.us.auth0.com',
      clientId: 'CRr3k9yRQ9HeKUfMiMHXIiVUmgdjBIEw'
    })
  ],
  providers: [StoryService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
