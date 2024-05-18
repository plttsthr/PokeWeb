import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css']
})
export class LoginSignupComponent implements OnInit, OnDestroy {

  registerUser: FormGroup;
  loginUser: FormGroup;
  isLoggedIn: boolean = false;
  private authStateSubscription: Subscription | null = null;

  constructor(
    private fbs: FormBuilder,
    private afireAuthSignUp: AngularFireAuth,
    private fbl: FormBuilder,
    private afireAuthLogin: AngularFireAuth,
    private authService: AuthService
  ) {
    this.registerUser = this.fbs.group({
      emailSignUp: ['', [Validators.required, Validators.email]],
      passwordSignUp: ['', [Validators.required, Validators.minLength(6)]],
      confirmPasswordSignUp: ['', Validators.required],
    });

    this.loginUser = this.fbl.group({
      emailLogin: ['', Validators.required],
      passwordLogin: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Subscribe to auth state changes to update isLoggedIn
    this.authStateSubscription = this.authService.getAuthState().subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.authStateSubscription) {
      this.authStateSubscription.unsubscribe();
    }
  }

  SignUp() {
    const emailToRegister = this.registerUser.value.emailSignUp;
    const passwordToRegister = this.registerUser.value.passwordSignUp;
    const confirmPasswordToRegister = this.registerUser.value.confirmPasswordSignUp;

    if (passwordToRegister !== confirmPasswordToRegister) {
      alert("Passwords don't match.");
    } else {
      this.afireAuthSignUp.createUserWithEmailAndPassword(emailToRegister, passwordToRegister).then((user) => {
        console.log(user);
        alert("User registered successfully.");
      }).catch((error) => {
        console.error(error);
        alert("Error registering user. Please try again.");
      });
    }
  }

  Login() {
    const emailToLogin = this.loginUser.value.emailLogin;
    const passwordToLogin = this.loginUser.value.passwordLogin;

    this.afireAuthLogin.signInWithEmailAndPassword(emailToLogin, passwordToLogin).then((user) => {
      console.log(user);
      alert("Login successful.");
    }).catch((error) => {
      console.error(error);
      alert("Error logging in. Please try again.");
    });
  }

  async Logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.isLoggedIn = false;
      alert('Logged out successfully.');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
}
