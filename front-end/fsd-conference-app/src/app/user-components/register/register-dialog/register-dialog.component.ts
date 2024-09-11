import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-dialog',
  standalone: true,
  imports: [MatDialogActions, MatDialogContent, MatButtonModule],
  templateUrl: './register-dialog.component.html',
  styleUrl: './register-dialog.component.css'
})
export class RegisterDialogComponent {
  private router = inject(Router);
  private dialogRef = inject(MatDialogRef);

  goHome() {
    this.dialogRef.close();
    this.router.navigate(['/']);
  }
}
