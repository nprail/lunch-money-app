import { ApiService } from './../services/api.service'
import { Component, OnInit } from '@angular/core'
import { Transaction } from 'lunch-money'

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

  getCategory(id: number) {
    return this.categories.find((c) => c.id === id)
  }

  amountColor(transaction: Transaction) {
    if (!transaction.amount.startsWith('-')) {
      return 'success'
    } else {
      return null
    }
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
