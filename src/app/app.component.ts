import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { orderBy } from 'lodash';

interface Story {
  date: string;
  title: string;
  contents: string;
  user_ulid: string;
}

@Component({
  selector: 'app-root',
  template: `
  <div class="app">
    <nav>
      <section><h3>Storyworthy</h3></section>
    </nav>
    <section class="spacer"></section>
    <section class="story" *ngFor="let story of stories">
      <h1>{{story.title}}</h1>
      <span>{{story.date | date:'mediumDate'}} at {{story.date | date:'shortTime'}}</span>
      <div><markdown [data]="story.contents"></markdown></div>
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

    nav h3 {
      margin: 0 0 0 16px;
    }

    section {
      width: 100%;
      max-width: 960px;
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
  `]
})
export class AppComponent {
  stories: Story[] = [];

  constructor(private http: HttpClient) {

  }

  async ngOnInit() {
    try {
      const res = await lastValueFrom(this.http.get<Story[]>("https://crabl-storyworthy.builtwithdark.com/story"));
      this.stories = orderBy(res, ['date'] , ['desc']);
    } catch (err) {

    }
  }
}
