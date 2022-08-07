import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { Story } from './story.model';
import { StoryService } from './story.service';

@Component({
  selector: 'app-story-list',
  template: `
  <div class="app">
    <nav>
      <section>
        <h3>Storyworthy</h3>
        <div>
          <a href="#" (click)="auth.logout({ returnTo: document.location.origin })">
            Log out
          </a>
        </div>
      </section>
    </nav>
    <section class="spacer"></section>

    <section class="story">
      <app-create-story></app-create-story>
    </section>
    <section class="story" *ngFor="let story of stories$ | async">
      <h1>{{story.title}}</h1>
      <span>{{story.date | date:'mediumDate'}} at {{story.date | date:'shortTime'}}</span>
      <div class="contents"><markdown [data]="story.contents"></markdown></div>
    </section>
    <router-outlet></router-outlet>
  </div>
  `,
  styles: [`
    .app {
      display: flex;
      flex-direction: column;
    }

    .spacer {
      margin-top: 64px;
    }

    nav {
      padding: 16px 0;
      border-bottom: 1px solid #dadada;
      position: fixed;
      width: 100%;
      background: white;
    }

    nav section {
      justify-content: space-between;
      align-items: baseline;
    }

    nav h3 {
      margin: 0 0 0 16px;
    }

    nav div {
      margin: 0 16px 0 0;
    }

    section {
      width: 100%;
      max-width: 750px;
      margin: 0 auto;
      display: flex;
    }

    .story {
      flex-direction: column;
      padding: 0 16px;
    }

    .story h1 {
      margin: 0.5rem 0;
    }

    .story span {
      font-size: 0.875rem;
      color: hsl(0deg, 0%, 40%);
    }

    .story .contents {
      line-height: 1.4;
    }
  `]
})
export class StoryListComponent implements OnInit {
  public document = document;
  stories$: Observable<Story[]>;

  constructor(public auth: AuthService, private storyService: StoryService) {
    this.stories$ = storyService.stories$;
  }

  async ngOnInit() {
    await this.storyService.listStories();
  }
}
