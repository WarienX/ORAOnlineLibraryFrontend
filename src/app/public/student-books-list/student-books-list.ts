import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { GoogleBooksService, StudentService } from '../../services';
import { BookStatus, IBook, IBookWithCover } from '../../core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-student-books-list',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
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
  bookStatus = signal(BookStatus.ALL)
  isLoading = signal(false);

  totalBooks = signal(0);
  pageSize = signal(10);
  pageIndex = signal(1);
  pageSizeOptions = [10, 20, 30];

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.isLoading.set(true);

    const page = this.pageIndex();

    this.bookService.getBooksList({ page, limit: this.pageSize(), status: this.bookStatus() }).subscribe({
      next: (data) => {
        this.booksWithCovers = data.list.map(book => ({
          ...book,
          coverUrl: undefined,
          coverLoading: false
        }));
        this.totalBooks.set(data.total);
        this.isLoading.set(false);

        // Fetch covers in background
        /* this.books.forEach((book, index) => {
          this.fetchCover(book, index);
        }); */
      },
      error: () => {
        this.isLoading.set(false);
        this.snackBar.open('Failed to load books', 'Close', { duration: 3000 });
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadBooks();
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
