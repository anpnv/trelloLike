import { Card } from "./card";

export class Column {
    id?: number;
    idString?: string;
    title?: string;
    boardId?: number;
    cards?: Card[];
    pos?: number;

    constructor(data: any) {
        this.id = data.id;
        this.idString = data.id+"+"+data.title;
        this.title = data.title;
        this.boardId = data.boardId;
        this.cards = data.cards;
        this.pos = data.pos;
    }
}