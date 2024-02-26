import { Component, OnInit } from '@angular/core';
import { User } from '@interfaces/user/user.interface';
import { UserEventService } from '@services/user-event/user-event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'template-angular-material';
  public user: User | null = null;

  constructor(
    private userEventService: UserEventService
  ) {}

  ngOnInit() {
    this.loadUserFromLocalStorage();
    this.subscribeToUserEvents();
  }

  private loadUserFromLocalStorage() {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
    }
  }

  private subscribeToUserEvents() {
    this.userEventService.get().subscribe((user) => {
      this.user = user;
    });
  }
}
