export interface IStudentDashboardMetrics {
  borrowedCount: number;
  reservedCount: number;
  dueSoonCount: number;
  returnedThisMonth: number;
}

export interface IStudentDashboardBook {
  id: number;
  title: string;
  author: string;
  borrowedOn?: string;
  returnByDate?: string;
  reservedOn?: string;
  isOverdue?: boolean;
  daysUntilDue?: number;
}

export interface ISuggestedBook {
  id: number;
  title: string;
  author: string;
  reason?: string;
}

export interface IStudentDashboardData {
  studentName: string;
  gradeName?: string;
  metrics: IStudentDashboardMetrics;
  borrowedBooks: IStudentDashboardBook[];
  reservedBooks: IStudentDashboardBook[];
  suggestedBooks: ISuggestedBook[];
}

export interface IStudentDashboardDataResp {
    data: IStudentDashboardData;
    message: string;
}