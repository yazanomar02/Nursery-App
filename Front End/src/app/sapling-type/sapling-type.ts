import { ICategory } from "../category/category";
import { ISaplingsCategory } from "../saplingcategory/saplingcategory";


export interface ISaplingType {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    categoryId: string;
    category?: ICategory | null;
    saplings: ISaplingsCategory[];
}