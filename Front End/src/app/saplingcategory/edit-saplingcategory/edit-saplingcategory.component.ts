import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ISaplingsCategory } from '../saplingcategory';
import { SaplingcategoryService } from '../saplingcategory.service';
import { Observable, Subscription } from 'rxjs';
import { TypeService } from '../../sapling-type/type.service';
import { ISaplingType } from '../../sapling-type/sapling-type';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-saplingcategory',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './edit-saplingcategory.component.html',
  styleUrl: './edit-saplingcategory.component.css'
})

export class EditSaplingcategoryComponent implements OnInit, OnDestroy{
  Saplingstypes$!: Observable<ISaplingType[]>;
  Saplingstypes: ISaplingType[] = [];
  private subscription!: Subscription;

  editForm!: FormGroup;
  @Input() oldSaplingsCategory!: ISaplingsCategory;
  @Output() closeModal = new EventEmitter<boolean>;

  constructor(private fb: FormBuilder,
     private typeService: TypeService,
     private saplingcategoryService : SaplingcategoryService,
     private translate: TranslateService) {
      translate.addLangs(["en", "ar"]);
      }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {

    this.Saplingstypes$ = this.typeService.getSaplingTypes();

    this.subscription = this.Saplingstypes$.subscribe(saplings => {
      this.Saplingstypes = saplings;
    });

    this.editForm = this.fb.group({
      name: [this.oldSaplingsCategory.name, [Validators.required, Validators.minLength(5)]],
      saplingTypeId: [this.oldSaplingsCategory.saplingTypeId, [Validators.required, Validators.minLength(5)]],
    });
  }

  handleEditFormSubmit(){

    if (this.editForm.valid) {
    this.saplingcategoryService.updateSaplingsCategory(this.oldSaplingsCategory.id, this.editForm.value)
      .subscribe(
        response => {
          console.log('SaplingsCategory updated successfully', response);
          window.location.reload();
        },
        error => {
          console.error('Error updating saplingsCategory', error);
        }
      );
    }

    console.log(this.editForm);
    this.closeModal.emit(true);
  }


  
}
