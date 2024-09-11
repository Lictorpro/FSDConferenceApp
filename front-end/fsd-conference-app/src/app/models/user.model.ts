import { Event } from "./event.model";

export interface User {
    firstName: string;
    lastName: string;
    company: string;
    primaryAddress: string;
    secondaryAddress: string;
    city: string;
    zipCode: string;
    country: string;
    email: string;
    emailConfirm: string;
    events: string[];
    promoCode: string;
}