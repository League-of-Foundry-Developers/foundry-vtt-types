import { expectType } from "tsd";

const items = new Items();
expectType<StoredDocument<Item>>(items.get("", { strict: true }));
expectType<StoredDocument<Item>["data"]["_source"][]>(items.toJSON());
expectType<ItemDirectory | undefined>(items.directory);
