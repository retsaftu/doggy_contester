export enum NotificationType {
    ERROR = 'error',
    SUCCESS = 'success',
    WARN = 'warn',
    INFO = 'info'
}

export class SnackBarData {
    message: string;
    action: string;
    messageType: NotificationType;

    constructor(message: string, action: string, messageType: NotificationType) {
        this.message = message;
        this.action = action;
        this.messageType = messageType;
    }

} 