import { Asset, Transaction } from 'lunch-money'
import { ApiService, PlaidAccount } from './../services/api.service'
import { Component, OnInit } from '@angular/core'

const accountTypes = {
  cash: {
    label: 'Cash',
    order: 0,
    negative: false,
  },
  credit: {
    label: 'Credit',
    order: 1,
    negative: true,
  },
  loan: {
    label: 'Loan',
    order: 2,
    negative: true,
  },
  brokerage: {
    label: 'Brokerage',
    order: 3,
    negative: false,
  },
  investment: {
    label: 'Investment',
    order: 4,
    negative: false,
  },
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public transactions: Transaction[]
  public categories: any[]
  public monthlySummary: { income: number; expenses: number; net: number }
  public accountOverview: any

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.getData()
  }

  private getAccountType(type: string): string {
    if (type === 'depository') {
      return 'cash'
    }
    return type
  }

  async getData(event?: any) {
    this.accountOverview = await this.getAccountOverview()
    this.monthlySummary = await this.getMonthSummary()

    event?.target?.complete()
  }

  async getAccountOverview() {
    const accounts: PlaidAccount[] = await this.api.getAccounts()
    const assets: Asset[] = await this.api.getAssets()

    const types: any = {}

    for (const account of accounts) {
      const type = this.getAccountType(account.type)

      if (!types[type]) {
        types[type] = {
          accounts: [],
          total: 0,
          type: accountTypes[type],
        }
      }

      types[type].accounts.push(account)
      types[type].total += parseFloat(account.balance)
    }

    let totalNegative = 0
    let totalPositive = 0
    let accountTypesList = []

    for (const i in types) {
      if (types[i]) {
        const account = types[i]
        accountTypesList.push(account)
        if (account.type.negative) {
          totalNegative += Math.abs(account.total)
        } else {
          totalPositive += Math.abs(account.total)
        }
      }
    }

    accountTypesList = accountTypesList.sort(
      (a, b) => a.type.order - b.type.order
    )

    return {
      accounts: accountTypesList,
      net: totalPositive - totalNegative,
    }
  }

  async getMonthSummary() {
    const categories = await this.api.getCategories()
    const transactions = await this.api.getTransactions()

    this.categories = categories
    this.transactions = transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)

    let totalIncome = 0
    let totalExpenses = 0
    for (const transaction of transactions) {
      const category = categories.find((c) => c.id === transaction.category_id)

      if (!category.exclude_from_totals) {
        if (category.is_income) {
          totalIncome += Math.abs(parseFloat(transaction.amount))
        } else {
          totalExpenses += Math.abs(parseFloat(transaction.amount))
        }
      }
    }

    return {
      income: totalIncome,
      expenses: totalExpenses,
      net: totalIncome - totalExpenses,
    }
  }
}
