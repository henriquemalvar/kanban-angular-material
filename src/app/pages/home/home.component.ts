import {
  CdkDragDrop,
  CdkDropList,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ITask } from '@interfaces/task/task.interface';
import { IUser } from '@interfaces/user/user.interface';
import { FilterEventService } from '@services/filter-event/filter-event.service';
import { TaskEventService } from '@services/task-event/task-event.service';
import { TaskService } from '@services/task/task.service';

import { AuthService } from '@services/auth/auth.service';
import { TaskDialogComponent } from './components/task-dialog/task-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChildren(CdkDropList) public dropLists!: QueryList<CdkDropList>;
  public headers: string[] = ['Não iniciado', 'Em progresso', 'Completo'];
  public cards: ITask[] = [];
  private user!: IUser;

  constructor(
    private cardService: TaskService,
    private authService: AuthService,
    private taskEventService: TaskEventService,
    private dialog: MatDialog,
    private filterEventService: FilterEventService,
    private snackBar: MatSnackBar
  ) { }

  public ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user: IUser | null) => {
      if (user) {
        this.user = user;
        this.updateCards(user.id);
      }
    });

    this.subscribeToEvents();
  }

  private subscribeToEvents(): void {
    this.taskEventService.get().subscribe(() => {
      if (this.user) {
        this.updateCards(this.user.id);
      }
    });

    this.filterEventService.get().subscribe((filter: string) => {
      if (filter && this.user) {
        this.updateCards(this.user.id, { title: filter });
      }
    });
  }

  private updateCards(userId: string, filter?: { title: string }): void {
    this.cardService.get(userId, filter).subscribe((cards: ITask[]) => {
      this.cards = cards;
    });
  }

  public getCardsByStatus(status: string): ITask[] {
    return this.cards.filter((card) => card.status === status) || [];
  }

  public openDialog(status?: string): void {
    this.dialog.open(TaskDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { status: status },
    });
  }

  public drop(event: CdkDragDrop<ITask[]>): void {
    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const movedItem = event.container.data[event.currentIndex];
      movedItem.status = event.container.id;

      const updatedItem: ITask = {
        id: movedItem.id,
        title: movedItem.title,
        description: movedItem.description,
        status: movedItem.status,
        user_id: movedItem.user?.id!,
        categories_ids: (movedItem.categories?.map((category) => category.id) || []).filter((id): id is string => id !== undefined),
      };

      this.cardService.update(movedItem.id, updatedItem).subscribe({
        next: (updatedCard: ITask) => {
          this.snackBar.open(
            'Status do cartão atualizado com sucesso!',
            'Fechar',
            {
              duration: 2000,
            }
          );
        },
        error: (error: any) => {
          this.snackBar.open(
            'Erro ao atualizar o status do cartão.',
            'Fechar',
            {
              duration: 2000,
            }
          );
        },
      });
    }
  }
}
