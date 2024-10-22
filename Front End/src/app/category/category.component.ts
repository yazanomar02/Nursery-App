import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ICategory } from './category';
import { Observable, Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CategoryService } from './category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule,EditCategoryComponent,  FormsModule, TranslateModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent  implements OnInit, OnDestroy{
  categories$!: Observable<ICategory[]>;
  modalRefUpdate?: BsModalRef;
  modalRefDelete?: BsModalRef;
  modalRefAdd?: BsModalRef;
  message?: string;
  categories: ICategory[] = [];
  private subscription!: Subscription;
  
  private _searchWord: string = "";
  public get searchWord() : string {
    return this._searchWord
  }
  public set searchWord(v : string) {
    this._searchWord = v;
  }


  constructor(private categoryService: CategoryService,
              private modalService: BsModalService,
              private translate: TranslateService) {
                translate.addLangs(["en", "ar"]);
            }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategorys();

    this.subscription = this.categories$.subscribe(categories => {
      this.categories = categories;
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
    this.categoryService.deleteCategory(id)
    .subscribe(
      response => {
        console.log('Category deleted successfully', response);
        window.location.reload();
      },
      error => {
        console.error('Error deleting category', error);
      }
    );

    this.modalRefDelete?.hide();
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRefDelete?.hide();
  }

  searchCategory(event?: Event) {
    if (event) {
      event.preventDefault(); // لمنع إعادة تحميل الصفحة
    }
  
    if (this.searchWord.trim() === '') {
      // إذا كانت الكلمة فارغة، يتم إعادة جميع الشركات
      this.categories$.subscribe(categories => {
        this.categories = categories;
      });
    }

    else {
      this.categories$.subscribe(categories => {
        this.categories = categories.filter(c => 
          c.name.toLocaleLowerCase().includes(this._searchWord.toLocaleLowerCase()) 
          //||
        //  c.lastName.toLocaleLowerCase().includes(this._searchWord.toLocaleLowerCase())
        );
      });
    }
  }
}

