import { BookStatus } from "../enum";
import { IBookStatus } from "./books.interface";
import { IGrade } from "./grades.interface";

export interface IStudentOnboardingPayload {
  grade: number;
  fathers_email: string;
  fathers_mobile: string;
  mothers_email: string;
  mothers_mobile: string;
}

export interface IStudentOnboardingResponse {
  message: string;
  data: IStudentData
}

export interface IStudentBookStatusPayload {
  book_id: number;
  status: BookStatus;
}

export interface IStudentBookStatusResp {
  message: string;
  data: IBookStatus;
}

export interface IUserData {
    full_name: string;
    email_id: string;
    mobile_no: string;
    dob: string;
    gender: string;
    age: number;
    role: string;
}

export interface IStudentData extends IUserData {
    grade_id: number;
    father_email: string;
    fathers_mobile_no: string;
    mother_email: string;
    mothers_mobile_no: string;
}

export interface IStudentBooksListPayload {
  page: number;  
  limit: number;  
  status: BookStatus;
}

interface IStudentProfileUserInfo extends IUserData {
  is_active: boolean;
}

export interface IStudentProfileInfo {
  userInfo: IStudentProfileUserInfo,
  studentInfo: {
    father_email: string;
    fathers_mobile_no: string;
    mothers_email: string;
    mothers_mobile_no: string;
    is_active: boolean;
    grade: IGrade;
  }
}

export interface IGetStudentProfileInfoResp {
  message: string;
  data: IStudentProfileInfo
}

export interface IUpdateStudentInfoPayload {
  full_name: string;
  mobile_no: string | null;
  dob: string | null;
  gender: string | null;
  age: number | null;
}

export interface IUpdateStudentInfoResp {
  message: string;
  data: IStudentProfileUserInfo
}