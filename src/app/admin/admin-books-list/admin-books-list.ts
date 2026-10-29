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
import { BookAction, BookStatus, IAdminBook, IAdminStudents } from '../../core';
import { MatSelectModule } from '@angular/material/select';

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
    MatChipsModule,
    MatSelectModule
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

  showStudentModal = signal(false);
  modalAction = signal<BookAction | null>(null);
  selectedBookId = signal<number | null>(null);
  selectedStudentId = signal<number | null>(null);
  selectedBookStatus = signal<BookStatus | null>(null);
  studentsList = signal<IAdminStudents[]>([]);
  isStudentsLoading = signal(false);
  isActionSubmitting = signal(false);

  totalBooks = signal(0);
  pageSize = signal(50);
  pageIndex = signal(0);
  pageSizeOptions = [50, 100, 200];

  tabs: BookStatus[] = [BookStatus.AVAILABLE, BookStatus.BORROWED, BookStatus.RESERVED];

  availableColumns = ['title', 'author', 'language', 'status', 'actions'];
  borrowedColumns = ['title', 'author', 'studentName', 'borrowedOn', 'returnByDate', 'actions'];
  reservedColumns = ['title', 'author', 'studentName', 'reservedOn', 'actions'];

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

    const page = this.pageIndex(); // API 1-based
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

  private runAction(action: BookStatus, book_id: number, studentId: number, successMessage: string) {
    this.adminService.updateBookStatus({ status:action, book_id, studentId }).subscribe({
      next: (res) => {
        this.snackBar.open(res.message || successMessage, 'Close', { duration: 3000 });
        this.loadBooks();
      },
      error: (err) => {
        this.snackBar.open(err?.error?.message || 'Action failed', 'Close', { duration: 3000 });
      }
    });
  }

  loadStudents() {
    this.isStudentsLoading.set(true);

    this.adminService.getAdminStudentsList().subscribe({
      next: (res) => {
        this.studentsList.set(res.list);
        this.isStudentsLoading.set(false);
      },
      error: () => {
        this.studentsList.set([]);
        this.isStudentsLoading.set(false);
      }
    });
  }

  getBookLabel(bookId: number): string {
    const book = this.books.find(b => b.id === bookId);
    return book ? book.name : '';
  }

  onBorrow(book: { id: number; title: string }) {
    this.openStudentModal(book, BookAction.BORROW, BookStatus.BORROWED);
  }

  onReserve(book: { id: number; title: string }) {
    this.openStudentModal(book, BookAction.RESERVE, BookStatus.RESERVED);
  }

  onCancel(book: { id: number; title: string }) {
    this.openStudentModal(book, BookAction.CANCEL, BookStatus.AVAILABLE);
  }

  onReturn(book: { id: number; title: string }) {
    this.openStudentModal(book, BookAction.RETURN, BookStatus.RETURN);
  }

  private openStudentModal(
    book: { id: number; title: string },
    action: BookAction,
    status: BookStatus
  ) {
    this.selectedBookId.set(book.id);
    this.modalAction.set(action);
    this.selectedBookStatus.set(status);
    this.selectedStudentId.set(null);
    this.showStudentModal.set(true);
    this.loadStudents();
  }

  confirmStudentAction() {
    const bookId = this.selectedBookId();
    const action = this.modalAction();
    const status = this.selectedBookStatus();
    const studentId = this.selectedStudentId();

    if (!bookId || !action || !status || !studentId || this.isActionSubmitting()) return;

    this.isActionSubmitting.set(true);

    this.adminService.updateBookStatus({
      status,
      book_id: bookId,
      studentId
    }).subscribe({
      next: () => {
        this.isActionSubmitting.set(false);
        this.closeStudentModal();
        this.snackBar.open(
          action === 'borrow' ? 'Book borrowed successfully' : 'Book reserved successfully',
          'Close',
          { duration: 3000 }
        );
        this.loadBooks();
      },
      error: (err) => {
        this.isActionSubmitting.set(false);
        this.snackBar.open(err?.error?.message || 'Action failed', 'Close', {
          duration: 3000
        });
      }
    });
  }

  closeStudentModal() {
    this.showStudentModal.set(false);
    this.selectedBookId.set(null);
    this.modalAction.set(null);
    this.selectedBookStatus.set(null);
    this.selectedStudentId.set(null);
  }
}
