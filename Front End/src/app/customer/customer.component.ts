import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ICustomer } from './customer';
import { CustomerService } from './customer.service';
import { CommonModule } from '@angular/common';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, EditCustomerComponent, FormsModule, TranslateModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent implements OnInit, OnDestroy{
  customers$!: Observable<ICustomer[]>;
  modalRefUpdate?: BsModalRef;
  modalRefDelete?: BsModalRef;
  message?: string;
  customers: ICustomer[] = [];
  private subscription!: Subscription;
  
  private _searchWord: string = "";
  public get searchWord() : string {
    return this._searchWord
  }
  public set searchWord(v : string) {
    this._searchWord = v;
  }


  constructor(private customerService: CustomerService,
              private modalService: BsModalService,
              private translate: TranslateService) {
                translate.addLangs(["en", "ar"]);
              }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.customers$ = this.customerService.getCustomers();

    this.subscription = this.customers$.subscribe(customers => {
      this.customers = customers;
    });;
  }

  openModalUpdate(template: TemplateRef<void>) {
    this.modalRefUpdate = this.modalService.show(template);
  }

  closeModalUpdate() {
    this.modalService.hide(this.modalRefUpdate?.id);
  }

  openModalDelete(template: TemplateRef<void>) {
    this.modalRefDelete = this.modalService.show(template, { class: 'modal-sm' });
  }
 
  confirm(id: string): void {
    this.message = 'Confirmed!';
    this.customerService.deleteCustomer(id)
    .subscribe(
      response => {
        console.log('Customer deleted successfully', response);
        window.location.reload();
      },
      error => {
        console.error('Error deleting customer', error);
      }
    );

    this.modalRefDelete?.hide();
  }
 
  decline(): void {
    this.message = 'Declined!';
    this.modalRefDelete?.hide();
  }

  searchCustomer(event?: Event) {
    if (event) {
      event.preventDefault(); // لمنع إعادة تحميل الصفحة
    }
  
    if (this.searchWord.trim() === '') {
      // إذا كانت الكلمة فارغة، يتم إعادة جميع الشركات
      this.customers$.subscribe(customers => {
        this.customers = customers;
      });
    }

    else {
      this.customers$.subscribe(customers => {
        this.customers = customers.filter(c => 
          c.fullName.toLocaleLowerCase().includes(this._searchWord.toLocaleLowerCase())
        );
      });
    }
  }
}
