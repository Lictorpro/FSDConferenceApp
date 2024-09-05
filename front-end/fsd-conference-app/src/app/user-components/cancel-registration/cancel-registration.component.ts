import { Component, inject } from '@angular/core';
import { MatLabel } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cancel-registration',
  standalone: true,
  imports: [HeaderComponent, MatLabel, MatStepperModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './cancel-registration.component.html',
  styleUrl: './cancel-registration.component.css'
})
export class CancelRegistrationComponent {
  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', [Validators.required, Validators.email]],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;
}
