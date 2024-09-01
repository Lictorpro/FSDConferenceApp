import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Event } from '../models/event.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-events-info',
  standalone: true,
  imports: [MatCardModule, DatePipe],
  templateUrl: './events-info.component.html',
  styleUrl: './events-info.component.css'
})
export class EventsInfoComponent implements OnInit {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  events: Event[] | undefined = [];


  ngOnInit() {
    const subscription = this.httpClient.get<{ data: { data: Event[] }, results: number, status: string }>('http://localhost:3000/api/v1/events').subscribe({
      next: (resData) => {
        this.events = resData.data.data;
      }
    })

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

}
