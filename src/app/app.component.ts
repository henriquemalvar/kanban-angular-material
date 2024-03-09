import { Component, OnInit } from '@angular/core';
import { IUser } from '@interfaces/user/user.interface';
import { AuthService } from '@services/auth/auth.service';
import { UserEventService } from '@services/user-event/user-event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public title: string = 'template-angular-material';
  public user!: IUser;

  constructor(
    private authService: AuthService,
    private userEventService: UserEventService
  ) {}

  ngOnInit() {
    this.loadUser();
  }

  private loadUser() {
    this.authService.getCurrentUser().subscribe((user: IUser | null) => {
      if (user) {
        this.user = user;
        this.userEventService.emit(user);
      }
    });
  }
}
