// services/google-books.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError } from 'rxjs';
import { API_ENDPOINTS } from '../core';

@Injectable({
  providedIn: 'root'
})
export class GoogleBooksService {
  private http = inject(HttpClient);

  /**
   * Get cover image URL by title + author
   */
  getCoverUrl(title: string, author: string): Observable<string | null> {
    const query = `intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}`;

    return this.http.get<any>(`${API_ENDPOINTS.google.books}?q=${query}&maxResults=1`).pipe(
      map((res) => {
        const book = res.items?.[0];
        return (
          book?.volumeInfo?.imageLinks?.thumbnail ||
          book?.volumeInfo?.imageLinks?.smallThumbnail ||
          null
        );
      }),
      catchError(() => of(null))
    );
  }
}