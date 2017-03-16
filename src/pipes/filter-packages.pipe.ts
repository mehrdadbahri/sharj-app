import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPackages'
})
@Injectable()
export class FilterPackages implements PipeTransform {
  transform(value: any, customerType, cb1, cb2, cb3, cb4) {
    let cbArray : Boolean[] = [cb1, cb2, cb3, cb4]
    value = value.filter(item => {
      if(customerType == "prepaid") {
        return !item.name.includes("دائمی") && !item.name.includes("TDLTE");;
      }
      if(customerType == "TDLTE") {
        return item.name.includes(customerType);
      }
      return item.name.includes("دائمی");
    });
    let filteredValue : Object[] = [];
    value.forEach((item) => {
      if(customerType == "TDLTE") {
        cbArray[0] = cbArray[1] = cbArray[2] = false;
      }
      let obj : any;
      let index : number = 0;
      for (obj in cbArray){
        if (cbArray[index]){
          switch (index) {
            case 0:
            if(item.name.includes('ساعت')){
              filteredValue.push(item);
            }
            break;
            case 1:
            if (item.name.includes('روز')){
              filteredValue.push(item);
            }
            break;
            case 2:
            if(item.name.includes('هفتگی')){
              filteredValue.push(item);
            }
            break;
            case 3:
            if (item.name.includes('ماه')){
              filteredValue.push(item);
            }
            break;
          }
        }
        index++;
      }
    });
    return filteredValue;
  }
}
