export class ContestInfo {
    id: number;
    contestTitle: string;
    numberOfParticipants: number;
    ownerUsername: string;
    startDate: Date;

    constructor(id: number, contestTitle: string, numberOfParticipants: number, ownerUsername: string, startDate: Date) {
        this.id = id;
        this.contestTitle = contestTitle;
        this.numberOfParticipants = numberOfParticipants;
        this.ownerUsername = ownerUsername;
        this.startDate = startDate;
    }
}