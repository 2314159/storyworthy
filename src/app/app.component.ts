import { Component } from '@angular/core';
import { Story } from './story.model';
import { StoryService } from './story.service';

@Component({
  selector: 'app-root',
  template: `
  <div class="app">
    <nav>
      <section><h3>Storyworthy</h3></section>
    </nav>
    <section class="spacer"></section>
    <section class="create-story">
      <input [(ngModel)]="draft.title" placeholder="Today's Story" />
      <textarea rows="4" [(ngModel)]="draft.contents" placeholder="What set today apart from the rest? How did it change you? Take a moment to reflect and write a few short sentences about what made your day interesting."></textarea>

      <div class="create-story-actions">
        <button (click)="discardDraft()" *ngIf="draft.title || draft.contents">Discard Draft</button>
        <button (click)="createStory(draft)">Create Story</button>
      </div>
    </section>
    <section class="story" *ngFor="let story of stories">
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

    nav h3 {
      margin: 0 0 0 16px;
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

    .create-story {
      flex-direction: column;
      margin: 16px auto;
      padding: 8px 16px;
      border: 1px solid #dadada;
      border-radius: 8px;
    }

    .create-story textarea, .create-story input {
      padding: 8px;
      border: 1px solid transparent;
      font-size: 1rem;
      line-height: 1.4;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    .create-story input {
      border-bottom: 1px solid #dadada;
      margin-bottom: 8px;
      font-size: 1.25rem;
      font-weight: bold;
    }

    .create-story input:focus {
      border-bottom: 1px solid hsl(230deg, 70%, 52%);
    }
    
    .create-story textarea, .create-story input {
      outline: none;
      resize: none;
    }

    .create-story-actions {
      display: flex;
      justify-content: flex-end;
    }

    .create-story-actions button {
      margin: 8px 0 0 8px;
      display: inline-block;
      max-width: 200px;
      background: hsl(230deg, 60%, 48%);
      font-weight: 600;
      font-size: 0.875rem;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      color: #fff;
    }

    .create-story button:hover {
      background: hsl(230deg, 70%, 52%);
      cursor: pointer;
      color: hsl(230deg, 2%, 100%);
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
export class AppComponent {
  userULID = '01G9KJ9ANQ8JHEJZRKWWMJFEXE';
  draft: Story = {
    title: '',
    contents: ''
  };

  stories: Story[] = [];

  private updateDraftInterval?: any; // NodeJS.Timer

  constructor(private storyService: StoryService) {

  }

  async ngOnInit() {
    this.stories = await this.storyService.listStories(this.userULID);
    this.draft = await this.storyService.getDraft(this.userULID);

    this.updateDraftInterval = setInterval(() => {
      if (this.draft.contents || this.draft.title) {
        this.storyService.updateDraft(this.userULID, this.draft);
      }
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.updateDraftInterval);
  }

  async createStory(story: Story) {
    const newStory = await this.storyService.createStory(this.userULID, story);

    if (newStory) {
      this.stories = [newStory, ...this.stories];
      this.discardDraft();
    } else {
      // display error
    }
  }

  async discardDraft() {
    console.log('discard draft')
    this.draft = {
      title: '',
      contents: ''
    };

    await this.storyService.deleteDraft(this.userULID);
  }
}
