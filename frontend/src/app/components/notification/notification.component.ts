import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import {faExclamationCircle, faCheckCircle, faInfo, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"
import { NotificationType, SnackBarData } from 'src/app/entities/notification.entity';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackBarData,
              public snackBarRef: MatSnackBarRef<NotificationComponent>) { }

              // message: message,
              // action: action,
              // messageType: messageType,

  icon = faInfo;

  private messageTypeIcon = {
    [NotificationType.ERROR]: faExclamationCircle,
    [NotificationType.SUCCESS]: faCheckCircle,
    [NotificationType.INFO]: faInfo,
    [NotificationType.WARN]: faExclamationTriangle 
  }

  appereanceClass = 'info';

  ngOnInit(): void {
    this.appereanceClass = this.data.messageType;
    this.icon = this.messageTypeIcon[this.data.messageType];
  }
}
