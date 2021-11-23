export interface Statement {
    id: number,
    //statement: string,
    //color?: string;
    type?: Type,

}

export enum Type {
    AGREE = 1,
    NEUTRAL,
    DISAGREE
}