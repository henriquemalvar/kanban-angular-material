import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  public hide = true;
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

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/']);
      return;
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.authService.login(this.form.value).subscribe({
        next: (session) => {
          localStorage.setItem('token', session.token);
          if (session.user.photo && typeof session.user.photo === 'string') {
            session.user.photo = this.userService.getPhotoUrl(
              session.user.photo
            );
          }
          const user = JSON.stringify(session.user);
          localStorage.setItem('user', user);
          this.userEventService.emit(session.user);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.snackBar.open(
            'Falha no login. Por favor, tente novamente.',
            'Fechar',
            {
              duration: 3000,
            }
          );
        },
      });
    }
  }
}
