import { Routes } from '@angular/router';
import { RegisterComponent } from './user-components/register/register.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CancelRegistrationComponent } from './user-components/cancel-registration/cancel-registration.component';

export const routes: Routes = [{ path: '', component: HomePageComponent }, { path: 'register', component: RegisterComponent }, { path: 'cancel-registration', component: CancelRegistrationComponent }];
