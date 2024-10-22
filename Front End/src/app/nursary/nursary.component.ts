import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { EditCompanyComponent } from '../company/edit-company/edit-company.component';
import { FormsModule } from '@angular/forms';
import { INursery } from './nursery';
import { map, Observable, Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NursaryService } from './nursary.service';
import { EditNursaryComponent } from './edit-nursary/edit-nursary.component';
import { CompanyService } from '../company/company.service';
import { ICompany } from '../company/company';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-nursary',
  standalone: true,
  imports: [CommonModule, EditCompanyComponent, FormsModule, EditNursaryComponent, TranslateModule],
  templateUrl: './nursary.component.html',
  styleUrl: './nursary.component.css'
})
export class NursaryComponent implements OnInit, OnDestroy{
  nursaries$!: Observable<INursery[]>;
  nursaries: INursery[] = [];
  modalRefUpdate?: BsModalRef;
  modalRefDelete?: BsModalRef;
  message?: string;
  private subscription!: Subscription;
  companyNames: { [key: string]: string } = {};  // تخزين أسماء الشركات

  private _searchWord: string = "";
  public get searchWord() : string {
    return this._searchWord
  }
  public set searchWord(v : string) {
    this._searchWord = v;
  }

  constructor(private nursaryService: NursaryService,
              private modalService: BsModalService,
              private companyService: CompanyService,
              private translate: TranslateService) { 
                translate.addLangs(["en", "ar"]);
              }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    const companyId = localStorage.getItem('companyId');
    const role = localStorage.getItem('userRole');

    if (companyId) {
      this.nursaries$ = this.nursaryService.getNurseriesforCompanyActive(companyId);

      this.subscription = this.nursaries$.subscribe(nursaries => {
        this.nursaries = nursaries;
        this.nursaries.forEach(nursary => {
          this.getCompanyName(nursary.companyId);  // جلب اسم الشركة لكل مشتل
        });
      });
    }

    else if(role === 'admin') {
      this.nursaries$ = this.nursaryService.getNursaries();

      this.subscription = this.nursaries$.subscribe(nursaries => {
        this.nursaries = nursaries;
        this.nursaries.forEach(nursary => {
          this.getCompanyName(nursary.companyId);  // جلب اسم الشركة لكل مشتل
        });
      });
    }
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
    this.nursaryService.deleteNursary(id)
    .subscribe(
      response => {
        console.log('Nursary deleted successfully', response);
        window.location.reload();
      },
      error => {
        console.error('Error deleting nursary', error);
      }
    );

    this.modalRefDelete?.hide();
  }
 
  decline(): void {
    this.message = 'Declined!';
    this.modalRefDelete?.hide();
  }

  searchNursary(event?: Event) {
    if (event) {
      event.preventDefault(); // لمنع إعادة تحميل الصفحة
    }
  
    if (this.searchWord.trim() === '') {
      // إذا كانت الكلمة فارغة، يتم إعادة جميع الشركات
      this.nursaries$.subscribe(nursaries => {
        this.nursaries = nursaries;
      });
    }

    else {
      this.nursaries$.subscribe(nursaries => {
        this.nursaries = nursaries.filter(n => 
          n.name.toLocaleLowerCase().includes(this._searchWord.toLocaleLowerCase())
        );
      });
    }
  }

  getCompanyName(companyId: string): void {
    this.companyService.getCompany(companyId).subscribe(company => {
      this.companyNames[companyId] = company.name;  // تخزين الاسم بناءً على ID
    });
  }
}
