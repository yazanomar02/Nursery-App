import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AddCompanyComponent } from '../../company/add-company/add-company.component';
import { AddSaplingComponent } from '../../sapling/add-sapling/add-sapling.component';
import { AddCategoryComponent } from '../../category/add-category/add-category.component';
import { AddTypeComponent } from '../../sapling-type/add-type/add-type.component';
import { FormsModule } from '@angular/forms';
import { AddSaplingcategoryComponent } from '../../saplingcategory/add-saplingcategory/add-saplingcategory.component';
import { CompanyComponent } from '../../company/company.component';
import { CartComponent } from '../../cart/cart.component';
import { SaplingComponent } from '../../sapling/sapling.component';
import { AddCustomerComponent } from '../../customer/add-customer/add-customer.component';
import { AddSupplierComponent } from '../../supplier/add-supplier/add-supplier.component';
import { AddSectorComponent } from '../../sector/add-sector/add-sector.component';
import { AddNursaryComponent } from '../../nursary/add-nursary/add-nursary.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SaplingService } from '../../sapling/sapling.service';
import { CompanyService } from '../../company/company.service';
import { CategoryService } from '../../category/category.service';
import { TypeService } from '../../sapling-type/type.service';
import { CartService } from '../../cart/cart.service';
import { SaplingcategoryService } from '../../saplingcategory/saplingcategory.service';
import { SupplierService } from '../../supplier/supplier.service';
import { NursaryService } from '../../nursary/nursary.service';
import { CustomerService } from '../../customer/customer.service';
import { SectorService } from '../../sector/sector.service';
import { saplingGuard } from '../../sapling/sapling.guard';
import { AuthService } from '../auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [   RouterOutlet, RouterModule,
    AddCompanyComponent, AddSaplingComponent,
    AddCategoryComponent, AddTypeComponent,
    AddSaplingcategoryComponent, CartComponent,
    FormsModule, CompanyComponent, SaplingComponent,
    AddSupplierComponent, AddCustomerComponent, AddNursaryComponent,
    AddSectorComponent, TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit{


  showButtonAddCompany: boolean = false;
  showButtonAddSapling: boolean = false;
  showButtonAddCategory: boolean = false;
  showButtonAddType: boolean = false;
  showButtonAddSaplingCategory: boolean = false;
  showButtonAddSaplingList: boolean = false;
  showButtonAddCart: boolean = false;
  showButtonAddSupplier: boolean = false;
  showButtonAddCustomer: boolean = false;
  showButtonAddNursery: boolean = false;
  showButtonAddSector: boolean = false;
  showdashboard: boolean = false;
  showButtonLogout: boolean = false;

  modalRefAddCompany?: BsModalRef;
  modalRefAddSapling?: BsModalRef;
  modalRefAddCategory?: BsModalRef;
  modalRefAddType?: BsModalRef;
  modalRefAddSaplingCategory?: BsModalRef;
  modalRefAddSaplingList?: BsModalRef;
  modalRefAddSupplier?: BsModalRef;
  modalRefAddCustomer?: BsModalRef;
  modalRefAddNursery?: BsModalRef;
  modalRefAddSector?: BsModalRef;
  isAdmin: boolean = false;
  isCompany: boolean = false;
  isNursery: boolean = false;


  constructor(private router: Router, private modalService: BsModalService,
    private companyService: CompanyService, private saplingService: SaplingService,
    private categoryService: CategoryService, private typeService: TypeService,
    private saplingcategoryService: SaplingcategoryService, cartService: CartService,
    private supplierService: SupplierService, private customerService: CustomerService,
    private nursaryService: NursaryService, private sectorService: SectorService, private auth: AuthService,
    private translate: TranslateService) {
      translate.addLangs(["en", "ar"]);
      // translate.setDefaultLang("ar");
    }
  
  ngOnInit(): void {
    this.isAdmin = this.auth.isAdmin();
    this.isCompany = this.auth.isCompany();
    this.isNursery = this.auth.isNursery();
    this.router.events.subscribe(() => {
      this.showButtonAddCompany = this.router.url === '/companys';
      this.showButtonAddSapling = this.router.url === '/saplings';
      this.showButtonAddCategory = this.router.url === '/categories';
      this.showButtonAddType = this.router.url === '/types';
      this.showButtonAddSaplingCategory = this.router.url === '/saplingcategory';
      this.showButtonAddSaplingList = this.router.url === '/saplinglist';
      this.showButtonAddCart = this.router.url === '/cart';
      this.showButtonAddSupplier = this.router.url === '/suppliers';
      this.showButtonAddCustomer = this.router.url === '/customers';
      this.showButtonAddNursery = this.router.url === '/nurseries';
      this.showButtonAddSector = this.router.url === '/sectors';
      this.showdashboard = this.router.url === '/dashboard';
      this.showButtonLogout = this.router.url !== '/signin' && this.router.url !== '/signup';
    });
  
  }


  onLogout(){
    if(localStorage.getItem('userRole') === 'company'){
      localStorage.removeItem('companyId');
    }else if(localStorage.getItem('userRole') === 'nursery'){
      localStorage.removeItem('nurseryId');
    }
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('cartId');
    localStorage.removeItem('userId');
    this.router.navigateByUrl('/signin');


  }
  switchLanguage(language: string) {
    this.translate.use(language);
  }
  openModalAddCompany(template: TemplateRef<void>) {
    this.modalRefAddCompany = this.modalService.show(template);
    this.companyService.addCompany(this.modalRefAddCompany)
  }

  openModalAddSapling(template: TemplateRef<void>) {
    this.modalRefAddSapling = this.modalService.show(template);
     this.saplingService.addSapling(this.modalRefAddSapling)
  }

  openModalAddCategory(template: TemplateRef<void>) {
    this.modalRefAddCategory = this.modalService.show(template);
     this.categoryService.addCategory(this.modalRefAddCategory)
  }

  openModalAddType(template: TemplateRef<void>) {
    this.modalRefAddType = this.modalService.show(template);
     this.typeService.addSaplingType(this.modalRefAddType)
  }
  

  openModalAddSaplingCategory(template: TemplateRef<void>) {
    this.modalRefAddSaplingCategory = this.modalService.show(template);
     this.saplingcategoryService.addSaplingsCategory(this.modalRefAddSaplingCategory)
  }

  templateAddSaplingList(template: TemplateRef<void>) {
    this.modalRefAddSaplingCategory = this.modalService.show(template);
     //this.saplingcategoryService.addSaplingsCategory(this.modalRefAddSaplingCategory)
  }
  
  openModalAddSupplier(template: TemplateRef<void>) {
    this.modalRefAddSupplier = this.modalService.show(template);
     this.supplierService.addSupplier(this.modalRefAddSupplier)
  }

  openModalAddCustomer(template: TemplateRef<void>) {
    this.modalRefAddCustomer = this.modalService.show(template);
     this.customerService.addCustomer(this.modalRefAddCustomer)
  }

  openModalAddNursery(template: TemplateRef<void>) {
    this.modalRefAddNursery = this.modalService.show(template);
     this.nursaryService.addNursary(this.modalRefAddNursery)
  }

  openModalAddSector(template: TemplateRef<void>) {
    this.modalRefAddSector = this.modalService.show(template);
     this.sectorService.addSector(this.modalRefAddSector)
  }


  closeModalAddCompany() {
    this.modalService.hide(this.modalRefAddCompany?.id);
  }
  
  closeModalAddSapling() {
    this.modalService.hide(this.modalRefAddSapling?.id);
  }

  closeModalAddCategory() {
    this.modalService.hide(this.modalRefAddCategory?.id);
  }

  closeModalAddType() {
    this.modalService.hide(this.modalRefAddType?.id);
  }

  closeModalAddSaplingCategory() {
    this.modalService.hide(this.modalRefAddSaplingCategory?.id);
  }

  closeModalAddSaplingList() {
    this.modalService.hide(this.modalRefAddSaplingList?.id);
    window.location.reload();
  }

  closeModalAddSupplier() {
    this.modalService.hide(this.modalRefAddSupplier?.id);
  }

  closeModalAddCustomer() {
    this.modalService.hide(this.modalRefAddCustomer?.id);
  }

  closeModalAddNursery() {
    this.modalService.hide(this.modalRefAddNursery?.id);
  }

  closeModalAddSector() {
    this.modalService.hide(this.modalRefAddSector?.id);
  }
}
