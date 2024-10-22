import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SectorService } from '../sector.service';
import { INursery } from '../../nursary/nursery';
import { Observable, Subscription } from 'rxjs';
import { NursaryService } from '../../nursary/nursary.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-sector',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './add-sector.component.html',
  styleUrl: './add-sector.component.css'
})
export class AddSectorComponent implements OnInit, OnDestroy{
  addForm!: FormGroup;
  @Output() closeModal = new EventEmitter<boolean>;
  nurseries: INursery[] = [];
  nurseries$!: Observable<INursery[]>;
  private subscription!: Subscription;
  nurseryId: string | undefined;
  companyId: string | undefined;
  
  constructor(private fb: FormBuilder,
              private sectorService: SectorService,
              private nursaryService: NursaryService,
              private translate: TranslateService) { 
                translate.addLangs(["en", "ar"]);
              }

  ngOnInit(): void {
    const nurseryId = localStorage.getItem('nurseryId');
    const companyId = localStorage.getItem('companyId');
    
    if(nurseryId) {
      this.nurseryId = nurseryId;
    }

    else if (companyId) {
      this.companyId = companyId;
      this.nurseries$ = this.nursaryService.getNurseriesforCompanyActive(companyId);

      this.subscription = this.nurseries$.subscribe(nurseries => 
        this.nurseries = nurseries);
    }

    else {
      this.nurseries$ = this.nursaryService.getNursaries();
      this.subscription = this.nurseries$.subscribe(nurseries => {
      this.nurseries = nurseries;
    });
    }

    this.addForm = this.fb.group({
      number: ["", [Validators.required]],
      capacity: ["", [Validators.required]],
      nurseryId: ["", [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  handleAddFormSubmit(){

    if (this.addForm.valid) {
    this.sectorService.addSector(this.addForm.value)
      .subscribe(
        response => {
          console.log('Sector added successfully', response);
          window.location.reload();
        },
        error => {
          console.error('Error adding sector', error);
        }
      );
    }

    console.log(this.addForm);
    this.closeModal.emit(true);
  }
}
