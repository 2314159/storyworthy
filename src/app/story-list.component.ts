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
        <div class="logo">
          <h3>Storyworthy</h3>
        </div>
        <div class="account-actions">
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
      border-bottom: 1px solid hsl(270deg, 0%, 25%);
      position: fixed;
      width: 100%;
      background: hsl(270deg, 0%, 7%);
    }

    .logo {
      display: flex;
      align-items: center;
      margin: 0 0 0 16px;
    }

    .logo img {
      border-radius: 3px;
    }

    .logo h3 {
      margin: 0;
    }

    nav section {
      justify-content: space-between;
      align-items: center;
    }

    .account-actions {
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
      padding: 1rem 16px;
    }

    .story h1 {
      margin: 0.5rem 0;
    }

    .story span {
      font-size: 0.875rem;
      color: hsl(270deg, 0%, 70%);

      /* color: hsl(0deg, 0%, 40%); */
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
