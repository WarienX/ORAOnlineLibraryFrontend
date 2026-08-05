import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { GradeService } from '../../services';

@Component({
  selector: 'app-add-grade',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './add-grade.html',
  styleUrl: './add-grade.scss',
})
export class AddGrade {
  private fb = inject(FormBuilder);
  private gradeService = inject(GradeService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isSubmitting = signal(false);

  gradeForm = this.fb.group({
    gradeNumber: [1, [Validators.required]],
    gradeName: ['', [Validators.required, Validators.minLength(2)]]
  });

  onSubmit() {
    if (this.gradeForm.invalid) {
      this.gradeForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const payload = {
      grade_number: this.gradeForm.value.gradeNumber!,
      name: this.gradeForm.value.gradeName!
    };

    this.gradeService.createGrade(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.snackBar.open('Grade created successfully!', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/admin/grades']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        console.error('Failed to create grade:');
        console.log(err.error.message);
        this.snackBar.open(`Failed to create grade: ${err.error.message}`, 'Close', {
          duration: 4000
        });
      }
    });
  }

  onCancel() {
    this.router.navigate(['/admin/grades']);
  }
}
