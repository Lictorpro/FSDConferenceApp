import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { CarouselMainComponent } from "./carousel-main/carousel-main.component";
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { EventsInfoComponent } from "./events-info/events-info.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CarouselMainComponent, BasicInfoComponent, EventsInfoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
