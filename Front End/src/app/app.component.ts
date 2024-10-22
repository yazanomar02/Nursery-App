import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddCompanyComponent } from './company/add-company/add-company.component';
import { CompanyService } from './company/company.service';
import { ICompany } from './company/company';
import { FormsModule } from '@angular/forms';
import { CompanyComponent } from './company/company.component';
import { AddSaplingComponent } from './sapling/add-sapling/add-sapling.component';
import { SaplingComponent } from './sapling/sapling.component';
import { SaplingService } from './sapling/sapling.service';
import { CategoryService } from './category/category.service';
import { AddCategoryComponent } from './category/add-category/add-category.component';
import { AddTypeComponent } from './sapling-type/add-type/add-type.component';
import { TypeService } from './sapling-type/type.service';
import { SaplingcategoryService } from './saplingcategory/saplingcategory.service';
import { AddSaplingcategoryComponent } from './saplingcategory/add-saplingcategory/add-saplingcategory.component';
import { CartService } from './cart/cart.service';
import { CartComponent } from './cart/cart.component';
import { SupplierService } from './supplier/supplier.service';
import { AddSupplierComponent } from './supplier/add-supplier/add-supplier.component';
import { AddCustomerComponent } from './customer/add-customer/add-customer.component';
import { CustomerService } from './customer/customer.service';
import { NursaryService } from './nursary/nursary.service';
import { AddNursaryComponent } from './nursary/add-nursary/add-nursary.component';
import { SectorService } from './sector/sector.service';
import { AddSectorComponent } from "./sector/add-sector/add-sector.component";
import { DashboardComponent } from "./user/dashboard/dashboard.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, RouterModule,
    AddCompanyComponent, AddSaplingComponent,
    AddCategoryComponent, AddTypeComponent,
    AddSaplingcategoryComponent, CartComponent,
    FormsModule, CompanyComponent, SaplingComponent,
    AddSupplierComponent, AddCustomerComponent, AddNursaryComponent,
    AddSectorComponent,
    DashboardComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{


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



  constructor(private router: Router, private modalService: BsModalService,
     private companyService: CompanyService, private saplingService: SaplingService,
     private categoryService: CategoryService, private typeService: TypeService,
     private saplingcategoryService: SaplingcategoryService, cartService: CartService,
     private supplierService: SupplierService, private customerService: CustomerService,
    private nursaryService: NursaryService, private sectorService: SectorService) {}
  
  ngOnInit(): void {
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
    });
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
