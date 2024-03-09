import { Component, Input } from '@angular/core';
import { IUser } from '@interfaces/user/user.interface';
import { AuthService } from '@services/auth/auth.service';
import { UserEventService } from '@services/user-event/user-event.service';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent {
  @Input() user!: IUser;

  constructor(
    private authService: AuthService,
    private userEventService: UserEventService,
  ) {}

  public logout() {
    this.authService.logout();
    this.userEventService.emit(null);
    window.location.reload();
  }
}
