import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ISupplier } from './supplier';
import { SupplierService } from './supplier.service';
import { CommonModule } from '@angular/common';
import { EditSupplierComponent } from './edit-supplier/edit-supplier.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [CommonModule, EditSupplierComponent, FormsModule],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.css'
})
export class SupplierComponent implements OnInit, OnDestroy{
  suppliers$!: Observable<ISupplier[]>;
  modalRefUpdate?: BsModalRef;
  modalRefDelete?: BsModalRef;
  message?: string;
  suppliers: ISupplier[] = [];
  private subscription!: Subscription;

  private _searchWord: string = "";
  public get searchWord() : string {
    return this._searchWord
  }
  public set searchWord(v : string) {
    this._searchWord = v;
  }
  
  constructor(private supplierService: SupplierService, private modalService: BsModalService) {

  }

  ngOnInit(): void {
    this.suppliers$ = this.supplierService.getSuppliers();
    this.subscription = this.suppliers$.subscribe(suppliers => {
      this.suppliers = suppliers;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
    this.supplierService.deleteSupplier(id)
    .subscribe(
      response => {
        console.log('Supplier deleted successfully', response);
        window.location.reload();
      },
      error => {
        console.error('Error deleting supplier', error);
      }
    );

    this.modalRefDelete?.hide();
  }
 
  decline(): void {
    this.message = 'Declined!';
    this.modalRefDelete?.hide();
  }

  searchSupplier(event?: Event) {
    if (event) {
      event.preventDefault(); // لمنع إعادة تحميل الصفحة
    }
  
    if (this.searchWord.trim() === '') {
      // إذا كانت الكلمة فارغة، يتم إعادة جميع الشركات
      this.suppliers$.subscribe(suppliers => {
        this.suppliers = suppliers;
      });
    }

    else {
      this.suppliers$.subscribe(suppliers => {
        this.suppliers = suppliers.filter(s => 
          s.firstName.toLocaleLowerCase().includes(this._searchWord.toLocaleLowerCase()) ||
          s.lastName.toLocaleLowerCase().includes(this._searchWord.toLocaleLowerCase())
        );
      });
    }
  }
}
