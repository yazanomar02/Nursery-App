import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ISaplingsCategory } from './saplingcategory';
import { SaplingcategoryService } from './saplingcategory.service';
import { EditSaplingcategoryComponent } from './edit-saplingcategory/edit-saplingcategory.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TypeService } from '../sapling-type/type.service';
import { ISaplingType } from '../sapling-type/sapling-type';

@Component({
  selector: 'app-saplingcategory',
  standalone: true,
  imports: [CommonModule,EditSaplingcategoryComponent,  FormsModule, TranslateModule],
  templateUrl: './saplingcategory.component.html',
  styleUrl: './saplingcategory.component.css'
})

export class SaplingcategoryComponent  implements OnInit, OnDestroy{
  saplingsCategorys$!: Observable<ISaplingsCategory[]>;
  modalRefUpdate?: BsModalRef;
  modalRefDelete?: BsModalRef;
  modalRefAdd?: BsModalRef;
  message?: string;

  typeName! : string ;
  types!: ISaplingType[];
  types$!: Observable<ISaplingType[]>;

  saplingsCategorys: ISaplingsCategory[] = [];
  private subscription!: Subscription;
  
  private _searchWord: string = "";
  public get searchWord() : string {
    return this._searchWord
  }
  public set searchWord(v : string) {
    this._searchWord = v;
  }

  constructor(private saplingsCategoryService: SaplingcategoryService,
              private modalService: BsModalService,
              private typeService : TypeService,
              private translate: TranslateService) {
                translate.addLangs(["en", "ar"]);
               }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    
    this.types$ = this.typeService.getSaplingTypes();

    this.subscription = this.typeService.getSaplingTypes().subscribe(saplingTypes => {
      this.types = saplingTypes;
    });

    this.saplingsCategorys$ = this.saplingsCategoryService.getSaplingsCategorys();

    this.subscription = this.saplingsCategorys$.subscribe(saplingsCategorys => {
      this.saplingsCategorys = saplingsCategorys;
    });
  }
  getTypeName(typeId: string): string {
    const type = this.types.find(t => t.id === typeId);
    return type ? type.name : 'Unknown'; 
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
    this.saplingsCategoryService.deleteSaplingsCategory(id)
    .subscribe(
      response => {
        console.log('SaplingsCategory deleted successfully', response);
        window.location.reload();
      },
      error => {
        console.error('Error deleting saplingsCategory', error);
      }
    );

    this.modalRefDelete?.hide();
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRefDelete?.hide();
  }

  searchSaplingsCategory(event?: Event) {
    if (event) {
      event.preventDefault(); // لمنع إعادة تحميل الصفحة
    }
  
    if (this.searchWord.trim() === '') {
      // إذا كانت الكلمة فارغة، يتم إعادة جميع الشركات
      this.saplingsCategorys$.subscribe(saplingsCategorys => {
        this.saplingsCategorys = saplingsCategorys;
      });
    }

    else {
      this.saplingsCategorys$.subscribe(saplingsCategorys => {
        this.saplingsCategorys = saplingsCategorys.filter(c => 
          c.name.toLocaleLowerCase().includes(this._searchWord.toLocaleLowerCase()) 
          //||
        //  c.lastName.toLocaleLowerCase().includes(this._searchWord.toLocaleLowerCase())
        );
      });
    }
  }
}

