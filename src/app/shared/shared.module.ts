import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CategoryDialogComponent } from './components/category-dialog/category-dialog.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { LogoComponent } from './components/logo/logo.component';
import { SearchComponent } from './components/search/search.component';
import { UserCardComponent } from './components/user-card/user-card.component';
import { CategoryBackgroundColorPipe } from './pipes/category-background-color.pipe';
import { CategoryTextColorPipe } from './pipes/category-text-color.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
  declarations: [
    CategoryBackgroundColorPipe,
    CategoryDialogComponent,
    CategoryTextColorPipe,
    ConfirmDialogComponent,
    LogoComponent,
    SearchComponent,
    TruncatePipe,
    UserCardComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatTooltipModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [
    CategoryBackgroundColorPipe,
    CategoryDialogComponent,
    CategoryTextColorPipe,
    LogoComponent,
    SearchComponent,
    TruncatePipe,
    UserCardComponent,
  ],
})
export class SharedModule {}
