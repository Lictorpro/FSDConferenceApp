import { Presenter } from "./presenter.model";

export interface Event {
    _id: string;
    address: string;
    city: string;
    eventDate: string;
    discountDate: string;
    name: string;
    numberOfVisitors: string;
    presenters: Presenter[];
    price: number;
    availableSeats: number;
}