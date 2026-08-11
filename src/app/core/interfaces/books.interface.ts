import { BookStatus } from "../enum";
import { IGrade } from "./grades.interface";

export interface IBook {
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
  isbn?: string;
}

export interface IBookWithCover extends IBook {
  coverUrl?: string;
  coverLoading?: boolean;
}

export interface IStudentBookStatus {
  book_id: number;
  student_id: number;
  last_updated_by: number;
  status: BookStatus;
  borrowed_on: string;
  returned_on: string;
  return_by_date: string;
  reserved_on: string;
  book: IBook;
}

export interface IStudentBooksListResponse {
  message: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  list: IBook[];
}