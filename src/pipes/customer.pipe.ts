import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customerPipe'
})
@Injectable()
export class CustomerPipe implements PipeTransform {
  transform(value: any, args) {
    value = value + ''; // make sure it's a string
    if(value.includes('دائمی')) {
      return "ویژه مشترکین دائمی";
    }
    if(value.includes('TDLTE')) {
      return "ویژه مشترکین TDLTE";
    }
    if (value.includes("شگفت انگیز")) {
      return "ویژه مشترکین اعتباری و دائمی";
    }
    return "ویژه مشترکین اعتباری";
  }
}
