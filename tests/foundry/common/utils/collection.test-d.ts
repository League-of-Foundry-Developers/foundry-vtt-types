import { expectTypeOf } from "vitest";

const c = new Collection<string>();

expectTypeOf(c.contents).toEqualTypeOf<string[]>();

expectTypeOf(c.toJSON()).toEqualTypeOf<string[]>();

const c2 = new Collection<{
  toJSON(): boolean;
}>();

expectTypeOf(c2.toJSON()).toEqualTypeOf<boolean[]>();

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
expectTypeOf(cn.filter((each) => typeof each === "string")).toEqualTypeOf<Array<string>>();
expectTypeOf(cn.find((each) => typeof each === "string")).toEqualTypeOf<string | undefined>();

expectTypeOf(cn.filter(isString)).toEqualTypeOf<string[]>();
expectTypeOf(cn.find(isString)).toEqualTypeOf<string | undefined>();

// This is a regression test for the error:
//    Class '...' defines instance member property '...', but extended class '...' defines it as instance member function.
// This occurred because of how `Map` was patched to allow the unsound subclassing of `Collection`.
class CustomCollection extends Collection<string> {
  override clear(): void {}

  override delete(_key: string): boolean {
    return true;
  }
}

declare const customCollection: CustomCollection;

if (customCollection instanceof Map) {
  expectTypeOf(customCollection).toEqualTypeOf<CustomCollection>();
}
