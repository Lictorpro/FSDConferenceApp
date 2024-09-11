import { Component, DestroyRef, inject } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { Debt } from '../../models/debt.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-user-debt',
  standalone: true,
  imports: [HeaderComponent, MatLabel, MatStepperModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatCardModule],
  templateUrl: './user-debt.component.html',
  styleUrl: './user-debt.component.css'
})
export class UserDebtComponent {
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  userId: string = '';
  errorMessage: string = '';
  isError: boolean = false;
  editableStep1: boolean = true;
  userDebt: Debt | undefined;

  get emailIsInvalid() {
    return this.form.controls.email.touched && this.form.controls.email.dirty && this.form.controls.email.invalid
  }

  get accessTokenIsInvalid() {
    return this.form.controls.accessToken.touched && this.form.controls.accessToken.dirty && this.form.controls.accessToken.invalid
  }

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required]
    }),
    accessToken: new FormControl('', {
      validators: [Validators.required]
    })
  })

  onSubmit(stepper: MatStepper) {
    if (this.form.valid) {
      const enteredEmail = this.form.value.email;
      const accessToken = this.form.value.accessToken;
      console.log(enteredEmail, accessToken);

      const reqBody = { email: enteredEmail, accessToken: accessToken };

      this.userService.authenticateUser(reqBody).pipe(
        switchMap((resData) => {
          console.log(resData);
          if (resData.status === 'success') {
            this.userId = resData.data.user._id;
            console.log(this.userId);

            return this.userService.getDebt(this.userId);
          } else {
            throw new Error('Authentication failed');
          }
        }),
        switchMap((resData: { status: string; data: Debt }) => {
          if (resData.status === 'success') {
            return [resData.data];
          } else {
            throw new Error('Failed to fetch debt data');
          }
        })

      ).subscribe({
        next: (debtData: Debt) => {
          if (debtData) {
            this.userDebt = debtData;
            stepper.next();
            this.isError = false;
            this.errorMessage = '';
            this.editableStep1 = false;
          }

        },
        error: (error) => {
          console.log(error);
          this.isError = true;
          this.errorMessage = error.error.message || 'An error occurred';
        }
      });
    }
  }


  goHome() {
    this.router.navigate(['/']);
  }
}
