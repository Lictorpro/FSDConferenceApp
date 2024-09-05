import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private httpClient = inject(HttpClient);
  constructor() { }

  fetchEvents() {
    return this.httpClient.get<{ data: { data: Event[] }, results: number, status: string }>('http://localhost:3000/api/v1/events')
  }
}
