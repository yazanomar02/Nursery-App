import { Routes } from '@angular/router';
import { CompanyComponent } from './company/company.component';
import { SupplierComponent } from './supplier/supplier.component';
import { CustomerComponent } from './customer/customer.component';
import { SaplingComponent } from './sapling/sapling.component';
import { CategoryComponent } from './category/category.component';
import { SaplingTypeComponent } from './sapling-type/sapling-type.component';
import { SaplingcategoryComponent } from './saplingcategory/saplingcategory.component';
import { ShowSaplingComponent } from './sapling/show-sapling/show-sapling.component';
import { CartComponent } from './cart/cart.component';
import { SectorComponent } from './sector/sector.component';
import { NursaryComponent } from './nursary/nursary.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './user/login/login.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { saplingGuard } from './sapling/sapling.guard';
import { WelcomeComponent } from './welcome/welcome.component';
import { userGardGuard } from './shared/user.gard';
import { companyGuard } from './shared/company.guard';
import { nurseryGuard } from './shared/nursery.guard';

export const routes: Routes = [
    {path: "companys", component: CompanyComponent ,canActivate:[userGardGuard ]},
    {path: "suppliers", component: SupplierComponent ,canActivate:[ nurseryGuard ]},
    {path: "customers", component: CustomerComponent,canActivate:[ nurseryGuard ]},
    {path: "saplings", component: SaplingComponent ,canActivate:[ nurseryGuard ]},
    {path: "categories", component: CategoryComponent ,canActivate:[ nurseryGuard ]},
    {path: "types", component: SaplingTypeComponent ,canActivate:[ nurseryGuard ]},
    {path: "saplingcategory", component: SaplingcategoryComponent ,canActivate:[ nurseryGuard ]},
    {path: "saplinglist", component: ShowSaplingComponent ,canActivate:[saplingGuard ]},
    {path: "cart", component: CartComponent ,canActivate:[saplingGuard ]},
    {path: "sectors", component: SectorComponent ,canActivate:[nurseryGuard ]},
    {path: "nurseries", component: NursaryComponent ,canActivate:[companyGuard ]},
    
    {path: '', component: UserComponent,
        children :[
            {path: "signup", component: RegistrationComponent},
            {path: "signin", component: LoginComponent},
            {path : "welcome" , component : WelcomeComponent}
        ]
    },
    {path: "dashboard", component: DashboardComponent},

    {path: "", component: WelcomeComponent},
    {path: "**", component: WelcomeComponent}
];
