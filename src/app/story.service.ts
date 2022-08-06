import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { orderBy } from 'lodash';
import { lastValueFrom } from 'rxjs';
import { Story } from './story.model';

const API_ROOT = 'https://crabl-storyworthy.builtwithdark.com';

@Injectable({ providedIn: 'root' })
export class StoryService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  private async getUserId() {
    const user = await lastValueFrom(this.auth.getUser());

    const token = await lastValueFrom(this.auth.getAccessTokenSilently());
    console.log(token);
    console.log(user);
    return user?.sub;
  }

  async listStories() {
    try {
      console.log('list stories')
      const userId = await this.getUserId();
      const res = await lastValueFrom(this.http.get<Story[]>(`${API_ROOT}/${userId}/story`));
      return orderBy(res, ['date'] , ['desc']);
    } catch (err) {
      console.error(err);
    }

    return [];
  }

  async createStory(story: Story) {
    if (story.title && story.contents) {
      try {
        const userId = await this.getUserId();
        const res = await lastValueFrom(this.http.post<Story>(`${API_ROOT}/${userId}/story`, story));
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
      const res = await lastValueFrom(this.http.get<Story>(`${API_ROOT}/${userId}/draft`));
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
      const res = await lastValueFrom(this.http.put<Story>(`${API_ROOT}/${userId}/draft`, draft));
      return res;
    } catch (err) {
      console.error(err);
    }

    return;
  }

  async deleteDraft() {
    try {
      const userId = await this.getUserId();
      const res = await lastValueFrom(this.http.delete<Story>(`${API_ROOT}/${userId}/draft`));
      return res;
    } catch (err) {
      console.error(err);
    }

    return;
  }
}