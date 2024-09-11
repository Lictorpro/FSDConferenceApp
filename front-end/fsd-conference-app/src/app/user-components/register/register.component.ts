import { Component, DestroyRef, inject } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AbstractControl, FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { RegisterDialogComponent } from './register-dialog/register-dialog.component';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HeaderComponent, MatLabel, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private eventService = inject(EventService);
  private destroyRef = inject(DestroyRef);
  private userService = inject(UserService);
  readonly dialog = inject(MatDialog);
  events: Event[] | undefined = [];
  errorMessage: string = '';
  isError: boolean = false;

  form = new FormGroup({
    firstName: new FormControl('', {
      validators: [Validators.required]
    }),
    lastName: new FormControl('', {
      validators: [Validators.required]
    }),
    company: new FormControl('', {}),
    primaryAddress: new FormControl('', {
      validators: [Validators.required]
    }),
    secondaryAddress: new FormControl('', {}),
    city: new FormControl('', {
      validators: [Validators.required]
    }),
    zipCode: new FormControl('', {
      validators: [Validators.required]
    }),
    country: new FormControl('', {
      validators: [Validators.required]
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email]
    }),
    emailConfirm: new FormControl('', {
      validators: [Validators.required, Validators.email]
    }),
    promoCode: new FormControl('', {}),
    events: new FormArray([])
  })

  get emailIsInvalid() {
    return this.form.controls.email.touched && this.form.controls.email.dirty && this.form.controls.email.invalid
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

  populateEventControls() {
    const eventControls = this.events!.map(event => new FormControl(false));
    const formArray = this.form.get('events') as FormArray;
    formArray.clear();
    eventControls.forEach(control => formArray.push(control));
    console.log(eventControls);
  }

  onSubmit() {

    if (this.form.valid) {

      const selectedEventIds = this.form.value.events!
        .map((checked: boolean, i: number) => checked ? this.events![i]._id : null)
        .filter((id: string | null) => id !== null);
      console.log(selectedEventIds);

      const user = {
        firstName: this.form.value.firstName,
        lastName: this.form.value.lastName,
        company: this.form.value.company,
        address1: this.form.value.primaryAddress,
        address2: this.form.value.secondaryAddress,
        city: this.form.value.city,
        zipCode: this.form.value.zipCode,
        country: this.form.value.country,
        usedPromoCode: this.form.value.promoCode,
        email: this.form.value.email,
        emailConfirm: this.form.value.emailConfirm,
        events: selectedEventIds
      }

      console.log(user);
      const reqBody = user;
      console.log(reqBody);
      const subscription = this.userService.register(reqBody).subscribe({
        next: (resData) => {
          console.log(resData);
          if (resData.status === 'success') {
            console.log(resData);
            this.isError = false;
            this.errorMessage = '';
            this.dialog.open(RegisterDialogComponent);
          }
        },
        error: (error) => {
          console.log(error);
          this.isError = true;
          this.errorMessage = error.error.message;
        }
      })

      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      })
    }
  }
}
