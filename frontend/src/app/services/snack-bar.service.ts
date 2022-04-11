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

  private horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  private verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private snackBar:MatSnackBar) { }

  openErrorSnackBar(message: string, duration?: number, action?: string) {
    this.openSnackBar(NotificationType.ERROR, message, duration, action);
  }

  openSuccessSnackBar(message: string, duration?: number, action?: string) {
    this.openSnackBar(NotificationType.SUCCESS, message, duration, action);
  }

  openWarnSnackBar(message: string, duration?: number, action?: string) {
    this.openSnackBar(NotificationType.WARN, message, duration, action);
  }

  openInfoSnackBar(message: string, duration?: number, action?: string) {
    this.openSnackBar(NotificationType.INFO, message, duration, action);
  }

  private openSnackBar(messageType: NotificationType, message: string, duration?: number, action?: string) {
    if(action == undefined) {
      action = 'Close';
    }
    const settings: any = {
      data: new SnackBarData(message, action, messageType),
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: 'snackbar'
    }
    if(duration) {
      settings['duration'] = duration;
    }
    this.snackBar.openFromComponent(NotificationComponent, settings);
  }
}
