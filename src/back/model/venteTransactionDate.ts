/**
 * API de Gestion de la Trésorerie
 *
 * Contact: support@agencevoyage.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface VenteTransactionDate { 
    year?: number;
    month?: VenteTransactionDate.MonthEnum;
    monthValue?: number;
    leapYear?: boolean;
}
export namespace VenteTransactionDate {
    export type MonthEnum = 'JANUARY' | 'FEBRUARY' | 'MARCH' | 'APRIL' | 'MAY' | 'JUNE' | 'JULY' | 'AUGUST' | 'SEPTEMBER' | 'OCTOBER' | 'NOVEMBER' | 'DECEMBER';
    export const MonthEnum = {
        January: 'JANUARY' as MonthEnum,
        February: 'FEBRUARY' as MonthEnum,
        March: 'MARCH' as MonthEnum,
        April: 'APRIL' as MonthEnum,
        May: 'MAY' as MonthEnum,
        June: 'JUNE' as MonthEnum,
        July: 'JULY' as MonthEnum,
        August: 'AUGUST' as MonthEnum,
        September: 'SEPTEMBER' as MonthEnum,
        October: 'OCTOBER' as MonthEnum,
        November: 'NOVEMBER' as MonthEnum,
        December: 'DECEMBER' as MonthEnum
    };
}


