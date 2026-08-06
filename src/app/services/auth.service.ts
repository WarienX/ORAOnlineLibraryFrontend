// auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { API_ENDPOINTS, UserRole } from '../core';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private readonly GOOGLE_CLIENT_ID = '521672049311-ijfi6ef7gnlovolmjatgfso95kcctkvt.apps.googleusercontent.com';

  private readonly DEVICE_ID_KEY = 'ora_device_id';

  constructor() {
    // Restore user from localStorage if available
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  /**
   * Login with Google using Access Token
   */
  loginWithGoogle() {
    const client = google.accounts.oauth2.initTokenClient({
      client_id: this.GOOGLE_CLIENT_ID,
      scope: 'email profile openid',
      callback: (response: any) => {
        console.log("Login with Google resp");
        console.log({ response })
        if (response.access_token) {
            console.log("Access Token exist");
            this.handleAccessToken(response.access_token);
        } else {
          console.error('No access token received', response);
        }
      },
      error_callback: (error: any) => {
        console.error('Google login error:', error);
      }
    });

    // This opens the Google popup
    client.requestAccessToken();
  }

  /**
   * Handle the access token received from Google
   */
  private handleAccessToken(accessToken: string) {
    // 1. Get user info from Google
    this.http.get(API_ENDPOINTS.google.oauth2, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).subscribe({
      next: (googleUser: any) => {
        console.log({ googleUser })
        const deviceId = localStorage.getItem(this.DEVICE_ID_KEY);
        // 2. Send Google user data + access token to your backend
        this.http.post(API_ENDPOINTS.auth.googleLogin, {
          accessToken: accessToken,
          email: googleUser.email,
          full_name: googleUser.name,
          picture: googleUser.picture,
          googleId: googleUser.sub,
          deviceId: deviceId
        },{
          headers: {
            deviceId: `${deviceId}`
          }
        }).subscribe({
          next: (res: any) => {
            console.log({ res });
            const userData = res.data;
            // 3. Save your backend response
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(userData));

            this.currentUserSubject.next(userData);
            if (userData.role == UserRole.ADMIN) {
              this.router.navigate(['/admin/home']);
            } else {
              if (userData.role == UserRole.STUDENT && res.studentDataExists === false) {
                this.router.navigate(['/student/onboarding']);
              } else {
                this.router.navigate(['/']); // redirect after success
              }
            }
          },
          error: (err) => {
            console.error('Backend authentication failed:', err);
          }
        });
      },
      error: (err) => {
        console.error('Failed to fetch Google user info:', err);
      }
    });
  }

  logout() {
    const deviceId = localStorage.getItem(this.DEVICE_ID_KEY);
    const accessToken = localStorage.getItem('token');
    this.http.post(API_ENDPOINTS.auth.logout, {},{
      headers: {
        Authorization: `Bearer ${accessToken}`,
        deviceId: `${deviceId}`
      }
    }).subscribe({
      next: (res: any) => {
        console.log('Logged out successfully', res);

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
      }
    })
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}