import { expectTypeOf } from "vitest";

const c = new Collection<string>();

expectTypeOf(c.get("")).toEqualTypeOf<string | undefined>();
expectTypeOf(c.get("", { strict: false })).toEqualTypeOf<string | undefined>();
expectTypeOf(c.get("", { strict: true })).toEqualTypeOf<string>();

expectTypeOf(c.getName("")).toEqualTypeOf<string | undefined>();
expectTypeOf(c.getName("", { strict: false })).toEqualTypeOf<string | undefined>();
expectTypeOf(c.getName("", { strict: true })).toEqualTypeOf<string>();

function isString(e: string | null): e is string {
  return typeof e === "string";
}

const cn = new Collection<string | null>();
expectTypeOf(cn.filter((each) => typeof each === "string")).toEqualTypeOf<Array<string | null>>();
expectTypeOf(cn.find((each) => typeof each === "string")).toEqualTypeOf<string | null | undefined>();

expectTypeOf(cn.filter(isString)).toEqualTypeOf<string[]>();
expectTypeOf(cn.find(isString)).toEqualTypeOf<string | undefined>();
