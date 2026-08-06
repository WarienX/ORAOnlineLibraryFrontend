import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GradeService } from '../../services';

@Component({
  selector: 'app-edit-grade',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './edit-grade.html',
  styleUrl: './edit-grade.scss',
})
export class EditGrade {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private gradeService = inject(GradeService);
  private snackBar = inject(MatSnackBar);

  isLoading = signal(true);
  isSubmitting = signal(false);
  gradeId = signal(0);
  gradeNumber = signal(0);

  gradeForm = this.fb.group({
    gradeNumber: [1, [Validators.required]],
    gradeName: ['', [Validators.required, Validators.minLength(2)]]
  });

  ngOnInit() {
    this.gradeId.set(Number(this.route.snapshot.paramMap.get('id')));
    this.loadGrade();
  }

  loadGrade() {
    if (this.gradeId() == 0) {
      this.snackBar.open('Invalid grade ID', 'Close', { duration: 3000 });
      this.router.navigate(['/admin/grades']);
      return;
    } else {
      this.isLoading.set(true);

      this.gradeService.getGradeById({ grade_id: this.gradeId() }).subscribe({
        next: (grade) => {
          this.gradeNumber.set(grade.data.grade_number);
          this.gradeForm.patchValue({
            gradeNumber: grade.data.grade_number,
            gradeName: grade.data.name
          });
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.isLoading.set(false);
          this.snackBar.open('Failed to load grade', 'Close', { duration: 3000 });
          this.router.navigate(['/admin/grades']);
        }
      });
    }
  }

  onSubmit() {
    if (this.gradeForm.invalid) {
      this.gradeForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const payload = {
      grade_id: this.gradeId(),
      grade_number: this.gradeForm.value.gradeNumber!,
      name: this.gradeForm.value.gradeName!
    };

    this.gradeService.updateGrade(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.snackBar.open('Grade updated successfully!', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/admin/grades']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        console.error(err);
        this.snackBar.open('Failed to update grade', 'Close', {
          duration: 3000
        });
      }
    });
  }

  onCancel() {
    this.router.navigate(['/admin/grades']);
  }
}
