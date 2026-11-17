import { Component, inject, signal } from '@angular/core';
import { IParentDashboardData, IParentDashboardResponse } from '../../core';
import { ParentDashboardService } from '../../services';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-parent-dashboard',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTableModule,
  ],
  templateUrl: './parent-dashboard.html',
  styleUrl: './parent-dashboard.scss',
})
export class ParentDashboard {
  private parentService = inject(ParentDashboardService);
  private snackBar = inject(MatSnackBar);
  isLoading = signal(false);

  dashboardData = signal<IParentDashboardData>({} as IParentDashboardData);

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard() {
    this.isLoading.set(true);

    this.parentService.getDashboard().subscribe({
      next: (data: IParentDashboardResponse) => {
        this.dashboardData.set(data.data);
        console.log('Parent Dashboard Data:', this.dashboardData());
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.snackBar.open(
          err?.error?.message || 'Failed to load parent dashboard',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }
}
