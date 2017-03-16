import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trafficDetailPipe'
})
@Injectable()
export class TrafficDetailPipe implements PipeTransform {
  transform(value: any, args) {
    value = value + ''; // make sure it's a string
    if(value.includes('ظهر')) {
      return "6 صبح تا 12 ظهر";
    }
    value = value.replace(/اینترنت ایرانسل ((ساعتی)|(روزانه)|(هفتگی)|(ماهانه)) - /g, "");
    value = value.replace('اینترنت ثابت TDLTE - ','');
    value =  value.replace('(مشترکین دائمی)', '');
    value = value.replace(/\(|\)/g, '');
    value = value.replace(/\d+ تومانی/g, '');
    value = value.replace('مشترکین اعتباری', '');
    value = value.replace('یک', '1');
    value = value.replace('دو', '2');
    value = value.replace('سه', '3');
    value = value.replace('شش', '6');
    value = value.replace(/(\d+)\s*((روزه)|(ماهه)|(ساعته))/g, '');
    return value;
  }
}
