import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICategory } from '@interfaces/category/category.interface';
import { IUser } from '@interfaces/user/user.interface';
import { AuthService } from '@services/auth/auth.service';
import { CategoryEventService } from '@services/category-event/category-event.service';
import { CategoryService } from '@services/category/category.service';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss'],
})
export class CategoryDialogComponent implements OnInit {
  public form: FormGroup;
  public categories: ICategory[] = [];
  public filteredCategories: ICategory[] = [];
  private user!: IUser;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private categoryEventService: CategoryEventService,
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      color: ['#000000', Validators.required],
    });
  }

  public ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
          this.loadCategories(user);
        }
      },
      error: (error) => {
        this.snackBar.open('Erro ao obter usuário atual', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  private loadCategories(user: IUser) {
    this.categoryService.get(user.id).subscribe({
      next: (categories) => {
        this.categories = categories;
        this.filteredCategories = categories;
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar categorias', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  public onCreate(): void {
    if (this.form.valid) {
      this.categoryService.create(this.user.id, this.form.value).subscribe({
        next: (category) => {
          this.categories.push(category);
          this.form.reset();
          this.snackBar.open('Categoria criada com sucesso', 'Fechar', {
            duration: 3000,
          });
          this.categoryEventService.emit();
        },
        error: (error) => {
          this.snackBar.open('Erro ao criar categoria', 'Fechar', {
            duration: 3000,
          });
        },
      });
    }
  }

  public onDelete(id: string | undefined): void {
    if (!id) {
      this.snackBar.open('Erro ao deletar categoria', 'Fechar', {
        duration: 3000,
      });

      return;
    }

    this.categoryService.delete(id).subscribe({
      next: () => {
        this.categories = this.categories.filter(
          (category) => category.id !== id
        );
        this.snackBar.open('Categoria deletada com sucesso', 'Fechar', {
          duration: 3000,
        });
        this.categoryEventService.emit();
        this.loadCategories(this.user);
      },
      error: (error) => {
        this.snackBar.open('Erro ao deletar categoria', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  public close(): void {
    this.dialogRef.close();
  }

  public isCategorySelected(category: ICategory): boolean {
    return this.categories.some((cat) => cat.name === category.name);
  }

  public onSearch(event: Event): void {
    const search = (event.target as HTMLInputElement).value;

    if (search) {
      this.filteredCategories = this.categories.filter((category) =>
        category.name.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      this.filteredCategories = this.categories;
    }
  }
}
