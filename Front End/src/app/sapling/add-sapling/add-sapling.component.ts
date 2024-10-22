import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SaplingService } from '../sapling.service';
import { ISaplingsCategory } from '../../saplingcategory/saplingcategory';
import { SaplingcategoryService } from '../../saplingcategory/saplingcategory.service';
import { Observable, Subscription } from 'rxjs';
import { NursaryService } from '../../nursary/nursary.service';
import { INursery } from '../../nursary/nursery';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-add-sapling',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './add-sapling.component.html',
  styleUrl: './add-sapling.component.css'
})
export class AddSaplingComponent {
  nurseryId: string | undefined;
  companyId: string | undefined;

  saplingCategories$!: Observable<ISaplingsCategory[]>;
  saplingCategories: ISaplingsCategory[] = [];

  nurseries$!: Observable<INursery[]>;
  nurseries: INursery[] = [];

  private subscription!: Subscription;
  addForm!: FormGroup;
  selectedFile: File | null = null;  // لتخزين الصورة
  imageError: string | null = null;

  @Output() closeModal = new EventEmitter<boolean>;

  constructor(private fb: FormBuilder,
              private saplingService: SaplingService,
              private saplingCategoryService : SaplingcategoryService,
              private nurseryService : NursaryService,
              private translate: TranslateService
            ) { 
              translate.addLangs(["en", "ar"]);
            }

  ngOnInit(): void {
  
    this.saplingCategories$ = this.saplingCategoryService.getSaplingsCategorys();
    this.subscription = this.saplingCategories$.subscribe(saplings => {
      this.saplingCategories = saplings;
    });

    this.nurseries$ = this.nurseryService.getNursaries();
    this.subscription = this.nurseries$.subscribe(nursery => {
      this.nurseries = nursery;
    });
    const nurseryId = localStorage.getItem('nurseryId');
    const companyId = localStorage.getItem('companyId');

    if(nurseryId) {
      this.nurseryId = nurseryId;
    }

    else if (companyId) {
      this.companyId = companyId;
      this.nurseries$ = this.nurseryService.getNurseriesforCompanyActive(companyId);

      this.subscription = this.nurseries$.subscribe(nurseries => 
        this.nurseries = nurseries);
    }

    else {
      this.nurseries$ = this.nurseryService.getNursaries();
      this.subscription = this.nurseries$.subscribe(nurseries => {
      this.nurseries = nurseries;
      })
    }


    if(this.nurseryId){
      this.addForm = this.fb.group({
     
        nurseryId: [this.nurseryId, [Validators.required]], 
        // name: ["", [Validators.required]], 
        birthDate: ["", [Validators.required]],
        sellDate: ["", [Validators.required]],
        buyPrice: ["", [Validators.required, Validators.min(0)]],
        sellPrice: ["", [Validators.required, Validators.min(0)]],
        amount: ["", [Validators.required, Validators.min(1)]],
        isImported: ["", [Validators.required]],
        saplingsCategoryId: ["", [Validators.required]],
        saplingImage: [null, Validators.required]  // حقل الصورة
      });
    }
    else{
      this.addForm = this.fb.group({
     
        nurseryId: ["", [Validators.required]], 
        // name: ["", [Validators.required]], 
        birthDate: ["", [Validators.required]],
        sellDate: ["", [Validators.required]],
        buyPrice: ["", [Validators.required, Validators.min(0)]],
        sellPrice: ["", [Validators.required, Validators.min(0)]],
        amount: ["", [Validators.required, Validators.min(1)]],
        isImported: ["", [Validators.required]],
        saplingsCategoryId: ["", [Validators.required]],
        saplingImage: [null, Validators.required]  // حقل الصورة
      });
    }


  
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (allowedTypes.includes(file.type)) {
        this.selectedFile = file;
        this.imageError = null;
      } else {
        this.imageError = 'Only JPEG or PNG images are allowed';
      }
    }
  }
  handleAddFormSubmit() {
    if (this.addForm.valid && this.selectedFile) {
      const formData = new FormData();
      
      // إضافة البيانات إلى formData
      formData.append('nurseryId', this.addForm.get('nurseryId')?.value);
      formData.append('birthDate', new Date(this.addForm.get('birthDate')?.value).toISOString());
      formData.append('sellDate', new Date(this.addForm.get('sellDate')?.value).toISOString());
      formData.append('buyPrice', this.addForm.get('buyPrice')?.value);
      formData.append('sellPrice', this.addForm.get('sellPrice')?.value);
      formData.append('amount', this.addForm.get('amount')?.value);
      formData.append('isImported', this.addForm.get('isImported')?.value);
      formData.append('saplingsCategoryId', this.addForm.get('saplingsCategoryId')?.value);
  
      // إضافة الصورة إلى formData
      if (this.selectedFile) {
        formData.append('saplingImage', this.selectedFile, this.selectedFile.name);
      }
  
      // إرسال الطلب عبر خدمة saplingService
      this.saplingService.addSapling(formData).subscribe(
        response => {
          console.log('Sapling added successfully', response);
          window.location.reload();
        },
        error => {
          console.error('Error adding sapling', error);
          if (error.status === 400 && error.error?.errors) {
            console.log('Validation errors:', error.error.errors);
          }
        }
      );
    } else {
      this.imageError = 'Please upload a valid image';
    }
  
    this.closeModal.emit(true);
  }
  
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
