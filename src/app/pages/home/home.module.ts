import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { SharedModule } from 'src/app/shared/shared.module';
import { TaskCardModule } from './components/task-card/task-card.module';
import { TaskDialogModule } from './components/task-dialog/task-dialog.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    DragDropModule,
    MatGridListModule,
    MatMenuModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatTooltipModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    SharedModule,
    TaskCardModule,
    TaskDialogModule,
  ],
})
export class HomeModule {}
