export class UserRegistrationInfo {
    private username: string;
    private name?: string;
    private password?: string;
    private email: string
  
    constructor(username: string, email: string, name?: string, password?: string) {
        this.username = username;
        this.email = email;
        this.name = name;
        this.password = password;
    }
}

export class UserLoginInfo {
    private username: string;
    private password: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
}

export class UserLeaderboard {
    constructor(public username: string, public name: string, public solved: number) {}
}