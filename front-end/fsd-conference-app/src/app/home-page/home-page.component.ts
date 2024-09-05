import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CarouselMainComponent } from '../carousel-main/carousel-main.component';
import { BasicInfoComponent } from '../basic-info/basic-info.component';
import { EventsInfoComponent } from '../events-info/events-info.component';
import { FooterComponent } from '../footer/footer.component';
import { ActionsComponent } from '../actions/actions.component';


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HeaderComponent, CarouselMainComponent, BasicInfoComponent, EventsInfoComponent, FooterComponent, ActionsComponent,],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
