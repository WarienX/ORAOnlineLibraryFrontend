import { IBook } from ".";

export interface IParentDashboardMetrics {
    borrowedCount: number;
    reservedCount: number;
    overdueCount: number;
    totalActions?: number;
}

export interface IParentDashboardData {
    studentName: string;
    studentGrade: string;
    metrics: IParentDashboardMetrics;
    borrowedBooks: IBook[];
    reservedBooks: IBook[];
}

export interface IVerifyMasterPasswordRequest {
    password: string;
}

export interface IVerifyMasterPasswordResponse {
    message: string;
    data: {
        isPasswordMatch: boolean;
    }
}

export interface IParentDashboardResponse {
    message: string;
    data: IParentDashboardData
}