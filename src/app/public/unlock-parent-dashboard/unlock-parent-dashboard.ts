import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ParentDashboardService } from '../../services';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-unlock-parent-dashboard',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './unlock-parent-dashboard.html',
  styleUrl: './unlock-parent-dashboard.scss',
})
export class UnlockParentDashboard {
  private fb = inject(FormBuilder);
  private parentService = inject(ParentDashboardService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  
  isSubmitting = signal(false);

  constructor() {
    if (this.parentService.hasParentAccess()) {
      this.router.navigate(['/parent-dashboard']);
    }
  }

  form = this.fb.group({
    masterPassword: ['', [Validators.required, Validators.minLength(4)]]
  });


  onSubmit() {
    if (this.form.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    const masterPassword = this.form.value.masterPassword!;

    this.parentService.verifyMasterPassword(masterPassword).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);

        if (res.data.isPasswordMatch) {
          this.router.navigate(['/parent-dashboard']);
        } else {
          this.snackBar.open(
            res.message || 'Incorrect master password',
            'Close',
            { duration: 3000 }
          );
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.snackBar.open(
          err?.error?.message || 'Incorrect master password',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }
}
