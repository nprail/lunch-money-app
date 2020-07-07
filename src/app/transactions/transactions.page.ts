import { ApiService, TransactionUpdate } from './../services/api.service'
import { Component, OnInit } from '@angular/core'
import { Transaction } from 'lunch-money'
import { ToastController } from '@ionic/angular'

@Component({
  selector: 'app-transactions',
  templateUrl: 'transactions.page.html',
  styleUrls: ['transactions.page.scss'],
})
export class TransactionsPage implements OnInit {
  transactions: Transaction[]
  categories: any[]

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.getData()
  }

  async getData(event?: any) {
    this.categories = await this.api.getCategories()
    this.transactions = await this.api.getTransactions({
      debit_as_negative: true,
    })

    this.transactions = this.transactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    event?.target?.complete()
  }
}
