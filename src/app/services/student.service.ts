import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_ENDPOINTS, IStudentExistsResponse, IStudentOnboardingPayload, IStudentOnboardingResponse } from "../core";

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);

    private readonly DEVICE_ID_KEY = 'ora_device_id';
    deviceId = localStorage.getItem(this.DEVICE_ID_KEY);
    accessToken = localStorage.getItem('token');

  onboardStudent(payload: IStudentOnboardingPayload): Observable<IStudentOnboardingResponse> {
    return this.http.post<IStudentOnboardingResponse>(API_ENDPOINTS.students.onboard, payload,{
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        deviceId: `${this.deviceId}`
      }
    });
  }
  
  verifyStudentDataExists(): Observable<IStudentExistsResponse> {
    return this.http.post<IStudentExistsResponse>(API_ENDPOINTS.students.dataExists, {},{
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        deviceId: `${this.deviceId}`
      }
    });
  }
}