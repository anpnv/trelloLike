import { Activity } from "./Activity";
import { Column } from "./column";
import { User } from "./user";


export class Board {
    id: number;
    ownerId: number;
    title: string;
    columns?: Column[];
    collaborater?: number[];
    activities?: Activity[];


    constructor(data: any) {
        this.id = data.id;
        this.ownerId = data.ownerId;
        this.title = data.title;
        this.columns = data.columns;
        this.collaborater = data.collaborater;
        this.activities = data.activities;
    }
}