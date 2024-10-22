import { INursery } from "../nursary/nursery";
import { ISaplingType } from "../sapling-type/sapling-type";

export interface ICategory {
    id: string;
    name: string;
    isActive: boolean;
    saplingTypes: ISaplingType[];
    nurseries: INursery[];
}