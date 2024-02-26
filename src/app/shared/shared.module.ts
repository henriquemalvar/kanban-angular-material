import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { LogoComponent } from './components/logo/logo.component';
import { CategoryBackgroundColorPipe } from './pipes/category-background-color.pipe';
import { CategoryTextColorPipe } from './pipes/category-text-color.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { RouterModule } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserCardComponent } from './components/user-card/user-card.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    TruncatePipe,
    CategoryBackgroundColorPipe,
    CategoryTextColorPipe,
    ConfirmDialogComponent,
    LogoComponent,
    SearchComponent,
    UserCardComponent,
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    RouterModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
  ],
  exports: [
    TruncatePipe,
    CategoryBackgroundColorPipe,
    CategoryTextColorPipe,
    LogoComponent,
    SearchComponent,
    UserCardComponent,
  ],
})
export class SharedModule {}
