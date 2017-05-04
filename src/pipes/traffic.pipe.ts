import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trafficPipe'
})
@Injectable()
export class TrafficPipe implements PipeTransform {
  transform(value: any, args) {
    value = value + ''; // make sure it's a string
    const regex = /(\d+\.*\d*)\s*((مگابایت)|(گیگابایت)|(گیگ))/g;
    var traffic : number = 0;
    var unit : string;
    let m: any;
    while ((m = regex.exec(value)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      traffic += parseFloat(m[1]);
      unit = m[2];
      
    }
    if (traffic)
      return traffic + ' ' + unit;
    return 'نامحدود';
  }
}
