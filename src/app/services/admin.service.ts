import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { API_ENDPOINTS, IAdminBooksListPayload, IAdminBooksListResponse, IAdminBookStatusResponse, IAdminBookStatusUpdatePayload, IStudentBooksListPayload, IStudentBooksListResponse } from "../core";
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

    updateBookStatus(payload: IAdminBookStatusUpdatePayload): Observable<IAdminBookStatusResponse> {
        return this.http.put<IAdminBookStatusResponse>(API_ENDPOINTS.admin.editBookStatus, payload,this.headers);
    }
}