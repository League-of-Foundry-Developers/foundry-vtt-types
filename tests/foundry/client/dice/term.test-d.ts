import { expectTypeOf } from "vitest";

class CustomRollTerm extends RollTerm {
  someProperty = 42;
}

const r = new CustomRollTerm();

expectTypeOf(r.evaluate({ async: true })).toEqualTypeOf<Promise<CustomRollTerm>>();
expectTypeOf(r.evaluate({ async: false })).toEqualTypeOf<CustomRollTerm>();
expectTypeOf(r.evaluate()).toEqualTypeOf<CustomRollTerm>();
expectTypeOf(r.evaluate({ minimize: true, maximize: true })).toEqualTypeOf<CustomRollTerm>();
expectTypeOf(r.evaluate({ minimize: true, maximize: true, async: false as boolean })).toEqualTypeOf<
  CustomRollTerm | Promise<CustomRollTerm>
>();
expectTypeOf(r.evaluate({ minimize: true, maximize: true, async: false as boolean | undefined })).toEqualTypeOf<
  CustomRollTerm | Promise<CustomRollTerm>
>();
expectTypeOf(
  r.evaluate({ minimize: true, maximize: true, async: false as false | undefined }),
).toEqualTypeOf<CustomRollTerm>();
expectTypeOf(r.evaluate({ minimize: true, maximize: true, async: false as true | undefined })).toEqualTypeOf<
  CustomRollTerm | Promise<CustomRollTerm>
>();
