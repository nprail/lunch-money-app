import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { TransactionsPage } from './transactions.page'

const routes: Routes = [
  {
    path: '',
    component: TransactionsPage,
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./transaction-details/transaction-details.module').then(
        (m) => m.TransactionDetailsPageModule
      ),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsPageRoutingModule {}
