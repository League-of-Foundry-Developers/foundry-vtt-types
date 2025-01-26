import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

const items = new Items([]);
expectTypeOf(items.get("", { strict: true })).toEqualTypeOf<Item.Stored>();
expectTypeOf(items.toJSON()).toEqualTypeOf<Item.Stored["_source"][]>();
expectTypeOf(items.directory).toEqualTypeOf<ItemDirectory>();
