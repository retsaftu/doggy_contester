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
    private email: string;
    private password: string;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}

export class UserBasicInfo {
    constructor(public username: string, public _id: string, public avatar?: string | null, public about?: string) {}
}

export class UserProfileInfo {
    constructor(public name: string, public username: string, public about?: string) {}
}

export class UserLeaderboard {
    constructor(public username: string, public name: string, public solved: number) {}
}

