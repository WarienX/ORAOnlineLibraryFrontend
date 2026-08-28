import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { StudentService } from '../../services';
import { IStudentProfileInfo } from '../../core';

@Component({
  selector: 'app-student-profile',
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
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './student-profile.html',
  styleUrl: './student-profile.scss',
})
export class StudentProfile {
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private snackBar = inject(MatSnackBar);

  isLoading = signal(true);
  isSubmitting = signal(false);
  profile: IStudentProfileInfo | null = null;

  profileForm = this.fb.group({
    full_name: ['', [Validators.required, Validators.minLength(2)]],
    mobile_no: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    dob: ['', Validators.required],
    gender: ['', Validators.required],
    age: [{ value: null as number | null, disabled: true }]
  });

  genderOptions = ['Male', 'Female'];

  ngOnInit() {
    this.loadProfile();

    // Auto-calculate age when DOB changes
    this.profileForm.get('dob')?.valueChanges.subscribe((dob) => {
      if (dob) {
        const age = this.calculateAge(dob);
        this.profileForm.get('age')?.setValue(age);
      }
    });
  }

  loadProfile() {
    this.isLoading.set(true);

    this.studentService.getStudentProfile().subscribe({
      next: (data) => {
        this.profile = data.data;
        this.profileForm.patchValue({
          full_name: this.profile.userInfo.full_name,
          mobile_no: this.profile.userInfo.mobile_no,
          dob: this.profile.userInfo.dob,
          gender: this.profile.userInfo.gender,
          age: this.profile.userInfo.age
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.snackBar.open('Failed to load profile', 'Close', { duration: 3000 });
      }
    });
  }

  calculateAge(dob: string | Date): number {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const raw = this.profileForm.getRawValue(); // includes disabled age

    const payload = {
      full_name: raw.full_name!,
      mobile_no: raw.mobile_no!,
      dob: raw.dob!,
      gender: raw.gender!,
      age: Number(raw.age)
    };

    this.studentService.updateStudentProfile(payload).subscribe({
      next: (updated) => {
        const updatedInfo = updated.data;
        this.profile = { ...this.profile!, ...updatedInfo };
        this.isSubmitting.set(false);
        this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: 3000
        });
      },
      error: () => {
        this.isSubmitting.set(false);
        this.snackBar.open('Failed to update profile', 'Close', {
          duration: 3000
        });
      }
    });
  }
}
