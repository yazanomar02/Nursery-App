import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IOrder } from './order';
import { OrderService } from './order.service';
import { CommonModule } from '@angular/common';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule,  FormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit, OnDestroy{
  orders$!: Observable<IOrder[]>;
  modalRefUpdate?: BsModalRef;
  modalRefDelete?: BsModalRef;
  message?: string;
  orders: IOrder[] = [];
  private subscription!: Subscription;
  
  private _searchWord: string = "";
  public get searchWord() : string {
    return this._searchWord
  }
  public set searchWord(v : string) {
    this._searchWord = v;
  }


  constructor(private orderService: OrderService, private modalService: BsModalService) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.orders$ = this.orderService.getOrders();

    this.subscription = this.orders$.subscribe(orders => {
      this.orders = orders;
    });;
  }

  openModalUpdate(template: TemplateRef<void>) {
    this.modalRefUpdate = this.modalService.show(template);
  }

  closeModalUpdate() {
    this.modalService.hide(this.modalRefUpdate?.id);
    window.location.reload();
  }

  openModalDelete(template: TemplateRef<void>) {
    this.modalRefDelete = this.modalService.show(template, { class: 'modal-sm' });
  }
 
  confirm(id: string): void {
    this.message = 'Confirmed!';
    this.orderService.deleteOrder(id)
    .subscribe(
      response => {
        console.log('Order deleted successfully', response);
        window.location.reload();
      },
      error => {
        console.error('Error deleting order', error);
      }
    );

    this.modalRefDelete?.hide();
  }
 
  decline(): void {
    this.message = 'Declined!';
    this.modalRefDelete?.hide();
  }

}
