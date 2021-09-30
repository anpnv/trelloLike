import { User } from "./user";

export class Card {
    id?: number;
    title?: string;
    content?: string;
    ownerId?: number;
    columnId?: number;
    collaborater?: User[];
    pos?: number;
    createAt?: string;
    lastUpdate?: string;
    color?: string;
    fileUrl?: string;



    constructor(data: Card) {
        this.id = data.id;
        this.title = data.title;
        this.content = data.content;
        this.ownerId = data.ownerId;
        this.columnId = data.columnId;
        this.collaborater = data.collaborater;
        this.pos = data.pos;
        this.color = data.color;
        this.createAt = data.createAt;
        this.lastUpdate = data.lastUpdate;
        this.fileUrl = data.fileUrl;
    }
}