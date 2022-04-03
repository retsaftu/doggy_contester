import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { NotificationComponent } from '../components/notification/notification.component';
import { NotificationType, SnackBarData } from '../entities/notification.entity';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  private horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  private verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private snackBar:MatSnackBar) { }

  openErrorSnackBar(message: string, action?: string) {
    this.openSnackBar(NotificationType.ERROR, message, action);
  }

  openSuccessSnackBar(message: string, action?: string) {
    this.openSnackBar(NotificationType.SUCCESS, message, action);
  }

  openWarnSnackBar(message: string, action?: string) {
    this.openSnackBar(NotificationType.WARN, message, action);
  }

  openInfoSnackBar(message: string, action?: string) {
    this.openSnackBar(NotificationType.INFO, message, action);
  }

  private openSnackBar(messageType: NotificationType, message: string, action?: string) {
    if(action == undefined) {
      action = 'Close';
    }
    this.snackBar.openFromComponent(NotificationComponent, {
       data: new SnackBarData(message, action, messageType),
       duration: 5000,
       horizontalPosition: this.horizontalPosition,
       verticalPosition: this.verticalPosition,
    });
  }
}
