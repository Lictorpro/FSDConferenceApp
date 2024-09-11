import { Component, DestroyRef, inject } from '@angular/core';
import { MatLabel } from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

function correctPrhase(control: AbstractControl) {
  if (control.value === 'I UNDERSTAND') {
    return null;
  }
  return { correctPhrase: false }
}

@Component({
  selector: 'app-cancel-registration',
  standalone: true,
  imports: [HeaderComponent, MatLabel, MatStepperModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './cancel-registration.component.html',
  styleUrl: './cancel-registration.component.css'
})
export class CancelRegistrationComponent {
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  userId: string = '';
  errorMessage: string = '';
  isError: boolean = false;
  editableStep1: boolean = true;
  editableStep2: boolean = true;

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required]
    }),
    accessToken: new FormControl('', {
      validators: [Validators.required]
    })
  })

  confirmForm = new FormGroup({
    confirm: new FormControl('', {
      validators: [Validators.required, correctPrhase]
    })
  })

  get emailIsInvalid() {
    return this.form.controls.email.touched && this.form.controls.email.dirty && this.form.controls.email.invalid
  }

  get accessTokenIsInvalid() {
    return this.form.controls.accessToken.touched && this.form.controls.accessToken.dirty && this.form.controls.accessToken.invalid
  }

  get confirmIsInvalid() {
    return this.confirmForm.controls.confirm.touched && this.confirmForm.controls.confirm.dirty && this.confirmForm.controls.confirm.invalid
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

  onConfirm(stepper: MatStepper) {
    if (this.confirmForm.valid) {
      const subscription = this.userService.cancelRegistration(null, this.userId).subscribe({
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
