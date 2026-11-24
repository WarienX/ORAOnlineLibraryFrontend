import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { API_ENDPOINTS, IAdminAddBookReqBody, IAdminAddNewBookResponse, IAdminBooksListPayload, IAdminBooksListResponse, IAdminBookStatusResponse, IAdminBookStatusUpdatePayload, IAdminDashboardAPIResponse, IAdminEditBookReqBody, IAdminStudentsListResponse, IStudentBooksListPayload, IStudentBooksListResponse } from "../core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
    private http = inject(HttpClient);

    private readonly DEVICE_ID_KEY = 'ora_device_id';
    deviceId = localStorage.getItem(this.DEVICE_ID_KEY);
    accessToken = localStorage.getItem('token');

    headers = {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        deviceId: `${this.deviceId}`
      }
    }

    getAdminBooksList(payload?: IAdminBooksListPayload): Observable<IAdminBooksListResponse> {
        return this.http.post<IAdminBooksListResponse>(API_ENDPOINTS.admin.list, payload,this.headers);
    }

    addAdminBook(payload: IAdminAddBookReqBody): Observable<IAdminAddNewBookResponse> {
      return this.http.post<IAdminAddNewBookResponse>(API_ENDPOINTS.admin.createBook, payload,this.headers);
    }

    editAdminBook(payload: IAdminEditBookReqBody): Observable<IAdminAddNewBookResponse> {
      return this.http.put<IAdminAddNewBookResponse>(API_ENDPOINTS.admin.editBook, payload,this.headers);
    }

    updateBookStatus(payload: IAdminBookStatusUpdatePayload): Observable<IAdminBookStatusResponse> {
        return this.http.put<IAdminBookStatusResponse>(API_ENDPOINTS.admin.editBookStatus, payload,this.headers);
    }

    getAdminStudentsList(): Observable<IAdminStudentsListResponse> {
        return this.http.get<IAdminStudentsListResponse>(API_ENDPOINTS.admin.studentsList,this.headers);
    }
    
    getAdminDashboardMetrics(): Observable<IAdminDashboardAPIResponse> {
        return this.http.get<IAdminDashboardAPIResponse>(API_ENDPOINTS.admin.dashboardStats,this.headers);
    }
}