import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from 'src/app/services/auth.service';
import { PokedexFirestoreService } from '../../services/pokedex-firestore.service';
import { ToastrService } from 'ngx-toastr';
import { LoginSignupComponent } from './login-signup.component';
import { of, throwError } from 'rxjs';

// Mock Services
class MockAuthService {
  getAuthState() {
    return of(null); // or mock a user object
  }

  getCurrentUserId() {
    return Promise.resolve('mockUserId');
  }

  logout() {
    return Promise.resolve();
  }
}

class MockToastrService {
  success(message: string, title: string) { }
  error(message: string, title: string) { }
  warning(message: string, title: string) { }
}

class MockPokedexFirestoreService {
  addPokemonForUser(userId: string, pokemonInfo: any) {
    return Promise.resolve();
  }
}

class MockAngularFireAuth {
  createUserWithEmailAndPassword(email: string, password: string) {
    return Promise.resolve({ user: { uid: 'mockUid' } });
  }

  signInWithEmailAndPassword(email: string, password: string) {
    return Promise.resolve({ user: { uid: 'mockUid' } });
  }
}

describe('LoginSignupComponent', () => {
  let component: LoginSignupComponent;
  let fixture: ComponentFixture<LoginSignupComponent>;
  let toastrService: ToastrService;
  let afireAuth: AngularFireAuth;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginSignupComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: ToastrService, useClass: MockToastrService },
        { provide: PokedexFirestoreService, useClass: MockPokedexFirestoreService },
        { provide: AngularFireAuth, useClass: MockAngularFireAuth }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginSignupComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(ToastrService);
    afireAuth = TestBed.inject(AngularFireAuth);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('SignUp', () => {
    it('should show error if passwords do not match', () => {
      spyOn(toastrService, 'error');
      component.registerUser.setValue({
        emailSignUp: 'test@example.com',
        passwordSignUp: 'password123',
        confirmPasswordSignUp: 'differentPassword'
      });

      component.SignUp();

      expect(toastrService.error).toHaveBeenCalledWith('Passwords do not match', 'Error');
    });

    it('should call createUserWithEmailAndPassword on valid form', async () => {
      spyOn(afireAuth, 'createUserWithEmailAndPassword').and.callThrough();
      spyOn(toastrService, 'success');

      component.registerUser.setValue({
        emailSignUp: 'test@example.com',
        passwordSignUp: 'password123',
        confirmPasswordSignUp: 'password123'
      });

      await component.SignUp();

      expect(afireAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(toastrService.success).toHaveBeenCalledWith('User registered successfully', 'Hello');
    });

    it('should handle errors from createUserWithEmailAndPassword', async () => {
      spyOn(afireAuth, 'createUserWithEmailAndPassword').and.returnValue(Promise.reject({ code: 'auth/email-already-in-use' }));
      spyOn(toastrService, 'error');

      component.registerUser.setValue({
        emailSignUp: 'test@example.com',
        passwordSignUp: 'password123',
        confirmPasswordSignUp: 'password123'
      });

      await component.SignUp();

      expect(toastrService.error).toHaveBeenCalledWith('The email address is already in use by another account.', 'Error');
    });
  });

  describe('Login', () => {
    it('should call signInWithEmailAndPassword on valid form', async () => {
      spyOn(afireAuth, 'signInWithEmailAndPassword').and.callThrough();
      spyOn(toastrService, 'success');

      component.loginUser.setValue({
        emailLogin: 'test@example.com',
        passwordLogin: 'password123'
      });

      await component.Login();

      expect(afireAuth.signInWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(toastrService.success).toHaveBeenCalledWith('', 'Welcome');
    });

    it('should handle errors from signInWithEmailAndPassword', async () => {
      spyOn(afireAuth, 'signInWithEmailAndPassword').and.returnValue(Promise.reject(new Error('auth/wrong-password')));
      spyOn(toastrService, 'error');

      component.loginUser.setValue({
        emailLogin: 'test@example.com',
        passwordLogin: 'password123'
      });

      await component.Login();

      expect(toastrService.error).toHaveBeenCalledWith('Error logging in. Please try again', 'Error');
    });
  });


});
