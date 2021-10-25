export class GlobalVars {
    public static CONF: any;
    public static DATA: any;

    // Reads the label / title for the table from the config
    public get getTableLabel() {
        if(GlobalVars.CONF.structure.stage2TableName)
            return GlobalVars.CONF.structure.stage2TableName;
        else
            return 'Sort the cards according to your valuation'
    }
}