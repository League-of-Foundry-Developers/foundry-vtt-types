import { describe, expect, expectTypeOf, test } from "vitest";

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
    expect(noArgs).toBeInstanceOf(DataFieldOperator);
    expectTypeOf(noArgs[OPERATOR_VALUE]).toBeUndefined();

    const strArg = new DataFieldOperator("foo");
    expect(strArg).toBeInstanceOf(DataFieldOperator);
    expectTypeOf(strArg[OPERATOR_VALUE]).toBeString();

    const objArg = new DataFieldOperator(obj);
    expect(objArg).toBeInstanceOf(DataFieldOperator);
    expectTypeOf(objArg[OPERATOR_VALUE]).toEqualTypeOf<typeof obj>();

    // Creation is not tested on the base class as its `.create` returns `.Any`
  });

  const noArgs = new DataFieldOperator();
  const strArg = new DataFieldOperator("foo");
  const objArg = new DataFieldOperator(obj);

  test("get", () => {
    // DFOs get unwrapped
    const noArgVal = DataFieldOperator.get(noArgs);
    expect(noArgVal).toBeUndefined();
    expectTypeOf(noArgVal).toBeUndefined();

    const strArgVal = DataFieldOperator.get(strArg);
    expect(strArgVal).toBe("foo");
    expectTypeOf(strArgVal).toBeString();

    const objArgVal = DataFieldOperator.get(objArg);
    expect(objArgVal).toEqual(obj);
    expectTypeOf(objArgVal).toEqualTypeOf<typeof obj>();

    // Other types are passed through
    const inferredString = DataFieldOperator.get("foo");
    expect(inferredString).toBe("foo");
    expectTypeOf(inferredString).toBeString();

    const constString = DataFieldOperator.get("foo" as const);
    expect(constString).toBe("foo");
    expectTypeOf(constString).toEqualTypeOf<"foo">();

    const passedThroughObj = DataFieldOperator.get(obj);
    expect(passedThroughObj).toBe(obj);
    expectTypeOf(passedThroughObj).toEqualTypeOf<typeof obj>();
  });

  test("set", () => {
    const setTest = new DataFieldOperator("fizz");

    const inferredStringSetResult = DataFieldOperator.set(setTest, "buzz");
    expect(inferredStringSetResult).toBe("buzz");
    expect(setTest[OPERATOR_VALUE]).toBe("buzz");
    expectTypeOf(inferredStringSetResult).toBeString();

    const constStringSetResult = DataFieldOperator.set(setTest, "fizz2" as const);
    expect(constStringSetResult).toBe("fizz2");
    expect(setTest[OPERATOR_VALUE]).toBe("fizz2");
    expectTypeOf(constStringSetResult).toEqualTypeOf<"fizz2">();

    const objSetResult = DataFieldOperator.set(setTest, obj);
    expect(objSetResult).toBe(obj);
    expect(setTest[OPERATOR_VALUE]).toEqual(obj);
    expectTypeOf(objSetResult).toEqualTypeOf<typeof obj>();
  });

  test("equals", () => {
    const test1 = DataFieldOperator.equals(noArgs, undefined);
    expect(test1).toBe(true);
    expectTypeOf(test1).toBeBoolean();

    const test2 = DataFieldOperator.equals(strArg, strArg);
    expect(test2).toBe(true);
    expectTypeOf(test2).toBeBoolean();

    const test3 = DataFieldOperator.equals(ForcedDeletion.create(), _del);
    expect(test3).toBe(true);
    expectTypeOf(test3).toBeBoolean();

    const test4 = DataFieldOperator.equals(_del, _replace(obj));
    expect(test4).toBe(false);
    expectTypeOf(test4).toBeBoolean();

    const test5 = DataFieldOperator.equals(_replace("foo"), _replace(obj));
    expect(test5).toBe(false);
    expectTypeOf(test5).toBeBoolean();
  });

  test("toJSON", () => {
    const noArgsReconstructionObject = noArgs.toJSON();
    expect(noArgsReconstructionObject[OPERATOR_IDENTIFIER]).toBe("DataFieldOperator");
    expect(noArgsReconstructionObject.value).toBe(undefined);
    expectTypeOf(noArgsReconstructionObject).toEqualTypeOf<DataFieldOperator.ReconstructionObject<undefined>>();

    const strArgReconstructionObject = strArg.toJSON();
    expect(strArgReconstructionObject[OPERATOR_IDENTIFIER]).toBe("DataFieldOperator");
    expect(strArgReconstructionObject.value).toBe("foo");
    expectTypeOf(strArgReconstructionObject).toEqualTypeOf<DataFieldOperator.ReconstructionObject<string>>();

    const objArgReconstructionObject = objArg.toJSON();
    expect(objArgReconstructionObject[OPERATOR_IDENTIFIER]).toBe("DataFieldOperator");
    expect(objArgReconstructionObject.value).toEqual(obj);
    expectTypeOf(objArgReconstructionObject).toEqualTypeOf<DataFieldOperator.ReconstructionObject<typeof obj>>();
  });
});

describe("ForcedDeletion Tests", () => {
  test("Construction & Creation", () => {
    const constructed = new ForcedDeletion();
    expect(constructed).toBeInstanceOf(ForcedDeletion);
    expectTypeOf(constructed).toEqualTypeOf<ForcedDeletion>();
    expectTypeOf(constructed).toExtend<DataFieldOperator<undefined>>();
    expectTypeOf(constructed[OPERATOR_VALUE]).toBeUndefined();

    const created = ForcedDeletion.create();
    expect(created).toBeInstanceOf(ForcedDeletion);
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

  test("global", () => {
    expect(_del).toBeInstanceOf(ForcedDeletion);
    expectTypeOf(_del).toEqualTypeOf<ForcedDeletion>();
  });
});

describe("ForcedReplacement Tests", () => {
  test("Construction & Creation", () => {
    // Construction

    const noArgs = new ForcedReplacement();
    expect(noArgs).toBeInstanceOf(ForcedReplacement);
    expectTypeOf(noArgs).toEqualTypeOf<ForcedReplacement<undefined>>();
    expect(noArgs[OPERATOR_VALUE]).toBeUndefined();
    expectTypeOf(noArgs[OPERATOR_VALUE]).toBeUndefined();

    const strArg = new ForcedReplacement("foo");
    expect(strArg).toBeInstanceOf(ForcedReplacement);
    expectTypeOf(strArg).toEqualTypeOf<ForcedReplacement<string>>();
    expect(strArg[OPERATOR_VALUE]).toBe("foo");
    expectTypeOf(strArg[OPERATOR_VALUE]).toBeString();

    const objArg = new ForcedReplacement(obj);
    expect(objArg).toBeInstanceOf(ForcedReplacement);
    expectTypeOf(objArg).toEqualTypeOf<ForcedReplacement<typeof obj>>();
    expect(objArg[OPERATOR_VALUE]).toEqual(obj);
    expectTypeOf(objArg[OPERATOR_VALUE]).toEqualTypeOf<typeof obj>();

    // Creation

    const noArgs2 = ForcedReplacement.create();
    expect(noArgs2).toBeInstanceOf(ForcedReplacement);
    expectTypeOf(noArgs2).toEqualTypeOf<ForcedReplacement<undefined>>();
    expect(noArgs2[OPERATOR_VALUE]).toBeUndefined();
    expectTypeOf(noArgs2[OPERATOR_VALUE]).toEqualTypeOf<undefined>();

    const strArg2 = ForcedReplacement.create("foo");
    expect(strArg2).toBeInstanceOf(ForcedReplacement);
    expectTypeOf(strArg2).toEqualTypeOf<ForcedReplacement<"foo">>();
    expect(strArg2[OPERATOR_VALUE]).toBe("foo");
    expectTypeOf(strArg2[OPERATOR_VALUE]).toBeString();

    const objArg2 = ForcedReplacement.create(obj);
    expect(objArg2).toBeInstanceOf(ForcedReplacement);
    expectTypeOf(objArg2).toExtend<ForcedReplacement<typeof obj>>();
    expectTypeOf(objArg2).toEqualTypeOf<ForcedReplacement<typeof obj> & typeof obj>();
    expect(objArg2[OPERATOR_VALUE]).toEqual(obj);
    expectTypeOf(objArg2[OPERATOR_VALUE]).toEqualTypeOf<typeof obj>();
  });

  test("Proxy handling", () => {
    const created = ForcedReplacement.create(obj);
    expect(created.foo).toBe(obj.foo);
    expectTypeOf(created.foo).toBeNumber();
    expect(created.bar).toBe(obj.bar);
    expectTypeOf(created.bar).toBeString();
  });

  test("global", () => {
    expect(_replace).toBe(ForcedReplacement.create);
    expectTypeOf(_replace).toEqualTypeOf<typeof ForcedReplacement.create>();
  });
});

describe("reconstructOperator Tests", () => {
  const obj2 = { x: 7, label: "hi" };
  const del = {
    [OPERATOR_IDENTIFIER]: "ForcedDeletion" as const,
    value: undefined,
  } satisfies ForcedDeletion.ReconstructionObject;

  const repl = {
    [OPERATOR_IDENTIFIER]: "ForcedReplacement" as const,
    value: { ...obj2 },
  } satisfies ForcedReplacement.ReconstructionObject<typeof obj2>;

  test("reconstructOperator", () => {
    // @ts-expect-error The passed object must include an `[OPERATOR_IDENTIFIER]` key
    expect(() => reconstructOperator({})).toThrow();

    const reconstructedDeletion = reconstructOperator(del);
    expect(reconstructedDeletion).toBeInstanceOf(ForcedDeletion);
    expectTypeOf(reconstructedDeletion).toEqualTypeOf<ForcedDeletion>();

    const reconstructedDeletion2 = reconstructOperator(_del.toJSON());
    expect(reconstructedDeletion2).toBeInstanceOf(ForcedDeletion);
    expectTypeOf(reconstructedDeletion2).toEqualTypeOf<ForcedDeletion>();

    const reconstructedReplacement = reconstructOperator(repl);
    expect(reconstructedReplacement).toBeInstanceOf(ForcedReplacement);
    expectTypeOf(reconstructedReplacement).toEqualTypeOf<ForcedReplacement<typeof obj2> & typeof obj2>();

    const reconstructedReplacement2 = reconstructOperator(_replace(obj2).toJSON());
    expect(reconstructedReplacement2).toBeInstanceOf(ForcedReplacement);
    expectTypeOf(reconstructedReplacement2).toEqualTypeOf<ForcedReplacement<typeof obj2> & typeof obj2>();
  });
});
