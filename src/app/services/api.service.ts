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

interface EndpointOptions {
  [s: string]: any
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private base = 'https://dev.lunchmoney.app'
  private token = 'YOUR_TOKEN_HERE'

  constructor(private http: HttpClient) {}

  private getParams(
    endpoint: string,
    opts: EndpointOptions = {}
  ): { url: string; headers: HttpHeaders } {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
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

  async getCategories(): Promise<any> {
    const response = await this.get('/v1/categories')
    return response.categories
  }

  async getAccounts(): Promise<PlaidAccount[]> {
    const response = await this.get('/v1/plaid_accounts')
    return response.plaid_accounts
  }
}
