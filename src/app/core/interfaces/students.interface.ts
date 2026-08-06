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