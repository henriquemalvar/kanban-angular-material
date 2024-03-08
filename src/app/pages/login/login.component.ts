import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ISession } from '@interfaces/session/session.interface';
import { IUser } from '@interfaces/user/user.interface';
import { AuthService } from '@services/auth/auth.service';
import { UserEventService } from '@services/user-event/user-event.service';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public form!: FormGroup;
  public hide: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private userEventService: UserEventService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  public ngOnInit(): void {
    this.checkUser();
  }

  private checkUser(): void {
    this.authService.getCurrentUser().subscribe((user: IUser | null) => {
      if (user) {
        this.router.navigate(['/']);
      }
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.login();
    }
  }

  private login(): void {
    this.authService.login(this.form.value).subscribe({
      next: (session: ISession) => this.handleSuccessfulLogin(session),
      error: () => this.handleFailedLogin(),
    });
  }

  private handleSuccessfulLogin(session: ISession): void {
    localStorage.setItem('token', session.token);
    if (session.user.photo) {
      session.user.photo = this.userService.getPhotoUrl(session.user.photo);
    }
    const user = JSON.stringify(session.user);
    localStorage.setItem('user', user);
    this.userEventService.emit(session.user);
    this.router.navigate(['/']);
  }

  private handleFailedLogin(): void {
    this.snackBar.open(
      'Falha no login. Por favor, tente novamente.',
      'Fechar',
      {
        duration: 3000,
      }
    );
  }
}
