import { Router } from '@angular/router'
import { AuthService } from './../services/auth.service'
import { ApiService } from './../services/api.service'
import { Component, OnInit } from '@angular/core'
import { Plugins } from '@capacitor/core'
import { NgForm } from '@angular/forms'
import { AlertController } from '@ionic/angular'

const { Browser } = Plugins

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    private api: ApiService,
    private auth: AuthService,
    public alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {}

  async openTokenPage() {
    await Browser.open({
      url: 'https://my.lunchmoney.app/developers',
      toolbarColor: '#fbb700',
    })
  }

  async login(data: NgForm) {
    const token = data?.form?.value?.token

    if (token) {
      try {
        console.log(token)
        this.api.tempToken = token

        await this.api.getAccounts()

        this.auth.setToken(token)
        this.router.navigate(['/'])
      } catch (err) {
        console.log(err?.error?.message)
        if (err?.error?.message) {
          this.toast(err?.error?.message)
        }
      } finally {
        this.api.tempToken = null
      }
    }
  }

  async toast(message) {
    const alert = await this.alertController.create({
      message,
      buttons: ['OK'],
    })

    await alert.present()
  }
}
