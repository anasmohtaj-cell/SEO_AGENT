export type Severity = "info" | "warning" | "error";

export interface Finding{
    pageUrl : string;
    type : string ;
    severity : Severity ;
    message :string;
}