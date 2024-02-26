import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from '@interfaces/user/user.interface';
import { UserEventService } from '@services/user-event/user-event.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() public menuClick = new EventEmitter();

  public user: User | null = null;

  constructor(
    private userEventService: UserEventService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    if (localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user') || '{}');
    }

    this.userEventService.get().subscribe((user) => {
      this.user = user;
    });
  }
}
