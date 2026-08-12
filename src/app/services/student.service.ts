import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_ENDPOINTS, IStudentBooksListPayload, IStudentBookStatusPayload, IStudentBookStatusResp, IStudentExistsResponse, IStudentOnboardingPayload, IStudentOnboardingResponse } from "../core";
import { IStudentBooksListResponse } from "../core/interfaces/books.interface";

@Injectable({
  providedIn: 'root'
})
export class StudentService {
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

  onboardStudent(payload: IStudentOnboardingPayload): Observable<IStudentOnboardingResponse> {
    return this.http.post<IStudentOnboardingResponse>(API_ENDPOINTS.students.onboard, payload,this.headers);
  }
  
  verifyStudentDataExists(): Observable<IStudentExistsResponse> {
    return this.http.post<IStudentExistsResponse>(API_ENDPOINTS.students.dataExists, {},this.headers);
  }

  getBooksList(payload?: IStudentBooksListPayload): Observable<IStudentBooksListResponse> {
    return this.http.post<IStudentBooksListResponse>(API_ENDPOINTS.students.books, payload,this.headers);
  }

  updateBookStatus(payload: IStudentBookStatusPayload): Observable<IStudentBookStatusResp> {
    return this.http.patch<IStudentBookStatusResp>(API_ENDPOINTS.students.bookStatus, payload,this.headers);
  }
}