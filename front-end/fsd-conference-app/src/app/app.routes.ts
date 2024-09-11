import { Routes } from '@angular/router';
import { RegisterComponent } from './user-components/register/register.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CancelRegistrationComponent } from './user-components/cancel-registration/cancel-registration.component';
import { UserDebtComponent } from './user-components/user-debt/user-debt.component';
import { ChangeRegistrationComponent } from './user-components/change-registration/change-registration.component';

export const routes: Routes = [{ path: '', component: HomePageComponent }, { path: 'register', component: RegisterComponent }, { path: 'cancel-registration', component: CancelRegistrationComponent }, { path: 'debt', component: UserDebtComponent }, {path: 'change-registration', component: ChangeRegistrationComponent}];
