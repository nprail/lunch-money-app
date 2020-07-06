import { AuthService } from './auth.service'
import { Injectable } from '@angular/core'
import { Transaction, Asset } from 'lunch-money'
import { HttpClient, HttpHeaders } from '@angular/common/http'

export interface TransactionsEndpointOptions {
  tag_id?: number
  recurring_id?: number
  plaid_account_id?: number
  category_id?: number
  asset_id?: number
  offset?: number
  limit?: number
  start_date?: string
  end_date?: string
  debit_as_negative?: boolean
}

export interface SingleTransactionsEndpointOptions {
  debit_as_negative?: boolean
}

export interface PlaidAccount {
  id: number
  date_linked: string
  name: string
  type: string
  subtype: string
  mask: string
  institution_name: string
  status: string
  last_import: string
  balance: string
  currency: string
  balance_last_update: string
  limit: number
}

export interface TransactionUpdate {
  split?: {
    date?: string
    category_id?: number
    notes?: string
    amount?: number | string
  }
  transaction: {
    date?: string
    category_id?: number
    payee?: string
    amount?: number | string
    currency?: string
    asset_id?: number
    recurring_id?: number
    notes?: string
    status?: 'cleared' | 'uncleared'
    external_id?: string
    tags?: Array<string | number>
  }
  debit_as_negative?: boolean
}

interface EndpointOptions {
  [s: string]: any
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private base = 'https://dev.lunchmoney.app'
  public tempToken = null

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getParams(
    endpoint: string,
    opts: EndpointOptions = {}
  ): { url: string; headers: HttpHeaders } {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tempToken || this.auth.accessToken}`,
    })

    const url = new URL(endpoint, this.base)

    if (opts) {
      for (const i in opts) {
        if (opts[i]) {
          url.searchParams.append(i, opts[i])
        }
      }
    }

    return {
      url: url.href,
      headers,
    }
  }

  private async get(endpoint: string, opts?: EndpointOptions): Promise<any> {
    const params = this.getParams(endpoint, opts)
    return this.http.get(params.url, { headers: params.headers }).toPromise()
  }

  private async put(endpoint: string, body?: any): Promise<any> {
    const params = this.getParams(endpoint)

    return this.http
      .put(params.url, body, { headers: params.headers })
      .toPromise()
  }

  async getAssets(): Promise<Asset[]> {
    const response = await this.get('/v1/assets')
    return response.assets
  }

  async getTransactions(
    opts?: TransactionsEndpointOptions
  ): Promise<Transaction[]> {
    const response = await this.get('/v1/transactions', opts)
    return response.transactions
  }

  async getTransaction(
    id: number,
    opts?: SingleTransactionsEndpointOptions
  ): Promise<Transaction> {
    return this.get(`/v1/transactions/${id}`, opts)
  }

  async updateTransaction(id: number, opts: TransactionUpdate) {
    return this.put(`/v1/transactions/${id}`, opts)
  }

  async getCategories(): Promise<any> {
    const response = await this.get('/v1/categories')
    return response.categories
  }

  async getAccounts(): Promise<PlaidAccount[]> {
    const response = await this.get('/v1/plaid_accounts')
    return response.plaid_accounts
  }
}
