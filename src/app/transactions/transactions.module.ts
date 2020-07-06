import { IonicModule } from '@ionic/angular'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { TransactionsPage } from './transactions.page'

import { TransactionsPageRoutingModule } from './transactions-routing.module'

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TransactionsPageRoutingModule,
  ],
  declarations: [TransactionsPage],
})
export class TransactionsPageModule {}
