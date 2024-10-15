import { expectTypeOf } from "vitest";
import type Document from "../../../../../src/foundry/common/abstract/document.d.mts";

const items = new Items([]);
expectTypeOf(items.get("", { strict: true })).toEqualTypeOf<Document.Stored<Item>>();
expectTypeOf(items.toJSON()).toEqualTypeOf<Document.Stored<Item>["_source"][]>();
expectTypeOf(items.directory).toEqualTypeOf<ItemDirectory>();
