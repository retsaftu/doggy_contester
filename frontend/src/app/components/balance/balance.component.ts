import { Component, OnInit } from '@angular/core';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {

  constructor(
    private snackBarService: SnackBarService,
    private userService: UserService
  ) { }

  balance = '0';

  ngOnInit(): void {
  }

  recharge() {
    const balanceStr = this.balance.toString()
    if(balanceStr.length == 0 || balanceStr[0] == '0' || balanceStr.includes('-')) {
      this.snackBarService.openErrorSnackBar('Wrong balance value', 5000);
      return;
    }
    this.userService.recharge(Number(this.balance)).subscribe((res) => {
      this.userService.balance = Number(this.balance);
      this.userService.emitChangeOfUserProfile(this.userService.userInfo);
      this.snackBarService.openSuccessSnackBar('Balance recharged successfully', 5000);
    })
  }

}
