import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  title: string;
  message: string;
  cancelText: string;
  confirmText: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  public title: string = '';
  public message: string = '';
  public cancelText: string = '';
  public confirmText: string = '';

  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData
  ) {
    this.assignData(data);
  }

  private assignData(data: DialogData): void {
    this.title = data.title;
    this.message = data.message;
    this.cancelText = data.cancelText;
    this.confirmText = data.confirmText;
  }

  public onConfirm(): void {
    this.dialogRef.close(true);
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }
}
