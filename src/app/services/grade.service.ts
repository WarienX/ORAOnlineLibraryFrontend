import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { API_ENDPOINTS, ICreateGradePayload, IEditGradePayload, IGrade, IGradeListResponse, IGradeResponse } from "../core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GradeService {
    private http = inject(HttpClient);

    createGrade(payload: ICreateGradePayload): Observable<IGradeResponse> {
        return this.http.post<IGradeResponse>(API_ENDPOINTS.grades.create, payload);
    }

    getGrades(): Observable<IGradeListResponse> {
        return this.http.get<IGradeListResponse>(API_ENDPOINTS.grades.list);
    }

    updateGrade(payload: IEditGradePayload): Observable<IGradeResponse> {
        return this.http.put<IGradeResponse>(`${API_ENDPOINTS.grades.edit}`, payload);
    }
}