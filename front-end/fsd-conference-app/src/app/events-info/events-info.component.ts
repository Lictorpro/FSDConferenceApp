import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Event } from '../models/event.model';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-events-info',
  standalone: true,
  imports: [MatCardModule, DatePipe, MatTableModule],
  templateUrl: './events-info.component.html',
  styleUrl: './events-info.component.css'
})
export class EventsInfoComponent implements OnInit {
  private eventService = inject(EventService);
  private destroyRef = inject(DestroyRef);
  events: Event[] | undefined = [];
  displayedColumns: string[] = ['presenter', 'presentationTime'];


  ngOnInit() {
    const subscription = this.eventService.fetchEvents().subscribe({
      next: (resData) => {
        this.events = resData.data.data;
      }
    })

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

}
