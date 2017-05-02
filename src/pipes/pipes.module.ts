import { NgModule } from '@angular/core';
import { TrafficPipe } from './traffic.pipe';
import { CustomerPipe } from './customer.pipe';
import { TimePipe } from './time.pipe';
import { TrafficDetailPipe } from './traffic-detail.pipe';
import { FilterPackages } from './filter-packages.pipe';

@NgModule({
    declarations: [
        TrafficPipe,
        CustomerPipe,
        TimePipe,
        TrafficDetailPipe,
        FilterPackages
    ],
    imports: [
 
    ],
    exports: [
        TrafficPipe,
        CustomerPipe,
        TimePipe,
        TrafficDetailPipe,
        FilterPackages
    ]
})
export class PipesModule {}