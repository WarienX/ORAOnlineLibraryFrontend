import { IBookStatus, IGrade } from ".";
import { BookStatus } from "../enum";

export interface IAdminBook {
  id: number;
  name: string;
  series_name: string;
  author: string;
  genre: string;
  language: string;
  count: number;
  grade_id: number;
  status: BookStatus;
  bookGrades: IGrade[];
  borrowed_on?: string;
  return_by_date?: string;
  reserved_on?: string;
  isbn?: string;
  student_id?: number;
  student?: string;
}

export interface IAdminBooksListPayload {
  page: number;  
  limit: number;  
  status: BookStatus;
  search?: string;
}

export interface IAdminBooksListResponse {
  message: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  list: IAdminBook[];
}

export interface IAdminBookStatusUpdatePayload {
  studentId: number;  
  book_id: number;  
  status: BookStatus;
}

export interface IAdminBookStatusResponse {
  message: string;
  data: IBookStatus;
}

export interface IAdminStudents {
  id: number;
  user_id: number;
  full_name: string;
  grade: string;
}

export interface IAdminStudentsListResponse {
  message: string;
  list: IAdminStudents[];
}

export interface IAdminDashboardMetrics {
  totalBooks: number;
  availableBooks: number;
  borrowedBooks: number;
  reservedBooks: number;
  overdueBooks: number;
  totalStudents: number;
  totalGrades: number;
}

export interface IAdminRecentBorrow {
  id: number;
  bookTitle: string;
  studentName: string;
  borrowedOn: string;
  returnByDate?: string;
  isOverdue?: boolean;
}

export interface IAdminRecentReservation {
  id: number;
  bookTitle: string;
  studentName: string;
  reservedOn: string;
}

export interface IAdminDashboardData {
  metrics: IAdminDashboardMetrics;
  recentBorrows: IAdminRecentBorrow[];
  recentReservations: IAdminRecentReservation[];
}

export interface IAdminDashboardAPIResponse {
  message: string;
  data: IAdminDashboardData;
}

export interface IAdminAddBookReqBody {
  book_name: string;
  series_name: string | null;
  author: string;
  genre: string;
  language: string;
  gradeId: number;
  position: string;
}

export interface IAdminBookData {
  id: number;
  name: string;
  series_name: string;
  author: string;
  genre: string;
  language: string;
  count: number;
  grade_id: number;
  status: BookStatus;
  position: string;
}

export interface IAdminAddNewBookResponse {
  message: string;
  data: IAdminBookData;
}

export interface IAdminEditBookReqBody {
  book_id: number;
  book_name: string | null;
  series_name: string | null;
  author: string | null;
  genre: string | null;
  language: string | null;
  gradeId: number | null;
  position: string | null;
}