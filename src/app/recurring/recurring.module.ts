import { IonicModule } from '@ionic/angular'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RecurringPage } from './recurring.page'

import { RecurringPageRoutingModule } from './recurring-routing.module'

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: RecurringPage }]),
    RecurringPageRoutingModule,
  ],
  declarations: [RecurringPage],
})
export class RecurringPageModule {}
