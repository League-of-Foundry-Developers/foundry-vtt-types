import { expectTypeOf } from "vitest";
import type { StoredDocument } from "../../../../../src/types/utils.d.mts";

const items = new Items();
expectTypeOf(items.get("", { strict: true })).toEqualTypeOf<StoredDocument<Item>>();
expectTypeOf(items.toJSON()).toEqualTypeOf<StoredDocument<Item>["data"]["_source"][]>();
expectTypeOf(items.directory).toEqualTypeOf<ItemDirectory | undefined>();
