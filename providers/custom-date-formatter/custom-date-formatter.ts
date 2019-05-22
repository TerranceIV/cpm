import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { getISOWeek } from 'date-fns';

@Injectable()
export class CustomDateFormatterProvider extends CalendarDateFormatter {
 
  public dayViewHour({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'HH:mm');
  }
 
  public weekViewTitle({ date, locale }: DateFormatterParams): string {
    const year: string = new DatePipe(locale).transform(date, 'y');
    const weekNumber: number = getISOWeek(date);
    return `Week ${weekNumber} in ${year}`;
  }
 
  public weekViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'E');
  }
 
  public weekViewColumnSubHeader({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'MM/dd');
  }
 
}