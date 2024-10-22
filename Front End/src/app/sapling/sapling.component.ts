import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ISapling } from './sapling';
import { map, Observable, Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SaplingService } from './sapling.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditSaplingComponent } from './edit-sapling/edit-sapling.component';
import { INursery } from '../nursary/nursery';
import { NursaryService } from '../nursary/nursary.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-sapling',
  standalone: true,
  imports: [CommonModule, EditSaplingComponent, FormsModule, TranslateModule],
  templateUrl: './sapling.component.html',
  styleUrl: './sapling.component.css'
})
export class SaplingComponent  implements OnInit, OnDestroy{
  nurseryId! : string;
  nursery! : Observable<INursery> ;
  nurseryName! : string 
  saplings$!: Observable<ISapling[]>;
  modalRefUpdate?: BsModalRef;
  modalRefDelete?: BsModalRef;
  modalRefAdd?: BsModalRef;
  message?: string;
  saplings: ISapling[] = [];
  private subscription!: Subscription;
  showNurseryId: boolean = false;
  nurseryNames: { [key: string]: string } = {};  // تخزين أسماء الشركات
  nurseries$!: Observable<INursery[]>;
  nurseries: INursery[] = [];

  private _searchWord: string = "";
  public get searchWord() : string {
    return this._searchWord
  }
  public set searchWord(v : string) {
    this._searchWord = v;
  }


  constructor(private saplingService: SaplingService,
              private nurseryService : NursaryService,
              private modalService: BsModalService,
              private translate: TranslateService) { 
                translate.addLangs(["en", "ar"]);
              }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    const companyId = localStorage.getItem('companyId');

    if(localStorage.getItem('companyId') || localStorage.getItem('userRole') === "admin") {
      this.showNurseryId = true;

      this.nurseries$ = this.nurseryService.getNursaries();

      this.subscription = this.nurseries$.subscribe(nurseries => {
        this.nurseries = nurseries;
        this.nurseries.forEach(nursery => {
          this.getNuseryName(nursery.id);  // جلب اسم الشركة لكل مشتل
        });
      });
    }

    if(localStorage.getItem('nurseryId')){
      this.nurseryId = localStorage.getItem('nurseryId') ?? '';
      this.saplings$ = this.nurseryService.getNursery(this.nurseryId).pipe(
        map(nursery => nursery.saplings)
      );

      this.subscription = this.saplings$.subscribe(saplings => {
        this.saplings = saplings;
      });
    }

    else if(companyId){
      this.nurseries$ = this.nurseryService.getNurseriesforCompanyActive(companyId);
  
      this.subscription = this.nurseries$.subscribe(nurseries => {
        this.nurseries = nurseries;
        this.saplings = []; // لتخزين الشتلات المرتبطة بالمشاتل
  
        this.nurseries.forEach(nursery => {
          // جلب الشتلات الخاصة بكل مشتل
          this.saplingService.getSaplingsforNurseryActive(nursery.id).subscribe(saplings => {
            this.saplings.push(...saplings); // إضافة الشتلات التي تم جلبها
            this.saplings.forEach(sapling => {
              this.getNuseryName(sapling.nurseryId); // جلب اسم المشتل لكل شتلة
            });
          });
        });
      });
    }

    else{
      this.saplings$ = this.saplingService.getSaplins();

      this.subscription = this.saplings$.subscribe(saplings => {
      this.saplings = saplings;
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
    this.saplingService.deleteSapling(id)
    .subscribe(
      response => {
        console.log('Sapling deleted successfully', response);
        window.location.reload();
      },
      error => {
        console.error('Error deleting sapling', error);
      }
    );

    this.modalRefDelete?.hide();
  }
 
  decline(): void {
    this.message = 'Declined!';
    this.modalRefDelete?.hide();
  }

  searchSapling(event?: Event) {
    if (event) {
      event.preventDefault(); // لمنع إعادة تحميل الصفحة
    }
  
    if (this.searchWord.trim() === '') {
      // إذا كانت الكلمة فارغة، يتم إعادة جميع الشركات
      this.saplings$.subscribe(saplings => {
        this.saplings = saplings;
      });
    }

    else {
      this.saplings$.subscribe(saplings => {
        this.saplings = saplings.filter(c => 
          c.barCode.toLocaleLowerCase().includes(this._searchWord.toLocaleLowerCase()) 
          //||
        //  c.lastName.toLocaleLowerCase().includes(this._searchWord.toLocaleLowerCase())
        );
      });
    }
  }

  getNuseryName(nurseryId: string): void {
    this.nurseryService.getNursery(nurseryId).subscribe(nursery => {
      this.nurseryNames[nurseryId] = nursery.name;  // تخزين الاسم بناءً على ID
    });
  }
}

