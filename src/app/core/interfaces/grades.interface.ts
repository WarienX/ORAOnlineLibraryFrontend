export interface ICreateGradePayload {
  gradeNumber: number;
  gradeName: string;
}

export interface IGrade {
  id: number;
  gradeNumber: number;
  gradeName: string;
}

export interface IGradeListResponse {
  list: IGrade[];
  message: string;
}