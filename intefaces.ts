export interface IgeneralData {
    ReferenceNumber:         string;
    DepositDate:             Date; 
    EnterpriseNumber:        string;
    EnterpriseName:          string;
    Address:                 String;
}

export interface IAddress {
    Box?:         null;
    City?:        string;
    CountryCode?: string;
    Number?:      string;
    PostalCode?:  string;
    Street?:      string;
}

export interface IExerciseDates {
    startDate?: Date;
    endDate?:   Date;
}
