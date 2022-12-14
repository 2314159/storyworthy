import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AuthGuard, AuthModule } from '@auth0/auth0-angular';
import { MarkdownModule } from 'ngx-markdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateStoryComponent } from './create-story.component';
import { LoginComponent } from './login.component';
import { StoryListComponent } from './story-list.component';
import { StoryService } from './story.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CreateStoryComponent,
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
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [StoryService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
