import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { API_ENDPOINTS, IParentDashboardResponse, IVerifyMasterPasswordRequest, IVerifyMasterPasswordResponse } from "../core";

@Injectable({ 
    providedIn: 'root' 
})
export class ParentDashboardService {
    private readonly PARENT_ACCESS_KEY = 'parent_dashboard_access';
    private readonly DEVICE_ID_KEY = 'ora_device_id';
    deviceId = localStorage.getItem(this.DEVICE_ID_KEY);
    accessToken = localStorage.getItem('token');

    headers = {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        deviceId: `${this.deviceId}`
      }
    }

    private http = inject(HttpClient);

    verifyMasterPassword(masterPassword: string): Observable<IVerifyMasterPasswordResponse> {
        const body: IVerifyMasterPasswordRequest = { password: masterPassword };
        
        return this.http.post<IVerifyMasterPasswordResponse>(API_ENDPOINTS.students.verifyMasterPassword, body, this.headers)
        .pipe(
            tap((res) => {
                if (res.data.isPasswordMatch) {
                    localStorage.setItem(this.PARENT_ACCESS_KEY, 'true');
                }
            })
        );
    }

    getDashboard(): Observable<IParentDashboardResponse> {
        return this.http.get<IParentDashboardResponse>(API_ENDPOINTS.students.parentDashboard,  this.headers);
    }

    hasParentAccess(): boolean {
        return localStorage.getItem(this.PARENT_ACCESS_KEY) == 'true';
    }

    clearParentAccess(): void {
        localStorage.removeItem(this.PARENT_ACCESS_KEY);
    }
}