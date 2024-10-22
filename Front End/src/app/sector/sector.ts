import { INursery } from "../nursary/nursery";
import { ISapling } from "../sapling/sapling";

export interface ISector {
    id: string;
    number: number;
    capacity: number;
    currentQuantity: number;
    isActive: boolean;
    nurseryId: string;
    nursery?: INursery | null;
    saplings: ISapling[];
}