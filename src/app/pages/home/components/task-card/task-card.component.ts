import { Component, OnInit, Input } from "@angular/core";

import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

import { Card } from "@interfaces/card/card.interface";
import { User } from "@interfaces/user/user.interface";

import { AuthService } from "@services/auth/auth.service";
import { CardService } from "@services/card/card.service";
import { TaskEventService } from "@services/task-event/task-event.service";

import { TaskDialogComponent } from "../task-dialog/task-dialog.component";
import { ConfirmDialogComponent } from "@shared/components/confirm-dialog/confirm-dialog.component";


@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent implements OnInit {
  @Input() task!: Card;
  user!: User;

  constructor(
    private matDialog: MatDialog,
    private cardService: CardService,
    private authService: AuthService,
    private taskEventService: TaskEventService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.authService
      .getCurrentUser()
      .subscribe((user) => {
        if (user) {
          this.user = user;
        }
      })
      .unsubscribe();
  }

  editTask(task: Card) {
    this.matDialog.open(TaskDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        task,
        mode: 'update',
      },
    });
  }

  deleteTask(task: Card) {
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
