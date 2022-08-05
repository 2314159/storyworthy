import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { orderBy } from 'lodash';
import { lastValueFrom } from 'rxjs';
import { Story } from './story.model';

const API_ROOT = 'https://crabl-storyworthy.builtwithdark.com';

@Injectable({ providedIn: 'root' })
export class StoryService {
  constructor(private http: HttpClient) {

  }

  async listStories(userULID: string) {
    try {
      const res = await lastValueFrom(this.http.get<Story[]>(`${API_ROOT}/${userULID}/story`));
      return orderBy(res, ['date'] , ['desc']);
    } catch (err) {
      return [];
    }
  }

  async createStory(userULID: string, story: Story) {
    if (story.title && story.contents) {
      try {
        const res = await lastValueFrom(this.http.post<Story>(`${API_ROOT}/${userULID}/story`, story));
        return res;
      } catch (err) {
        console.log(err);
      }
    } 
    
    return null;
  }

  async getDraft(userULID: string) {
    try {
      const res = await lastValueFrom(this.http.get<Story>(`${API_ROOT}/${userULID}/draft`));
      return res;
    } catch (err) {}

    return {
      title: '',
      contents: ''
    };
  }

  async updateDraft(userULID: string, draft: Story) {
    try {
      const res = await lastValueFrom(this.http.put<Story>(`${API_ROOT}/${userULID}/draft`, draft));
    } catch (err) {}
  }

  async deleteDraft(userULID: string) {
    try {
      const res = await lastValueFrom(this.http.delete<Story>(`${API_ROOT}/${userULID}/draft`));
    } catch (err) {}
  }
}