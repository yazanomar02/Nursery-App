import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ICompany } from './company';
import { delay, finalize, Observable, Subscription } from 'rxjs';
import { CompanyService } from './company.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EditCompanyComponent } from './edit-company/edit-company.component';
import { FormsModule, NgModel } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule, EditCompanyComponent, FormsModule,  TranslateModule],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent implements OnInit, OnDestroy{
  companies$!: Observable<ICompany[]>;
  companies: ICompany[] = [];
  modalRefUpdate?: BsModalRef;
  modalRefDelete?: BsModalRef;
  message?: string;
  private subscription!: Subscription;

  private _searchWord: string = "";
  public get searchWord() : string {
    return this._searchWord
  }
  public set searchWord(v : string) {
    this._searchWord = v;
  }

  constructor(private companyService: CompanyService, private modalService: BsModalService, private translate: TranslateService) {
    translate.addLangs(["en", "ar"]);
    // translate.setDefaultLang("ar");
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.companies$ = this.companyService.getCompanies();

    this.subscription = this.companies$.subscribe(companies => {
      this.companies = companies;
    });
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
    this.companyService.deleteCompany(id)
    .subscribe(
      response => {
        console.log('Company deleted successfully', response);
        window.location.reload();
      },
      error => {
        console.error('Error deleting company', error);
      }
    );

    this.modalRefDelete?.hide();
  }
 
  decline(): void {
    this.message = 'Declined!';
    this.modalRefDelete?.hide();
  }

  searchCompany(event?: Event) {
    if (event) {
      event.preventDefault(); // لمنع إعادة تحميل الصفحة
    }
  
    if (this.searchWord.trim() === '') {
      // إذا كانت الكلمة فارغة، يتم إعادة جميع الشركات
      this.companies$.subscribe(companies => {
        this.companies = companies;
      });
    }

    else {
      this.companies$.subscribe(companies => {
        this.companies = companies.filter(c => 
          c.name.toLocaleLowerCase().includes(this._searchWord.toLocaleLowerCase())
        );
      });
    }
  }
}
