import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services';

@Component({
  selector: 'app-login',
  imports: [MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private authService = inject(AuthService);
  isLoading = signal(false);

  title = signal("Login Page");
  loginForm = signal({
    googleId: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    role: "student"
  })

  loginWithGoogle() {
    console.log('Login with Google clicked');
    // Integrate your Google Auth logic here
    this.isLoading.set(true);
    this.authService.loginWithGoogle();
  }
}
