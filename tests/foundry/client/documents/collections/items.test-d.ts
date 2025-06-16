import { expectTypeOf } from "vitest";
import { Items } from "#client/documents/collections/_module.mjs";

import ItemDirectory = foundry.applications.sidebar.tabs.ItemDirectory;

const items = new Items([]);
expectTypeOf(items.get("", { strict: true })).toEqualTypeOf<Item.Stored>();
expectTypeOf(items.toJSON()).toEqualTypeOf<Item.Stored["_source"][]>();
expectTypeOf(items.directory).toEqualTypeOf<ItemDirectory>();
