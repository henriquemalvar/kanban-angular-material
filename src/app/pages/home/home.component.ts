import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Task } from '@interfaces/task/task.interface';
import { TaskService } from '@services/task/task.service';
import { FilterEventService } from '@services/filter-event/filter-event.service';
import { TaskEventService } from '@services/task-event/task-event.service';
import { UserEventService } from '@services/user-event/user-event.service';
import { TaskDialogComponent } from './components/task-dialog/task-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  headers: string[] = ['Não iniciado', 'Em progresso', 'Completo'];
  tasks: Task[] = [];

  constructor(
    private taskService: TaskService,
    private userEventService: UserEventService,
    private taskEventService: TaskEventService,
    private dialog: MatDialog,
    private filterEventService: FilterEventService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    if (user?._id) {
      this.loadTasks(user._id);
    }

    this.subscribeToUserEvents(user);
    this.subscribeToTaskEvents(user);
    this.subscribeToFilterEvents(user);
  }

  subscribeToUserEvents(user: any): void {
    this.userEventService.get().subscribe((user) => {
      if (user?._id) {
        this.loadTasks(user._id);
      }
    });
  }

  subscribeToTaskEvents(user: any): void {
    this.taskEventService.get().subscribe(() => {
      if (user?._id) this.loadTasks(user._id);
    });
  }

  subscribeToFilterEvents(user: any): void {
    this.filterEventService.get().subscribe((filter) => {
      if (filter) {
        this.taskService
          .get(user?._id, { title: filter })
          .subscribe((tasks) => {
            if (tasks?.length) {
              this.tasks = tasks;
            }
          });
      }
    });
  }

  loadTasks(userId: string): void {
    this.taskService.get(userId).subscribe((tasks) => {
      if (tasks?.length) {
        this.tasks = tasks;
      }
    });
  }

  getTasksByStatus(status: string): Task[] {
    return this.tasks.filter((tasks) => tasks.status === status);
  }

  openDialog(status?: string): void {
    this.dialog.open(TaskDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { status: status, mode: 'create' },
    });
  }
}
