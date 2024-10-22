import { ICategory } from "../category/category";
import { ICompany } from "../company/company";
import { ISapling } from "../sapling/sapling";
import { ISector } from "../sector/sector";

export interface INursery{
    id: string;
    name: string;
    isActive: boolean;
    companyId: string;
    address: string
    company?: ICompany;
    categories: ICategory[];
    sectors: ISector[];
    saplings: ISapling[];
  }