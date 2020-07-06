import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoneyPipe } from './money.pipe';



@NgModule({
  declarations: [MoneyPipe],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
