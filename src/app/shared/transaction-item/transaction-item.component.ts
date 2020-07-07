import { ApiService } from './../../services/api.service'
import { Transaction } from 'lunch-money'
import { Component, OnInit, Input } from '@angular/core'
import { TransactionUpdate } from 'src/app/services/api.service'
import { ToastController } from '@ionic/angular'

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.scss'],
})
export class TransactionItemComponent implements OnInit {
  @Input() transaction: Transaction
  @Input() categories: any[]
  @Input() hideClearButton = false

  constructor(
    private api: ApiService,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  public getCategory(id: number) {
    return this.categories.find((c) => c.id === id)
  }

  public amountColor(transaction: Transaction) {
    if (!transaction.amount.startsWith('-')) {
      return 'success'
    } else {
      return null
    }
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

      await this.api.updateTransaction(transaction.id, transactionUpdate)

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
