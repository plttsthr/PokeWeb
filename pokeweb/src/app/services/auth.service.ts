// Import Injectable decorator from Angular core
import { Injectable } from '@angular/core';
// Import AngularFireAuth for Firebase authentication
import { AngularFireAuth } from '@angular/fire/compat/auth';
// Import Observable for reactive programming
import { Observable } from 'rxjs';
// Import Firebase compatibility package for User type
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root' // Specifies that this service is available throughout the application
})
export class AuthService {

  // Constructor to inject AngularFireAuth service
  constructor(private afAuth: AngularFireAuth) {}

  // Observable for authentication state
  getAuthState(): Observable<firebase.User | null> {
    // Returns an observable of the current authentication state
    return this.afAuth.authState;
  }

  // Get the current user's UID
  async getCurrentUserId(): Promise<string | null> {
    // Retrieves the current user
    const user = await this.afAuth.currentUser;
    // Returns the user's UID if available, otherwise null
    return user?.uid || null;
  }

  // Check if the user is currently logged in
  async isLoggedIn(): Promise<boolean> {
    // Retrieves the current user
    const user = await this.afAuth.currentUser;
    // Returns true if the user is logged in, otherwise false
    return !!user;
  }

  // Log out the current user
  async logout(): Promise<void> {
    // Signs out the current user
    await this.afAuth.signOut();
  }
}
