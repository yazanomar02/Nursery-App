import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ISector } from './sector';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SectorService } from './sector.service';
import { EditSectorComponent } from './edit-sector/edit-sector.component';
import { NursaryService } from '../nursary/nursary.service';

import { INursery } from '../nursary/nursery';
import { Observable, Subscription } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sector',
  standalone: true,
  imports: [CommonModule, FormsModule, EditSectorComponent, TranslateModule],
  templateUrl: './sector.component.html',
  styleUrl: './sector.component.css'
})
export class SectorComponent implements OnInit, OnDestroy{
  sectors$!: Observable<ISector[]>;
  sectors: ISector[] = [];
  nurseries$!: Observable<INursery[]>;
  nurseries: INursery[] = [];
  modalRefUpdate?: BsModalRef;
  modalRefDelete?: BsModalRef;
  message?: string;
  private subscription!: Subscription;

  nursaryNames: { [key: string]: string } = {};  // تخزين أسماء المشاتل
  


  private _searchWord: string = "";
  public get searchWord() : string {
    return this._searchWord
  }
  public set searchWord(v : string) {
    this._searchWord = v;
  }

  constructor(private sectorService: SectorService,
              private modalService: BsModalService,
              private nursaryService: NursaryService,
              private translate: TranslateService) {
                translate.addLangs(["en", "ar"]);
              }
              
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    const nurseryId = localStorage.getItem('nurseryId');
    const role = localStorage.getItem('userRole');
    const companyId = localStorage.getItem('companyId');

    if (nurseryId) {
      this.sectors$ = this.sectorService.getSectorsforNurseryActive(nurseryId);

      this.subscription = this.sectors$.subscribe(sectors => {
        this.sectors = sectors;
        this.sectors.forEach(sector => {
          this.getNursaryName(sector.nurseryId);  // جلب اسم الشركة لكل مشتل
        });
      });
    }
    
    else if(role === 'admin') {
      this.sectors$ = this.sectorService.getSectors();

      this.subscription = this.sectors$.subscribe(sectors => {
        this.sectors = sectors;
        this.sectors.forEach(sector => {
          this.getNursaryName(sector.nurseryId);  // جلب اسم الشركة لكل مشتل
        });
      });
    }

    else if (companyId) {
      this.nurseries$ = this.nursaryService.getNurseriesforCompanyActive(companyId);
  
      this.subscription = this.nurseries$.subscribe(nurseries => {
        this.nurseries = nurseries;
        this.sectors = []; // لتخزين القطاعات المرتبطة بالمشاتل
  
        this.nurseries.forEach(nursery => {
          // جلب القطاعات الخاصة بكل مشتل
          this.sectorService.getSectorsforNurseryActive(nursery.id).subscribe(sectors => {
            this.sectors.push(...sectors); // إضافة القطاعات التي تم جلبها
            this.sectors.forEach(sector => {
              this.getNursaryName(sector.nurseryId); // جلب اسم المشتل لكل قطاع
            });
          });
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
    this.sectorService.deleteSector(id)
    .subscribe(
      response => {
        console.log('Sectoe deleted successfully', response);
        window.location.reload();
      },
      error => {
        console.error('Error deleting sector', error);
      }
    );

    this.modalRefDelete?.hide();
  }
 
  decline(): void {
    this.message = 'Declined!';
    this.modalRefDelete?.hide();
  }

  searchSector(event?: Event) {
    if (event) {
      event.preventDefault(); // لمنع إعادة تحميل الصفحة
    }
  
    if (this.searchWord.trim() === '') {
      // إذا كانت الكلمة فارغة، يتم إعادة جميع الشركات
      this.sectors$.subscribe(sectors => {
        this.sectors = sectors;
      });
    }

    else {
      this.sectors$.subscribe(sectors => {
        this.sectors = sectors.filter(s => 
          s.number === +this._searchWord
        );
      });
    }
  }


  getNursaryName(nursaryId: string): void {
    this.nursaryService.getNursery(nursaryId).subscribe(nursaey => {
      this.nursaryNames[nursaryId] = nursaey.name;  // تخزين الاسم بناءً على ID
    });
  }
}
