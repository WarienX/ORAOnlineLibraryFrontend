import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { StudentService } from '../../services';
import { IStudentDashboardBook, IStudentDashboardData, IStudentDashboardMetrics, ISuggestedBook } from '../../core';

@Component({
  selector: 'app-student-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.scss',
})
export class StudentDashboard {
  private studentService = inject(StudentService);
  private snackBar = inject(MatSnackBar);

  isLoading = signal(true);
  data = signal<IStudentDashboardData | null>(null);

  metrics = computed<IStudentDashboardMetrics>(() => {
    return (
      this.data()?.metrics ?? {
        borrowedCount: 0,
        reservedCount: 0,
        dueSoonCount: 0,
        returnedThisMonth: 0
      }
    );
  });

  borrowedBooks = computed<IStudentDashboardBook[]>(() => this.data()?.borrowedBooks ?? []);

  reservedBooks = computed<IStudentDashboardBook[]>(() => this.data()?.reservedBooks ?? []);

  suggestedBooks = computed<ISuggestedBook[]>(() => this.data()?.suggestedBooks ?? []);

  dueSoonBooks = computed(() =>this.borrowedBooks().filter((b) => b.isOverdue || (b.daysUntilDue != null && b.daysUntilDue <= 3)));

  loadDashboard(): void {
    this.isLoading.set(true);

    this.studentService.getDashboard().subscribe({
      next: (res) => {
        this.data.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.snackBar.open(
          err?.error?.message || 'Failed to load dashboard',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }

  dueLabel(book: IStudentDashboardBook): string {
    if (book.isOverdue) return 'Overdue';
    if (book.daysUntilDue == null) return '';
    if (book.daysUntilDue === 0) return 'Due today';
    if (book.daysUntilDue === 1) return 'Due tomorrow';
    return `Due in ${book.daysUntilDue} days`;
  }

  ngOnInit() {
    this.loadDashboard();
  }
}
