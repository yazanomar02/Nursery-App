import { ISaplingType } from "../sapling-type/sapling-type";
import { ISapling } from "../sapling/sapling";

export interface ISaplingsCategory {
    id: string;
    name: string;
    isActive: boolean;
    saplingTypeId: string;
    saplingType?: ISaplingType | null;
    saplings: ISapling[];
}