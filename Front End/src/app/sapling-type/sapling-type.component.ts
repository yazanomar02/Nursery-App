import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditTypeComponent } from './edit-type/edit-type.component';
import { ISaplingType } from './sapling-type';
import { TypeService } from './type.service';
import { CategoryService } from '../category/category.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-sapling-type',
  standalone: true,
  imports: [CommonModule,EditTypeComponent,  FormsModule, TranslateModule],
  templateUrl: './sapling-type.component.html',
  styleUrl: './sapling-type.component.css'
})

export class SaplingTypeComponent  implements OnInit, OnDestroy{
  types$!: Observable<ISaplingType[]>;
  modalRefUpdate?: BsModalRef;
  modalRefDelete?: BsModalRef;
  modalRefAdd?: BsModalRef;
  message?: string;
  types: ISaplingType[] = [];
  private subscription!: Subscription;
  categoryNames: { [key: string]: string } = {};  // تخزين أسماء المشاتل
  
  private _searchWord: string = "";
  public get searchWord() : string {
    return this._searchWord
  }
  public set searchWord(v : string) {
    this._searchWord = v;
  }


  constructor(private typeService: TypeService,
              private modalService: BsModalService,
              private categoryService: CategoryService,
              private translate: TranslateService) {
                translate.addLangs(["en", "ar"]);
               }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.types$ = this.typeService.getSaplingTypes();

    this.subscription = this.types$.subscribe(types => {
      this.types = types;
      this.types.forEach(type => {
        this.getCategoryName(type.categoryId);  // جلب اسم الشركة لكل مشتل
      });
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
    this.typeService.deleteSaplingType(id)
    .subscribe(
      response => {
        console.log('SaplingType deleted successfully', response);
        window.location.reload();
      },
      error => {
        console.error('Error deleting type', error);
      }
    );

    this.modalRefDelete?.hide();
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRefDelete?.hide();
  }

  searchSaplingType(event?: Event) {
    if (event) {
      event.preventDefault(); // لمنع إعادة تحميل الصفحة
    }
  
    if (this.searchWord.trim() === '') {
      // إذا كانت الكلمة فارغة، يتم إعادة جميع الشركات
      this.types$.subscribe(types => {
        this.types = types;
      });
    }

    else {
      this.types$.subscribe(types => {
        this.types = types.filter(c => 
          c.name.toLocaleLowerCase().includes(this._searchWord.toLocaleLowerCase()) 
          //||
        //  c.lastName.toLocaleLowerCase().includes(this._searchWord.toLocaleLowerCase())
        );
      });
    }
  }

  getCategoryName(categoryId: string): void {
    this.categoryService.getCategory(categoryId).subscribe(category => {
      this.categoryNames[categoryId] = category.name;  // تخزين الاسم بناءً على ID
    });
  }
}

