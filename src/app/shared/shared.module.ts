import { RouterModule } from '@angular/router'
import { IonicModule } from '@ionic/angular'
import { TransactionItemComponent } from './transaction-item/transaction-item.component'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

@NgModule({
  declarations: [TransactionItemComponent],
  imports: [CommonModule, IonicModule, RouterModule],
  exports: [TransactionItemComponent],
})
export class SharedModule {}
