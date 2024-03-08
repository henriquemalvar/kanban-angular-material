import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ISession } from '@interfaces/session/session.interface';
import { IUser } from '@interfaces/user/user.interface';
import { AuthService } from '@services/auth/auth.service';
import { UserEventService } from '@services/user-event/user-event.service';
import { UserService } from '@services/user/user.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {
  public form: FormGroup;
  public displayedImage!: string;
  public selectedFile: File | null = null;
  public hidePassword = true;
  public hideNewPassword = true;
  public user!: IUser;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private userEventService: UserEventService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      new_password: [''],
      photo: [''],
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user: IUser | null) => {
      if (user) {
        this.user = user;
        const { name, email, photo } = this.user;
        this.displayedImage = photo || this.displayedImage;
        this.form.patchValue({ name, email, photo });
        this.form
          .get('new_password')
          ?.setValidators([Validators.required, Validators.minLength(6)]);
        this.form.get('new_password')?.updateValueAndValidity();
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      return;
    }

    const { name, email, password, new_password } = this.form.value;
    const formData: FormData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    if (this.user) {
      formData.append('new_password', new_password);
    }
    if (this.selectedFile) formData.append('file', this.selectedFile);

    if (this.user) {
      await this.updateUser(this.user._id, formData);
    } else {
      await this.createUser(formData);
    }
  }

  private async createUser(formData: FormData): Promise<void> {
    try {
      const user: IUser = await firstValueFrom(
        this.userService.create(formData)
      );
      this.snackBar.open('Usuário criado com sucesso!', 'Fechar', {
        duration: 3000,
      });

      const { email, password } = this.form.value;
      this.authService.login({ email, password }).subscribe({
        next: (session) => this.handleSuccessfulLogin(session),
        error: () => this.handleFailedLogin(),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.snackBar.open(
          'Erro ao criar usuário: ' + error.message,
          'Fechar',
          {
            duration: 3000,
          }
        );
      } else {
        this.snackBar.open('Erro desconhecido ao criar usuário', 'Fechar', {
          duration: 3000,
        });
      }
    }
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

  private async updateUser(id: string, formData: FormData): Promise<void> {
    try {
      const user: IUser = await firstValueFrom(
        this.userService.update(id, formData)
      );
      this.snackBar.open('Usuário atualizado com sucesso!', 'Fechar', {
        duration: 3000,
      });
      if (typeof user.photo === 'string') {
        user.photo = this.userService.getPhotoUrl(user.photo);
      }

      localStorage.setItem('user', JSON.stringify(user));
      this.userEventService.emit(user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.snackBar.open(
          'Erro ao atualizar usuário: ' + error.message,
          'Fechar',
          { duration: 3000 }
        );
      } else {
        this.snackBar.open('Erro desconhecido ao atualizar usuário', 'Fechar', {
          duration: 3000,
        });
      }
    }
  }

  public onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      this.selectedFile = target.files[0];
      this.displayedImage = URL.createObjectURL(this.selectedFile);
    }
  }
}
