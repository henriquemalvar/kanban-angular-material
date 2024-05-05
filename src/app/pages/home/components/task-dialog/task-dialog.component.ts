import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of, tap } from 'rxjs';

import { CategoryEventService } from '@services/category-event/category-event.service';
import { CategoryService } from '@services/category/category.service';
import { TaskEventService } from '@services/task-event/task-event.service';
import { TaskService } from '@services/task/task.service';

import { ICategory } from '@interfaces/category/category.interface';
import { IOption } from '@interfaces/option/option.interface';
import { ITask } from '@interfaces/task/task.interface';
import { IUser } from '@interfaces/user/user.interface';

import { AuthService } from '@services/auth/auth.service';
import { CategoryDialogComponent } from '@shared/components/category-dialog/category-dialog.component';

interface DialogData {
  task?: ITask;
  status: string;
}

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
})
export class TaskDialogComponent implements OnInit {
  public form!: FormGroup;
  public mode: 'create' | 'update';
  public user!: IUser;

  public categoriesOptions: ICategory[] = [];
  public statusOptions: IOption[] = [
    { label: 'Não iniciado', value: 'Não iniciado' },
    { label: 'Em progresso', value: 'Em progresso' },
    { label: 'Completo', value: 'Completo' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<TaskDialogComponent>,
    private cardService: TaskService,
    private authService: AuthService,
    private taskEventService: TaskEventService,
    private categoryEventService: CategoryEventService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.mode = data.task ? 'update' : 'create';
    this.form = this.formBuilder.group({
      user_id: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: [data.status || '', Validators.required],
      categories_ids: [[], Validators.required],
    });

    if (this.mode === 'update') {
      this.form.patchValue({
        user_id: this.data?.task?.user_id || this.user?.id || '',
        title: this.data?.task?.title || '',
        description: this.data?.task?.description || '',
        status: this.data?.task?.status || this.data.status || '',
        categories_ids:
          this.data?.task?.categories?.map(
            (category: ICategory) => category.id
          ) || [],
      });
    }
  }

  async ngOnInit(): Promise<void> {
    this.authService.getCurrentUser().subscribe((user: IUser | null) => {
      if (user) {
        this.user = user;
        this.form.patchValue({ user_id: this.user.id });
        this.loadCategories();
      }
    });

    this.categoryEventService.get().subscribe(() => {
      this.loadCategories();
    });
  }

  private async loadCategories() {
    if (!this.user || !this.user.id) {
      return;
    }

    this.categoryService.get(this.user?.id).subscribe((categories) => {
      if (!categories || categories.length === 0) {
        return;
      }

      this.categoriesOptions = categories;
    });
  }

  public onSubmit(): void {
    // if (this.form.invalid) {
    //   this.openSnackBar('Preencha todos os campos obrigatórios!');
    //   return;
    // }

    const action =
      this.mode === 'create' ? this.createTask() : this.updateTask();

    action
      .pipe(
        tap((res) => {
          this.dialogRef.close(res);
          this.taskEventService.emit();
          const message =
            this.mode === 'create'
              ? 'Tarefa criada com sucesso!'
              : 'Tarefa atualizada com sucesso!';
          this.openSnackBar(message);
        }),
        catchError((err) => {
          this.openSnackBar('Erro ao processar a tarefa!');
          return of(null);
        })
      )
      .subscribe();
  }

  private createTask() {
    return this.cardService.create(this.user.id, this.form.value);
  }

  private updateTask() {
    return this.cardService.update(this.data.task?.id || '', this.form.value);
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public getSelectedCategories(): ICategory[] {
    const categories_ids = this.form.get('categories_ids')?.value;
    return (
      this.categoriesOptions.filter((category) =>
        categories_ids.includes(category.id)
      ) || []
    );
  }

  public hasError(controlName: string, errorName: string) {
    const control = this.form.get(controlName);
    return control?.hasError(errorName) && control?.touched;
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', { duration: 3000 });
  }

  public openCategoryDialog(): void {
    this.dialog.open(CategoryDialogComponent, {
      width: '600px',
      disableClose: true,
    });
  }
}
