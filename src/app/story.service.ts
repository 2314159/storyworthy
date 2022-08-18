import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { orderBy } from 'lodash';
import { BehaviorSubject, lastValueFrom, take } from 'rxjs';
import { Story } from './story.model';

// NOTE: when changing this value, update Auth0 identity token claim in "Login" Action
const API_ROOT = 'https://crabl-storyworthy.builtwithdark.com';

@Injectable({ providedIn: 'root' })
export class StoryService {
  public stories$ = new BehaviorSubject<Story[]>([]);

  constructor(private http: HttpClient, private auth: AuthService) {}

  private async getHeaders(): Promise<{ headers: HttpHeaders}> {
    const claims = await lastValueFrom(this.auth.getIdTokenClaims());

    const headers = new HttpHeaders()
      .set('Authentication', claims ? claims[API_ROOT] : '');

    return { headers };
  }

  private async getUserId() {
    const user = await lastValueFrom(this.auth.getUser());
    return user?.sub;
  }

  async listStories() {
    try {
      const userId = await this.getUserId();
      const res = await lastValueFrom(this.http.get<Story[]>(`${API_ROOT}/${userId}/story`, await this.getHeaders()));
      const stories = orderBy(res, ['date'] , ['desc']);
      this.stories$.next(stories);
      return stories;
    } catch (err) {
      console.error(err);
    }

    return [];
  }

  async createStory(story: Story) {
    if (story.contents) {
      try {
        const storyToCreate = {
          title: story.title || '',
          contents: story.contents
        };
        
        const userId = await this.getUserId();
        const res = await lastValueFrom(this.http.post<Story>(`${API_ROOT}/${userId}/story`, storyToCreate, await this.getHeaders()));
        const stories = await lastValueFrom(this.stories$.pipe(take(1)));
        this.stories$.next([res, ...stories]);
        return res;
      } catch (err) {
        console.error(err);
      }
    } 
    
    return;
  }

  async getDraft() {
    try {
      const userId = await this.getUserId();
      const res = await lastValueFrom(this.http.get<Story>(`${API_ROOT}/${userId}/draft`, await this.getHeaders()));
      return res;
    } catch (err) {
      console.error(err);
    }

    return {
      title: '',
      contents: ''
    };
  }

  async updateDraft(draft: Story) {
    try {
      const userId = await this.getUserId();
      const res = await lastValueFrom(this.http.put<Story>(`${API_ROOT}/${userId}/draft`, draft, await this.getHeaders()));
      return res;
    } catch (err) {
      console.error(err);
    }

    return;
  }

  async deleteDraft() {
    try {
      const userId = await this.getUserId();
      const res = await lastValueFrom(this.http.delete<Story>(`${API_ROOT}/${userId}/draft`, await this.getHeaders()));
      return res;
    } catch (err) {
      console.error(err);
    }

    return;
  }
}