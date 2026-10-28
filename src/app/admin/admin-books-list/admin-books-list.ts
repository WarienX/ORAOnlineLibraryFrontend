import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { AdminService } from '../../services';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { BookStatus, IAdminBook } from '../../core';

@Component({
  selector: 'app-admin-books-list',
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule
  ],
  templateUrl: './admin-books-list.html',
  styleUrl: './admin-books-list.scss',
})
export class AdminBooksList {
  private adminService = inject(AdminService);
  private snackBar = inject(MatSnackBar);
  private destroy$ = new Subject<void>();
  private search$ = new Subject<string>();

  books: IAdminBook[] = [];
  activeTab = signal(BookStatus.AVAILABLE);
  bookStatus = signal(BookStatus.AVAILABLE)
  isLoading = signal(false);
  search = signal('');

  totalBooks = signal(0);
  pageSize = signal(8);
  pageIndex = signal(0);
  pageSizeOptions = [10, 20, 30];

  tabs: BookStatus[] = [BookStatus.AVAILABLE, BookStatus.BORROWED, BookStatus.RESERVED];

  availableColumns = ['title', 'author', 'isbn', 'status'];
  borrowedColumns = [
    'title',
    'author',
    'studentName',
    'borrowedOn',
    'returnByDate'
  ];
  reservedColumns = [
    'title',
    'author',
    'studentName',
    'reservedOn'
  ];

  ngOnInit() {
    this.search$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term) => {
        this.search.set(term);
        this.pageIndex.set(0);
        this.loadBooks();
      });

    this.loadBooks();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTabChange(index: number) {
    console.log(`Tab Index Value: ${this.tabs[index]}`);
    this.activeTab.set(this.tabs[index]);
    this.bookStatus.set(this.tabs[index]);
    this.pageIndex.set(0);
    this.loadBooks();
  }

  onSearchChange(value: string) {
    this.search$.next(value ?? '');
  }

  clearSearch() {
    this.search.set('');
    this.pageIndex.set(0);
    this.loadBooks();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadBooks();
  }

  get tabLabel(): string {
    if (this.activeTab() == 'available') return 'Available';
    if (this.activeTab() == 'borrowed') return 'Borrowed';
    return 'Reserved';
  }

  loadBooks() {
    this.isLoading.set(true);

    const page = this.pageIndex() + 1; // API 1-based
    const type = this.activeTab();

    this.adminService
      .getAdminBooksList({ page, limit: this.pageSize(), status: type as BookStatus, search: this.search() })
      .subscribe({
        next: (res) => {
          this.books = (res.list || []) as IAdminBook[];
          this.totalBooks.set(res.total || 0);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.snackBar.open('Failed to load books', 'Close', { duration: 3000 });
        }
      });
  }
}
