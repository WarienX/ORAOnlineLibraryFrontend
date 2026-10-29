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