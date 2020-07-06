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

  constructor(
    private api: ApiService,
    private toastController: ToastController
  ) {}

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

  public async toggleCleared(ev, transaction: Transaction) {
    ev.stopPropagation()
    ev.preventDefault()

    try {
      transaction.status =
        transaction.status === 'uncleared' ? 'cleared' : 'uncleared'

      const transactionUpdate: TransactionUpdate = {
        transaction: {
          status: transaction.status,
        },
      }

      const update = await this.api.updateTransaction(
        transaction.id,
        transactionUpdate
      )

      this.toast('Transaction updated')
    } catch (err) {
      console.error(err)
      this.toast(err?.error?.message || err?.message || err)
    }
  }

  private async toast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 500,
    })

    await toast.present()
  }
}
