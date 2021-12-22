import { BehaviorSubject, Subject } from "rxjs";

export class GlobalVars {
    public static CONF: BehaviorSubject<any> = new BehaviorSubject<any>({} as any);
    public static DATA: BehaviorSubject<any> = new BehaviorSubject<any>({} as any);

    // Reads the label / title for the table from the config
    public get getTableLabel() {
        if(GlobalVars.CONF.getValue().structure.stage2TableName)
            return GlobalVars.CONF.getValue().structure.stage2TableName;
        else
            return 'Sort the cards according to your valuation'
    }
}