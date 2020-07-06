import { Transaction } from 'lunch-money'
import { ApiService, PlaidAccount } from './../../services/api.service'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import * as moment from 'moment'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { ToastController } from '@ionic/angular'

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.page.html',
  styleUrls: ['./transaction-details.page.scss'],
})
export class TransactionDetailsPage implements OnInit {
  public isLoading = false
  private transactionId: number

  public transaction: Transaction
  public categories: any[]
  public account: PlaidAccount

  public form = new FormGroup({
    date: new FormControl(null),
    payee: new FormControl(null, [Validators.maxLength(150)]),
    category_id: new FormControl(null),
    notes: new FormControl(null, [Validators.maxLength(350)]),
  })

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.transactionId = params.id
      this.getData()
    })
  }

  async getData() {
    this.isLoading = true
    const accounts = await this.api.getAccounts()
    this.categories = await this.api.getCategories()

    this.transaction = await this.api.getTransaction(this.transactionId, {
      debit_as_negative: true,
    })

    this.form.patchValue(this.transaction)

    this.account = accounts.find(
      (a) => a.id === this.transaction.plaid_account_id
    )

    this.isLoading = false
  }

  async updateTransaction() {
    try {
      if (this.form.invalid) {
        return
      }
      const transaction = this.form.value

      const transactionUpdate = {
        transaction: {
          date: moment(transaction.date).format('YYYY-MM-DD'),
          category_id: transaction.category_id,
          payee: transaction.payee,
          notes: transaction.notes,
        },
        debit_as_negative: true,
      }

      await this.api.updateTransaction(this.transaction.id, transactionUpdate)

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

  public amountColor(transaction: Transaction) {
    if (!transaction.amount.startsWith('-')) {
      return 'success'
    } else {
      return null
    }
  }
}
