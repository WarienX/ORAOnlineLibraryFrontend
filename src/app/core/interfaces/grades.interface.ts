export interface ICreateGradePayload {
  grade_number: number;
  name: string;
}

export interface IEditGradePayload {
  grade_id: number;
  grade_number: number;
  name: string;
}

export interface IGrade {
  id: number;
  grade_number: number;
  name: string;
}

export interface IGradeListResponse {
  list: IGrade[];
  message: string;
}

export interface IGradeResponse {
  data: IGrade;
  message: string;
}