import { expectType } from "tsd";
import "../../../index";

const c = new Collection<string>();

expectType<string | undefined>(c.get(""));
expectType<string | undefined>(c.get("", { strict: false }));
expectType<string>(c.get("", { strict: true }));

expectType<string | undefined>(c.getName(""));
expectType<string | undefined>(c.getName("", { strict: false }));
expectType<string>(c.getName("", { strict: true }));

function isString(e: string | null): e is string {
  return typeof e === "string";
}

const cn = new Collection<string | null>();
expectType<Array<string | null>>(cn.filter((each) => typeof each === "string"));
expectType<string | null | undefined>(cn.find((each) => typeof each === "string"));

expectType<string[]>(cn.filter(isString));
expectType<string | undefined>(cn.find(isString));
