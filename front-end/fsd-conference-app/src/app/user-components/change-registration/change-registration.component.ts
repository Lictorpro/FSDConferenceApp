import { Component, DestroyRef, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-change-registration',
  standalone: true,
  imports: [HeaderComponent, MatLabel, MatStepperModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './change-registration.component.html',
  styleUrl: './change-registration.component.css'
})
export class ChangeRegistrationComponent {
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private eventService = inject(EventService);
  userId: string = '';
  errorMessage: string = '';
  isError: boolean = false;
  editableStep1: boolean = true;
  editableStep2: boolean = true;
  events: Event[] | undefined = [];
  userEvents: string[] = [];

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required]
    }),
    accessToken: new FormControl('', {
      validators: [Validators.required]
    })
  })

  changeRegForm = new FormGroup({
    events: new FormArray([])
  })

  get emailIsInvalid() {
    return this.form.controls.email.touched && this.form.controls.email.dirty && this.form.controls.email.invalid
  }

  get accessTokenIsInvalid() {
    return this.form.controls.accessToken.touched && this.form.controls.accessToken.dirty && this.form.controls.accessToken.invalid
  }

  /*populateEventControls() {
    const eventControls = this.events!.map(event => new FormControl(false));
    const formArray = this.changeRegForm.get('events') as FormArray;
    formArray.clear();
    eventControls.forEach(control => formArray.push(control));
    console.log(eventControls);
  }*/

  populateEventControls() {
    if (this.events) {
      console.log(this.userEvents)
      const eventControls = this.events.map(event =>
        new FormControl(false));
      const formArray = this.changeRegForm.get('events') as FormArray;
      formArray.clear();
      eventControls.forEach(control => {
        console.log(control.value);
        formArray.push(control);
      });
      console.log(eventControls);
    }
  }

  ngOnInit() {
    const subscription = this.eventService.fetchEvents().subscribe({
      next: (resData) => {
        this.events = resData.data.data;
        this.populateEventControls();
      }
    })

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

  onSubmit(stepper: MatStepper) {
    if (this.form.valid) {
      const enteredEmail = this.form.value.email;
      const acessToken = this.form.value.accessToken;
      console.log(enteredEmail, acessToken);
      const reqBody = { email: enteredEmail, accessToken: acessToken };
      console.log(reqBody);
      const subscription = this.userService.authenticateUser(reqBody).subscribe({
        next: (resData) => {
          console.log(resData);
          if (resData.status === 'success') {
            this.userId = resData.data.user._id;
            //this.userEvents = resData.data.user.registrations.map((registration: { event: { _id: any; }; }) => registration.event._id);
            //console.log(this.userEvents);
            stepper.next();
            this.isError = false;
            this.errorMessage = '';
            this.editableStep1 = false;
          }
        },
        error: (error) => {
          console.log(error.error);
          this.isError = true;
          this.errorMessage = error.error.message;
        }
      })

      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      })
    }
  }

  onChangeReg(stepper: MatStepper) {
    if (this.changeRegForm.valid) {
      const selectedEventIds = this.changeRegForm.value.events!
        .map((checked: boolean, i: number) => checked ? this.events![i]._id : null)
        .filter((id: string | null) => id !== null);

      const reqBody = { events: selectedEventIds }
      console.log(reqBody);

      const subscription = this.userService.changeRegistration(reqBody, this.userId).subscribe({
        next: (resData) => {
          console.log(resData);
          if (resData.status === 'success') {
            stepper.next();
            this.editableStep2 = false;
          }
        },
        error: (error) => {
          console.log(error.error);
          this.isError = true;
          this.errorMessage = error.error.message;
        }
      })

      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      })
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
