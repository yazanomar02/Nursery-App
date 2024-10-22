import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ISapling } from '../sapling';
import { SaplingService } from '../sapling.service';
import { Observable, Subscription } from 'rxjs';
import { ISaplingsCategory } from '../../saplingcategory/saplingcategory';
import { SaplingcategoryService } from '../../saplingcategory/saplingcategory.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-sapling',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './edit-sapling.component.html',
  styleUrl: './edit-sapling.component.css'
})
export class EditSaplingComponent implements OnInit, OnDestroy{

  saplingCategories$!: Observable<ISaplingsCategory[]>;
  saplingCategories: ISaplingsCategory[] = [];
  private subscription!: Subscription;

  editForm!: FormGroup;
  @Input() oldSapling!: ISapling;
  @Output() closeModal = new EventEmitter<boolean>;
  
  constructor(private fb: FormBuilder,
     private saplingService: SaplingService,
     private saplingCategoryService : SaplingcategoryService,
     private translate: TranslateService  
    ) {
      translate.addLangs(["en", "ar"]);
    }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.saplingCategories$ = this.saplingCategoryService.getSaplingsCategorys();

    this.subscription = this.saplingCategories$.subscribe(saplings => {
    this.saplingCategories = saplings;
    });


    this.editForm = this.fb.group({
      birthDate: [this.oldSapling.birthDate, [Validators.required]],
      sellDate: [this.oldSapling.sellDate, [Validators.required]],
      buyPrice: [this.oldSapling.buyPrice, [Validators.required, Validators.min(0)]],
      sellPrice: [this.oldSapling.sellPrice, [Validators.required, Validators.min(0)]],
      amount: [this.oldSapling.amount, [Validators.required, Validators.min(1)]],
      isImported: [this.oldSapling.isImported, [Validators.required]],
     // isActive: [this.oldSapling.isActive, [Validators.required]],
      saplingsCategoryId: [this.oldSapling.saplingsCategoryId, [Validators.required]],
    });
  }

  handleEditFormSubmit(){

    if (this.editForm.valid) {
    this.saplingService.updateSapling(this.oldSapling.id, this.editForm.value)
      .subscribe(
        response => {
          console.log('Company updated successfully', response);
          window.location.reload();
        },
        error => {
          console.error('Error updating company', error);
        }
      );
    }

    console.log(this.editForm);
    this.closeModal.emit(true);
}
}
