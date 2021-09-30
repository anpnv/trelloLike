
export class Activity {
    id?: number;
    boardId?: number;
    author?: string;
    actionDetails?: string;
    time?: string;


    constructor(data: Activity) {
        this.id = data.id;
        this.boardId = data.boardId;
        this.author = data.author;
        this.actionDetails = data.actionDetails;
        this.time = data.time;
    }
}