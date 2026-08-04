import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { API_ENDPOINTS, ICreateGradePayload, IGrade, IGradeListResponse } from "../core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GradeService {
    private http = inject(HttpClient);

    createGrade(payload: ICreateGradePayload): Observable<IGrade> {
        return this.http.post<IGrade>(API_ENDPOINTS.grades.create, payload);
    }

    getGrades(): Observable<IGradeListResponse> {
        return this.http.get<IGradeListResponse>(API_ENDPOINTS.grades.list);
    }
}