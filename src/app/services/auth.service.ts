import { Injectable, EventEmitter } from '@angular/core'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { Storage } from '@ionic/storage'

export const TOKEN_NAME = 'access_token'

@Injectable()
export class AuthService {
  isLoggedIn$ = new Subject()
  isLoggedIn = false

  accessToken: string
  loading = true
  loading$: EventEmitter<boolean> = new EventEmitter()

  constructor(public router: Router, private storage: Storage) {
    this.loading$.subscribe((loading: boolean) => {
      this.loading = loading
    })

    this.isLoggedIn$.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn
    })

    this.init().catch(console.log)
  }

  async init() {
    // Check if user is logged In when Initializing
    this.accessToken = await this.storage.get(TOKEN_NAME)

    const isLoggedIn = !!this.accessToken
    this.isLoggedIn$.next(isLoggedIn)

    this.loading$.emit(false)
  }

  public setToken(token: string): void {
    this.storage.set(TOKEN_NAME, token).catch(console.log)
    this.accessToken = token

    // Set logged in
    this.isLoggedIn$.next(true)

    if (this.loading) {
      this.loading$.emit(false)
    }
  }

  public logout(): void {
    // Remove token from storaged
    this.storage.remove(TOKEN_NAME).catch(console.log)
    this.accessToken = null
    this.isLoggedIn$.next(false)

    // Go back to the login route
    this.router.navigate(['/login']).catch(console.log)
  }

  public isAuthenticated(): boolean {
    return this.isLoggedIn
  }
}
