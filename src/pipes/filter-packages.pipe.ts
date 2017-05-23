import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPackages'
})
@Injectable()
export class FilterPackages implements PipeTransform {
  transform(value: any, customerType, timeRange) {
    if(customerType == "TDLTE") { // TDLTE only has monthly packages
      timeRange = 'monthly';
    }
    value = value.filter(item => { // filter by customerType
      if(customerType == "prepaid") {
        return !item.name.includes("دائمی") && !item.name.includes("TDLTE");;
      }
      if(customerType == "TDLTE") {
        return item.name.includes(customerType);
      }
      return item.name.includes("دائمی");
    });
    value = value.filter(item => { // filter by timeRange
      if(timeRange == "hourly") {
        return item.name.includes('ساعت');
      }
      if(timeRange == "daily") {
        return item.name.includes('روز');
      }
      if(timeRange == "weekly") {
        return item.name.includes('هفتگی');
      }
      return item.name.includes('ماه');
    });
    return value;
  }
}
