import { describe, expectTypeOf, test } from "vitest";

import DataFieldOperator = foundry.data.operators.DataFieldOperator;
import ForcedDeletion = foundry.data.operators.ForcedDeletion;
import ForcedReplacement = foundry.data.operators.ForcedReplacement;
import OPERATOR_VALUE = foundry.data.operators.OPERATOR_VALUE;
import OPERATOR_IDENTIFIER = foundry.data.operators.OPERATOR_IDENTIFIER;
import reconstructOperator = foundry.data.operators.reconstructOperator;

const obj = { foo: 7, bar: "world" };

describe("DataFieldOperator Tests", () => {
  test("Construction & Value", () => {
    // Construction

    const noArgs = new DataFieldOperator();
    expectTypeOf(noArgs[OPERATOR_VALUE]).toBeUndefined();

    const strArg = new DataFieldOperator("foo");
    expectTypeOf(strArg[OPERATOR_VALUE]).toBeString();

    const objArg = new DataFieldOperator(obj);
    expectTypeOf(objArg[OPERATOR_VALUE]).toEqualTypeOf<typeof obj>();

    // Creation is not tested on the base class as its `.create` returns `.Any`
  });

  const noArgs = new DataFieldOperator();
  const strArg = new DataFieldOperator("foo");
  const objArg = new DataFieldOperator(obj);

  test("get", () => {
    // DFOs get unwrapped
    expectTypeOf(DataFieldOperator.get(noArgs)).toBeUndefined();
    expectTypeOf(DataFieldOperator.get(strArg)).toBeString();
    expectTypeOf(DataFieldOperator.get(objArg)).toEqualTypeOf<typeof obj>();

    // Other types are passed through
    expectTypeOf(DataFieldOperator.get("foo")).toBeString();
    expectTypeOf(DataFieldOperator.get("foo" as const)).toEqualTypeOf<"foo">();
    expectTypeOf(DataFieldOperator.get(obj)).toEqualTypeOf<typeof obj>();
  });

  test("set", () => {
    const setTest = new DataFieldOperator("fizz");
    expectTypeOf(DataFieldOperator.set(setTest, "buzz")).toBeString();
    expectTypeOf(DataFieldOperator.set(setTest, "buzz" as const)).toEqualTypeOf<"buzz">();
    expectTypeOf(DataFieldOperator.set(setTest, obj)).toEqualTypeOf<typeof obj>();
    expectTypeOf(DataFieldOperator.set(setTest, null)).toBeNull();
  });

  test("equals", () => {
    expectTypeOf(DataFieldOperator.equals(noArgs, undefined)).toBeBoolean();
    expectTypeOf(DataFieldOperator.equals(strArg, objArg)).toBeBoolean();
    expectTypeOf(DataFieldOperator.equals(null, objArg)).toBeBoolean();
    expectTypeOf(DataFieldOperator.equals(ForcedDeletion.create(), objArg)).toBeBoolean();
  });

  test("toJSON", () => {
    expectTypeOf(noArgs.toJSON()).toBeString();
  });
});

describe("ForcedDeletion Tests", () => {
  test("Construction & Creation", () => {
    const constructed = new ForcedDeletion();
    expectTypeOf(constructed).toEqualTypeOf<ForcedDeletion>();
    expectTypeOf(constructed).toExtend<DataFieldOperator<undefined>>();
    expectTypeOf(constructed[OPERATOR_VALUE]).toBeUndefined();

    const created = ForcedDeletion.create();
    expectTypeOf(created).toEqualTypeOf<ForcedDeletion>();
    expectTypeOf(created).toExtend<DataFieldOperator<undefined>>();
    expectTypeOf(created[OPERATOR_VALUE]).toBeUndefined();

    // @ts-expect-error This is valid at runtime, but since the value of a ForcedDeletion will never not be `undefined`,
    // we narrow the constructor arg.
    new ForcedDeletion("foo");

    // @ts-expect-error This is valid at runtime, but since the value of a ForcedDeletion will never not be `undefined`,
    // we narrow the constructor arg.
    ForcedDeletion.create("foo");
  });
});

describe("ForcedReplacement Tests", () => {
  test("Construction & Creation", () => {
    // Construction

    const noArgs = new ForcedReplacement();
    expectTypeOf(noArgs).toEqualTypeOf<ForcedReplacement<undefined>>();
    expectTypeOf(noArgs[OPERATOR_VALUE]).toBeUndefined();

    const strArg = new ForcedReplacement("foo");
    expectTypeOf(strArg).toEqualTypeOf<ForcedReplacement<string>>();
    expectTypeOf(strArg[OPERATOR_VALUE]).toBeString();

    const objArg = new ForcedReplacement(obj);
    expectTypeOf(objArg).toEqualTypeOf<ForcedReplacement<typeof obj>>();
    expectTypeOf(objArg[OPERATOR_VALUE]).toEqualTypeOf<typeof obj>();

    // Creation

    const noArgs2 = ForcedReplacement.create();
    expectTypeOf(noArgs2).toEqualTypeOf<ForcedReplacement<undefined>>();
    expectTypeOf(noArgs2[OPERATOR_VALUE]).toEqualTypeOf<undefined>();

    const strArg2 = ForcedReplacement.create("foo");
    expectTypeOf(strArg2).toEqualTypeOf<ForcedReplacement<"foo">>();
    expectTypeOf(strArg2[OPERATOR_VALUE]).toBeString();

    const objArg2 = ForcedReplacement.create(obj);
    expectTypeOf(objArg2).toExtend<ForcedReplacement<typeof obj>>();
    expectTypeOf(objArg2).toEqualTypeOf<ForcedReplacement<typeof obj> & typeof obj>();
    expectTypeOf(objArg2[OPERATOR_VALUE]).toEqualTypeOf<typeof obj>();
  });

  test("Proxy handling", () => {
    const created = ForcedReplacement.create(obj);
    expectTypeOf(created.foo).toBeNumber();
    expectTypeOf(created.bar).toBeString();

    const overrideObj = {
      toJSON(): number {
        return 7;
      },
    };

    const overrideTest = ForcedReplacement.create(overrideObj);
    const json = overrideTest.toJSON();

    // The intersection seemingly prioritizes the ForcedDeletion method.
    expectTypeOf(json).toBeString();
  });
});

describe("reconstructOperator Tests", () => {
  const del = {
    [OPERATOR_IDENTIFIER]: "ForcedDeletion" as const,
  };
  const repl = {
    [OPERATOR_IDENTIFIER]: "ForcedReplacement" as const,
    value: { x: 7, label: "hi" },
  };

  // @ts-expect-error The passed object must include an `[OPERATOR_IDENTIFIER]` key
  reconstructOperator({});

  expectTypeOf(reconstructOperator(del)).toEqualTypeOf<ForcedDeletion>();
  expectTypeOf(reconstructOperator(repl)).toEqualTypeOf<
    ForcedReplacement<{ x: number; label: string }> & { x: number; label: string }
  >();
});
game;
