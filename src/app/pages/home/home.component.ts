import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Card } from '@interfaces/card/card.interface';
import { CardService } from '@services/card/card.service';
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
  cards: Card[] = [];

  constructor(
    private cardService: CardService,
    private userEventService: UserEventService,
    private taskEventService: TaskEventService,
    private dialog: MatDialog,
    private filterEventService: FilterEventService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    if (user?.id) {
      this.loadCards(user.id);
    }

    this.subscribeToUserEvents(user);
    this.subscribeToTaskEvents(user);
    this.subscribeToFilterEvents(user);
  }

  subscribeToUserEvents(user: any): void {
    this.userEventService.get().subscribe((user) => {
      if (user?.id) {
        this.loadCards(user.id);
      }
    });
  }

  subscribeToTaskEvents(user: any): void {
    this.taskEventService.get().subscribe(() => {
      if (user?.id) this.loadCards(user.id);
    });
  }

  subscribeToFilterEvents(user: any): void {
    this.filterEventService.get().subscribe((filter) => {
      if (filter) {
        this.cardService.get(user?.id, { title: filter }).subscribe((cards) => {
          if (cards?.length) {
            this.cards = cards;
          }
        });
      }
    });
  }

  loadCards(userId: string): void {
    this.cardService.get(userId).subscribe((cards) => {
      if (cards?.length) {
        this.cards = cards;
      }
    });
  }

  getCardsByStatus(status: string): Card[] {
    return this.cards.filter((card) => card.status === status);
  }

  openDialog(status?: string): void {
    this.dialog.open(TaskDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { status: status, mode: 'create' },
    });
  }
}