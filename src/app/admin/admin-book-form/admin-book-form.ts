import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService, GradeService } from '../../services';
import { IAdminAddBookReqBody, IGrade } from '../../core';

@Component({
  selector: 'app-admin-book-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-book-form.html',
  styleUrl: './admin-book-form.scss',
})
export class AdminBookForm {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private adminService = inject(AdminService);
  private gradeService = inject(GradeService);
  private snackBar = inject(MatSnackBar);

  isEdit = signal(false);
  bookId = signal<number | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  grades = signal<IGrade[]>([]);

  languages = ['English', 'Other'];
  genres = ['Fiction', 'Non-Fiction', 'Story Collection', 'Biography', 'Science', 'Math', 'Poetry', 'Comics', 'Other'];

  form = this.fb.group({
    book_name: ['', [Validators.required, Validators.maxLength(300)]],
    series_name: [''],
    author: ['', [Validators.required, Validators.maxLength(200)]],
    genre: ['', Validators.required],
    language: ['English', Validators.required],
    gradeId: [null as number | null, Validators.required],
    position: ['', [Validators.required, Validators.maxLength(50)]]
  });

  loadGrades(): void {
    this.gradeService.getGrades().subscribe({
      next: (res: any) => this.grades.set(res.list || []),
      error: () => this.grades.set([])
    });
  }

  loadBook(id: number): void {
    this.isLoading.set(true);

    this.adminService.getAdminSingleBookData({book_id: id}).subscribe({
      next: (resp) => {
        const book = resp.data;

        this.form.patchValue({
          book_name: book.name ?? '',
          series_name: book.series_name ?? '',
          author: book.author ?? '',
          genre: book.genre ?? '',
          language: book.language ?? 'English',
          gradeId: book.grade_id ?? book.grade_id ?? book.grade.id ?? null,
          position: book.position ?? ''
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.snackBar.open(
          err?.error?.message || 'Failed to load book',
          'Close',
          { duration: 3000 }
        );
        this.router.navigate(['/admin/books']);
      }
    });
  }

  private buildPayload(): IAdminAddBookReqBody {
    const raw = this.form.getRawValue();
    const series = (raw.series_name || '').trim();

    return {
      book_name: raw.book_name!.trim(),
      series_name: series ? series : null,
      author: raw.author!.trim(),
      genre: raw.genre!,
      language: raw.language!,
      gradeId: Number(raw.gradeId),
      position: raw.position!.trim()
    };
  }
}
