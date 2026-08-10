import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { GoogleBooksService, StudentService } from '../../services';
import { IBook, IBookWithCover } from '../../core';

@Component({
  selector: 'app-student-books-list',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './student-books-list.html',
  styleUrl: './student-books-list.scss',
})
export class StudentBooksList {
  private bookService = inject(StudentService);
  private googleBooks = inject(GoogleBooksService);
  private snackBar = inject(MatSnackBar);

  books: IBook[] = [];
  booksWithCovers: IBookWithCover[] = [];
  isLoading = signal(false);

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.isLoading.set(true);

    this.bookService.getBooksList().subscribe({
      next: (data) => {
        this.books = data.list.map(book => ({
          ...book
        }));
        this.isLoading.set(false);

        // Fetch covers in background
        this.books.forEach((book, index) => {
          this.fetchCover(book, index);
        });
      },
      error: () => {
        this.isLoading.set(false);
        this.snackBar.open('Failed to load books', 'Close', { duration: 3000 });
      }
    });
  }

  private fetchCover(book: IBook, index: number) {
    this.googleBooks.getCoverUrl(book.name, book.author).subscribe({
      next: (url) => {
        this.booksWithCovers[index] = {
          ...this.books[index],
          coverUrl: url || undefined,
          coverLoading: false
        };
      },
      error: () => {
        this.booksWithCovers[index].coverLoading = false;
      }
    });
  }
}
