import { Component, Input, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ITask } from '@interfaces/task/task.interface';
import { IUser } from '@interfaces/user/user.interface';

import { TaskEventService } from '@services/task-event/task-event.service';
import { TaskService } from '@services/task/task.service';
import { UserEventService } from '@services/user-event/user-event.service';

import { AuthService } from '@services/auth/auth.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent implements OnInit {
  @Input() task!: ITask;
  user!: IUser;

  constructor(
    private matDialog: MatDialog,
    private authService: AuthService,
    private cardService: TaskService,
    private taskEventService: TaskEventService,
    private userEventService: UserEventService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user: IUser | null) => {
      if (user) {
        this.user = user;
      }
    });

    this.userEventService.get().subscribe((user: IUser | null) => {
      if (user) {
        this.user = user;
      }
    });
  }

  editTask(task: ITask) {
    this.matDialog.open(TaskDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        task,
        mode: 'update',
      },
    });
  }

  deleteTask(task: ITask) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '350px',
      disableClose: true,
      data: {
        title: 'Excluir tarefa',
        message: 'Deseja realmente excluir a tarefa?',
        cancelText: 'Cancelar',
        confirmText: 'Excluir',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cardService.delete(task.id).subscribe((response) => {
          this.snackBar.open('Tarefa excluída com sucesso!', 'Fechar', {
            duration: 3000,
          });
        });
        this.taskEventService.emit();
      }
    });
  }
}
