import { expectTypeOf } from "vitest";

const itemSheet = new ItemSheet(new Item({ name: "Heavy armor", type: "armor" }));
expectTypeOf(itemSheet.object).toEqualTypeOf<Item>();
expectTypeOf(itemSheet.item).toEqualTypeOf<Item>();
