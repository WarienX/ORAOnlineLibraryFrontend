import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { GradeService, StudentService } from '../../services';
import { IGrade } from '../../core';

@Component({
  selector: 'app-student-onbooarding',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './student-onbooarding.html',
  styleUrl: './student-onbooarding.scss',
})
export class StudentOnbooarding {
  private fb = inject(FormBuilder);
  private gradeService = inject(GradeService);
  private studentService = inject(StudentService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  grades: IGrade[] = [];
  isLoadingGrades = signal(false);
  isSubmitting = signal(false);
  studentName = signal('');
  studentEmail = signal('');

  onboardingForm = this.fb.group({
    gradeId: [null as number | null, Validators.required],
    fatherEmail: ['', [Validators.email]],
    fatherMobile: ['', [Validators.pattern(/^[0-9]{10}$/)]],
    motherEmail: ['', [Validators.email]],
    motherMobile: ['', [Validators.pattern(/^[0-9]{10}$/)]]
  }, {
    validators: [this.atLeastOneParentValidator]
  });

  ngOnInit() {
    this.loadGrades();
  }

  loadGrades() {
    this.isLoadingGrades.set(true);
    const savedUser = localStorage.getItem('user');
    const userData = savedUser ? JSON.parse(savedUser) : null;
    if (userData) {
      this.studentName.set(userData.full_name);
      this.studentEmail.set(userData.email_id);
    }
    this.gradeService.getGrades().subscribe({
      next: (data) => {
        this.grades = data.list;
        this.isLoadingGrades.set(false);
      },
      error: () => {
        this.isLoadingGrades.set(false);
        this.snackBar.open('Failed to load grades', 'Close', { duration: 3000 });
      }
    });
  }

  /** At least one parent must have both Email + Mobile */
  atLeastOneParentValidator(control: AbstractControl): ValidationErrors | null {
    const fatherEmail = control.get('fatherEmail')?.value?.trim();
    const fatherMobile = control.get('fatherMobile')?.value?.trim();
    const motherEmail = control.get('motherEmail')?.value?.trim();
    const motherMobile = control.get('motherMobile')?.value?.trim();

    const fatherValid = fatherEmail && fatherMobile;
    const motherValid = motherEmail && motherMobile;

    if (fatherValid || motherValid) {
      return null;
    }

    return { parentRequired: true };
  }

  onSubmit() {
    if (this.onboardingForm.invalid) {
      this.onboardingForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.onboardingForm.value;

    const payload = {
      grade: formValue.gradeId!,
      fathers_email: formValue.fatherEmail || '',
      fathers_mobile: formValue.fatherMobile || '',
      mothers_email: formValue.motherEmail || '',
      mothers_mobile: formValue.motherMobile || ''
    };

    this.studentService.onboardStudent(payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.snackBar.open(res.message || 'Student onboarded successfully!', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        console.error(err);
        this.snackBar.open('Failed to onboard student. Please try again.', 'Close', {
          duration: 4000
        });
      }
    });
  }

  onCancel() {
    this.router.navigate(['/admin/students']);
  }
}
