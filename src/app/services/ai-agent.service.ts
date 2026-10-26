import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_ENDPOINTS, IAiAgentRequest, IAiAgentResponse } from "../core";

@Injectable({
  providedIn: 'root'
})
export class AiBotService {
  private http = inject(HttpClient);

  sendMessage(message: string, conversationId?: string): Observable<IAiAgentResponse> {
    const body: IAiAgentRequest = {
      message,
      conversationId
    };

    return this.http.post<IAiAgentResponse>(
      API_ENDPOINTS.students.chatBot,
      body
    );
  }
}