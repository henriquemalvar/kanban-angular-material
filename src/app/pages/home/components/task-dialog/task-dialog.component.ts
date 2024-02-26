import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap, catchError, of } from 'rxjs';

import { CategoryService } from '@services/category/category.service';
import { CardService } from '@services/card/card.service';
import { TaskEventService } from '@services/task-event/task-event.service';

import { Card } from '@interfaces/card/card.interface';
import { User } from '@interfaces/user/user.interface';
import { IOption } from '@interfaces/ioption/IOption.interface';

interface DialogData {
  task?: Card;
  mode: 'create' | 'update';
  status: string;
}

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
})
export class TaskDialogComponent implements OnInit {
  form!: FormGroup;
  mode: 'create' | 'update';
  user!: User;

  public statusOptions: IOption[] = [
    { label: 'Não iniciado', value: 'Não iniciado' },
    { label: 'Em progresso', value: 'Em progresso' },
    { label: 'Completo', value: 'Completo' },
  ];

  public categoriesOptions: IOption[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<TaskDialogComponent>,
    private cardService: CardService,
    private taskEventService: TaskEventService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.mode = data.mode;
    this.form = this.formBuilder.group({
      user_id: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: [data.status || '', Validators.required],
      categories: [''],
      category_ids: [''],
    });

    if (this.mode === 'update') {
      this.form.get('categories')?.setValidators(Validators.required);
      this.form.get('category_ids')?.setValidators(Validators.required);
      this.form.patchValue({
        user_id: this.data?.task?.user_id || this.user?.id || '',
        title: this.data?.task?.title || '',
        description: this.data?.task?.description || '',
        status: this.data?.task?.status || this.data.status || '',
        categories: this.data?.task?.categories?.map((c) => c.name) || '',
        category_ids: this.data?.task?.categories?.map((c) => c.id) || [],
      });
    }
  }

  async ngOnInit(): Promise<void> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.user = user;

    this.form.patchValue({ user_id: this.user.id });

    await this.loadCategories();
  }

  private async loadCategories() {
    if (!this.user.id) {
      return;
    }

    this.categoryService.get(this.user.id).subscribe((categories) => {
      if (!categories || categories.length === 0) {
        return;
      }

      this.categoriesOptions = categories.map((category) => ({
        value: category.id!,
        label: category.name,
      }));
    });
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.openSnackBar('Preencha todos os campos obrigatórios!');
      return;
    }

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
    const {categories, category_ids, ...rest} = this.form.value;
    return this.cardService.create(this.user.id, rest);
  }

  private updateTask() {
    return this.cardService.update(this.data.task?.id || '', this.form.value);
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public toggleCategory(category: IOption) {
    const categories = this.form.get('categories')?.value || [];
    const category_ids = this.form.get('category_ids')?.value || [];

    if (categories.includes(category.label)) {
      this.form.patchValue({
        categories: categories.filter((c: string) => c !== category.label),
        category_ids: category
          ? category_ids.filter((c: string) => c !== category.value)
          : category_ids,
      });
    }

    if (!categories.includes(category.label)) {
      this.form.patchValue({
        categories: [...categories, category.label],
        category_ids: category
          ? [...category_ids, category.value]
          : category_ids,
      });
    }
  }

  public isCategorySelected(category: string) {
    const categories = this.form.get('categories')?.value || [];
    return categories.includes(category);
  }

  public hasError(controlName: string, errorName: string) {
    const control = this.form.get(controlName);
    return control?.hasError(errorName) && control?.touched;
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', { duration: 3000 });
  }
}
