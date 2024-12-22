import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

const items = new Items([]);
expectTypeOf(items.get("", { strict: true })).toEqualTypeOf<Document.Stored<Item>>();
expectTypeOf(items.toJSON()).toEqualTypeOf<Document.Stored<Item>["_source"][]>();
expectTypeOf(items.directory).toEqualTypeOf<ItemDirectory>();
