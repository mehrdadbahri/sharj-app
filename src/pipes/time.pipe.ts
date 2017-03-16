import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timePipe'
})
@Injectable()
export class TimePipe implements PipeTransform {
  transform(value: any, args) {
    value = value + ''; // make sure it's a string
    if(value.includes('روزانه')){
      if(!value.includes('روزه')) {
        return "یک روزه";
      }
    }
    if(value.includes('ماهانه')) {
      if(!value.includes('ماهه')) {
        return "یک ماهه";
      }
    }
    if(value.includes('هفتگی')) {
      return "یک هفته‌ای"
    }
    value = value.replace('یک', '1');
    value = value.replace('دو', '2');
    value = value.replace('سه', '3');
    value = value.replace('شش', '6');
    const regex = /(\d+)\s*((روزه)|(ماهه)|(ساعته))/g;
    let m: any = regex.exec(value);
    if (m){
      return m[1] + ' ' + m[2];
    }
  }
}
