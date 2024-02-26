import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from '@interfaces/user/user.interface';
import { AuthService } from '@services/auth/auth.service';
import { UserEventService } from '@services/user-event/user-event.service';


@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent {
  @Input() user!: User;

  constructor(
    private authService: AuthService,
    private userEventService: UserEventService,
    private dialog: MatDialog
  ) {}

  public logout() {
    this.authService.logout();
    this.userEventService.emit(null);
    window.location.reload();
  }

}
