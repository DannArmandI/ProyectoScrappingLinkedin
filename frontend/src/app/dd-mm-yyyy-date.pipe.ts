import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'ddMmYYYYDate'
})
export class DdMmYYYYDatePipe extends DatePipe implements PipeTransform {

  transform(value: any, args?:any): any {
    return super.transform(value, 'dd/MM/YYYY');
  }
}