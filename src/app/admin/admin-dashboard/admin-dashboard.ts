import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services';
import { IAdminDashboardData, IAdminDashboardMetrics, IAdminRecentBorrow, IAdminRecentReservation } from '../../core';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard {
  private adminService = inject(AdminService);
  private snackBar = inject(MatSnackBar);

  isLoading = signal(true);
  data = signal<IAdminDashboardData | null>(null);

  metrics = computed<IAdminDashboardMetrics>(() => {
    return (
      this.data()?.metrics ?? {
        totalBooks: 0,
        availableBooks: 0,
        borrowedBooks: 0,
        reservedBooks: 0,
        overdueBooks: 0,
        totalStudents: 0,
        totalGrades: 0
      }
    );
  });

  recentBorrows = computed<IAdminRecentBorrow[]>(
    () => this.data()?.recentBorrows ?? []
  );

  recentReservations = computed<IAdminRecentReservation[]>(
    () => this.data()?.recentReservations ?? []
  );

  borrowColumns = ['bookTitle', 'studentName', 'borrowedOn', 'returnByDate'];
  reserveColumns = ['bookTitle', 'studentName', 'reservedOn'];

  loadDashboard() {
    this.isLoading.set(true);

    this.adminService.getAdminDashboardMetrics().subscribe({
      next: (res) => {
        this.data.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.snackBar.open(
          err?.error?.message || 'Failed to load admin dashboard',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }

  ngOnInit() {
    this.loadDashboard();
  }
}
