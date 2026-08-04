import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { GradeService } from '../../services';
import { IGrade } from '../../core';

@Component({
  selector: 'app-grades-list',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './grades-list.html',
  styleUrl: './grades-list.scss',
})
export class GradesList {
  private gradeService = inject(GradeService);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['gradeNumber', 'gradeName', 'actions'];
  grades: IGrade[] = [];
  isLoading = signal(false);

  ngOnInit() {
    this.loadGrades();
  }

  loadGrades() {
    this.isLoading.set(true);

    this.gradeService.getGrades().subscribe({
      next: (data) => {
        console.log(data.list);
        this.grades = data.list;
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load grades:', err);
        this.isLoading.set(false);
        this.snackBar.open('Failed to load grades', 'Close', {
          duration: 3000
        });
      }
    });
  }
}
