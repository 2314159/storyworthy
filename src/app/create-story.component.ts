import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Story } from './story.model';
import { StoryService } from './story.service';

@Component({
  selector: 'app-create-story',
  template: `
    <section class="create-story">
      <input [(ngModel)]="draft.title" placeholder="Today's Story" />
      <textarea rows="4" [(ngModel)]="draft.contents" placeholder="What set today apart from the rest? How did it change you? Take a moment to reflect and write a few short sentences about what made your day interesting."></textarea>

      <div class="create-story-actions">
        <button class="discard-draft-button" (click)="discardDraft()" *ngIf="draft.title || draft.contents">
          <ion-icon name="trash-outline"></ion-icon> <span>Discard Draft</span>
        </button>
        <button class="create-story-button" (click)="createStory(draft)">Create Story</button>
      </div>
    </section>
  `,
  styles: [`
    .create-story {
      display: flex;
      flex-direction: column;
      margin: 16px auto;
      padding: 8px 16px;
      border: 1px solid hsl(270deg, 30%, 25%);
      border-radius: 8px;
    }

    .create-story textarea, .create-story input {
      padding: 8px;
      background: transparent;
      color: hsl(270deg, 77%, 98%);
      border: 1px solid transparent;
      font-size: 1rem;
      line-height: 1.4;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    .create-story textarea::placeholder, .create-story input::placeholder {
      color: hsl(270deg, 30%, 70%);
    }

    .create-story input {
      border-bottom: 1px solid hsl(270deg, 30%, 25%);
      margin-bottom: 8px;
      font-size: 1.25rem;
      font-weight: bold;
    }

    .create-story input:focus {
      border-bottom: 1px solid hsl(270deg, 70%, 52%);
    }
    
    .create-story textarea, .create-story input {
      outline: none;
      resize: none;
    }

    .create-story-actions {
      display: flex;
      justify-content: flex-end;
    }

    .create-story-button {
      margin: 8px 0 0 8px;
      max-width: 200px;
      background: hsl(270deg, 77%, 40%);
      color: #fff;
    }
    
    .create-story-button:hover {
      background: hsl(270deg, 77%, 45%);
      color: hsl(230deg, 2%, 100%);
    }

    .discard-draft-button {
      margin: 8px 0 0 8px;
      max-width: 200px;
      background: hsl(0deg, 77%, 40%);
      color: hsl(230deg, 2%, 100%);
    }

    .discard-draft-button:hover {
      background: hsl(0deg, 77%, 45%);
    }
  `]
})
export class CreateStoryComponent implements OnInit, OnDestroy {
  draft: Story = {
    title: '',
    contents: ''
  };

  private updateDraftInterval?: any; // NodeJS.Timer

  constructor(public auth: AuthService, private storyService: StoryService) {}

  async ngOnInit() {
    this.draft = await this.storyService.getDraft();

    this.updateDraftInterval = setInterval(() => {
      if (this.draft.contents || this.draft.title) {
        this.storyService.updateDraft(this.draft);
      }
    }, 5000);
  }

  async ngOnDestroy() {
    clearInterval(this.updateDraftInterval);
  }


  async createStory(story: Story) {
    const newStory = await this.storyService.createStory(story);

    if (newStory) {
      this.discardDraft();
    } else {
      // display error
    }
  }

  async discardDraft() {
    // TODO: confirm discard
    console.log('discard draft')
    this.draft = {
      title: '',
      contents: ''
    };

    await this.storyService.deleteDraft();
  }
}