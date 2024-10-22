import { INursery } from "../nursary/nursery";
import { ISaplingsCategory } from "../saplingcategory/saplingcategory";
import { ISector } from "../sector/sector";

export interface ISapling {
    id: string;
    barCode: string;
    birthDate: Date;
    sellDate: Date;
    buyPrice: number;
    sellPrice: number;
    amount: number;
    isImported: boolean;
    isActive: boolean;
    saplingsCategoryId: string;
    saplingsCategory?: ISaplingsCategory | null;
    sectors: ISector[];
    nurseryId : string;
    quantity : number;
    saplingImage : string,
    name : string,
    nursery : INursery
}





