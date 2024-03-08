import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IUser } from '@interfaces/user/user.interface';
import { AuthService } from '@services/auth/auth.service';
import { UserEventService } from '@services/user-event/user-event.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() public menuClick: EventEmitter<void> = new EventEmitter();

  public user!: IUser;

  constructor(
    private authService: AuthService,
    private userEventService: UserEventService,
    public dialog: MatDialog
  ) {}

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
}
