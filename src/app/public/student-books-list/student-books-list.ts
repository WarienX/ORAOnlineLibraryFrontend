import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { GoogleBooksService, StudentService } from '../../services';
import { BookStatus, IBook, IBookWithCover } from '../../core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-student-books-list',
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
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
  activeTab = signal(BookStatus.AVAILABLE);
  booksWithCovers: IBookWithCover[] = [];
  bookStatus = signal(BookStatus.AVAILABLE)
  isLoading = signal(false);

  totalBooks = signal(0);
  pageSize = signal(8);
  pageIndex = signal(0);
  pageSizeOptions = [8, 16, 24];

  ngOnInit() {
    this.loadBooks();
  }

  onTabChange(index: number) {
    console.log(`Tab Index: ${index}`);
    const tabs: BookStatus[] = [BookStatus.AVAILABLE, BookStatus.BORROWED, BookStatus.RESERVED];
    this.activeTab.set(tabs[index]);
    console.log(`Tab Index Value: ${tabs[index]}`);
    this.bookStatus.set(tabs[index]);
    this.pageIndex.set(0);
    this.booksWithCovers.length = 0;
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
          coverLoading: false,
          actionLoading: false
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

  onBorrow(book: IBookWithCover) {
    this.runAction(book, BookStatus.BORROWED);
  }

  onReserve(book: IBookWithCover) {
    this.runAction(book, BookStatus.RESERVED);
  }

  onCancelReservation(book: IBookWithCover) {
    this.runAction(book, BookStatus.AVAILABLE);
  }

  private runAction(book: IBookWithCover, action: BookStatus) {
    if (book.actionLoading) return;

    book.actionLoading = true;

    this.bookService.updateBookStatus({status: action, book_id: book.id}).subscribe({
      next: (res) => {
        book.actionLoading = false;
        this.snackBar.open(
          res.message || `Book ${action} successfully!`,
          'Close',
          { duration: 3000 }
        );
        this.loadBooks();
      },
      error: (err) => {
        book.actionLoading = false;
        const message =
          err?.error?.message || `Failed to ${action} book. Please try again.`;
        this.snackBar.open(message, 'Close', { duration: 4000 });
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
