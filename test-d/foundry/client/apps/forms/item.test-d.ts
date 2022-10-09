import { expectType } from "tsd";

const itemSheet = new ItemSheet(new Item({ name: "Heavy armor", type: "armor" }));
expectType<Item>(itemSheet.object);
expectType<Item>(itemSheet.item);
