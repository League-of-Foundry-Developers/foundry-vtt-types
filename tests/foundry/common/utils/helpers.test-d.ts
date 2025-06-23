import { expectTypeOf, assertType } from "vitest";
import type { AnyConstructor, AnyFunction, DeepReadonly, NonNullish } from "fvtt-types/utils";
import utils = foundry.utils;

import FormApplication = foundry.appv1.api.FormApplication;

declare function functionWithoutParameters(): void;
declare function functionWithParameters(a: number, b: string, c?: boolean): void;
declare function functionWithReturnTypeOtherThanVoid(): number;

// benchmark

expectTypeOf(utils.benchmark(functionWithoutParameters, 42)).toEqualTypeOf<Promise<void>>();

// @ts-expect-error - the function takes no arguments
utils.benchmark(functionWithoutParameters, 42, "unknown argument");

expectTypeOf(utils.benchmark(functionWithParameters, 42, 1, "", false)).toEqualTypeOf<Promise<void>>();
expectTypeOf(utils.benchmark(functionWithParameters, 42, 1, "")).toEqualTypeOf<Promise<void>>();

// @ts-expect-error - the function takes a number and a string
utils.benchmark(functionWithParameters, 42, 1);

// @ts-expect-error - the function takes doesn't take three arguments
utils.benchmark(functionWithParameters, 42, 1, "", "unknown argument");

expectTypeOf(utils.benchmark(functionWithReturnTypeOtherThanVoid, 42)).toEqualTypeOf<Promise<void>>();

// threadLock
expectTypeOf(utils.threadLock(42)).toEqualTypeOf<Promise<void>>();

// debounce
expectTypeOf(utils.debounce(functionWithoutParameters, 500)).toEqualTypeOf<() => void>();
expectTypeOf(utils.debounce(functionWithParameters, 500)).toEqualTypeOf<(a: number, b: string, c?: boolean) => void>();

// throttle
expectTypeOf(utils.throttle(functionWithoutParameters, 500)).toEqualTypeOf<() => void>();
expectTypeOf(utils.throttle(functionWithParameters, 500)).toEqualTypeOf<(a: number, b: string, c?: boolean) => void>();
expectTypeOf(utils.throttle(() => {}, 1)).toBeFunction();

expectTypeOf(
  utils.throttle((a: number) => {
    console.log(a);
  }, 1),
).toExtend<(a: number) => void>();

expectTypeOf(
  utils.throttle((a: number, b: string) => {
    console.log(a, b);
  }, 1),
).toExtend<(a: number, b: string) => void>();

expectTypeOf(
  utils.throttle((a: number, b: string, c: boolean) => {
    console.log(a, b, c);
  }, 1),
).toExtend<(a: number, b: string, c: boolean) => void>();

expectTypeOf(
  utils.throttle((a: number, b: string, c: boolean, d: symbol) => {
    console.log(a, b, c, d);
  }, 1),
).toExtend<(a: number, b: string, c: boolean, d: symbol) => void>();

expectTypeOf(
  utils.throttle((a: number, b: string, c: boolean, d: symbol, e: bigint) => {
    console.log(a, b, c, d, e);
  }, 1),
).toExtend<(a: number, b: string, c: boolean, d: symbol, e: bigint) => void>();

// debouncedReload
expectTypeOf(utils.debouncedReload).toEqualTypeOf<() => void>();

// deepFreeze
const freezable = {
  foo: true,
  bar: 17,
  baz: "fizz",
  arr: [1, 2, 3],
  obj: {
    foo2: false,
    bar2: 71,
  },
};
type AfterFreezing = { foo: boolean; bar: number; baz: string; arr: number[]; obj: { foo2: boolean; bar2: number } };
expectTypeOf(utils.deepFreeze(freezable)).toEqualTypeOf<DeepReadonly<AfterFreezing>>();
expectTypeOf(utils.deepFreeze(freezable, {})).toEqualTypeOf<DeepReadonly<AfterFreezing>>();
expectTypeOf(utils.deepFreeze(freezable, { strict: true })).toEqualTypeOf<DeepReadonly<AfterFreezing>>();
expectTypeOf(utils.deepFreeze(freezable, { strict: undefined })).toEqualTypeOf<DeepReadonly<AfterFreezing>>();

// deepSeal

// TS doesn't have anything to indicate sealedness, this function's return type is a passthrough
expectTypeOf(utils.deepSeal(freezable)).toEqualTypeOf<typeof freezable>();
expectTypeOf(utils.deepSeal(freezable, {})).toEqualTypeOf<typeof freezable>();
expectTypeOf(utils.deepSeal(freezable, { strict: true })).toEqualTypeOf<typeof freezable>();
expectTypeOf(utils.deepSeal(freezable, { strict: undefined })).toEqualTypeOf<typeof freezable>();

// deepClone

const complexObject = {
  a: "",
  b: 0,
  toJSON: () => [
    false,
    undefined,
    {
      c: undefined,
      d: ((): boolean | symbol => false)(),
      e: [true],
      f: { g: 0, h: ((): number | undefined => 0)() },
    },
  ],
};

expectTypeOf(utils.deepClone("abc" as string)).toEqualTypeOf<string>();
expectTypeOf(utils.deepClone("abc" as const)).toEqualTypeOf<"abc">();
expectTypeOf(utils.deepClone(1 as number)).toEqualTypeOf<number>();
expectTypeOf(utils.deepClone(1 as const)).toEqualTypeOf<1>();
expectTypeOf(utils.deepClone(1n as bigint)).toEqualTypeOf<bigint>();
expectTypeOf(utils.deepClone(1n as const)).toEqualTypeOf<1n>();
expectTypeOf(utils.deepClone(true as const)).toEqualTypeOf<true>();
expectTypeOf(utils.deepClone(true as boolean)).toEqualTypeOf<boolean>();
expectTypeOf(utils.deepClone(Symbol("customSymbol"))).toEqualTypeOf<symbol>();
expectTypeOf(utils.deepClone(undefined)).toEqualTypeOf<undefined>();
expectTypeOf(utils.deepClone(null)).toEqualTypeOf<null>();
expectTypeOf(utils.deepClone(["a", "b"])).toEqualTypeOf<Array<string>>();
expectTypeOf(utils.deepClone(["a", "b"])).toEqualTypeOf<Array<string>>();
expectTypeOf(utils.deepClone({ a: "foo", b: 42 })).toEqualTypeOf<{ a: string; b: number }>();
expectTypeOf(utils.deepClone(new Date())).toEqualTypeOf<Date>();
expectTypeOf(utils.deepClone(complexObject)).toEqualTypeOf<typeof complexObject>();

expectTypeOf(utils.deepClone("abc" as string, { strict: false })).toEqualTypeOf<string>();
expectTypeOf(utils.deepClone("abc" as string, { strict: true })).toEqualTypeOf<string>();
expectTypeOf(utils.deepClone("abc" as string, { strict: undefined })).toEqualTypeOf<string>();

// diffObject

expectTypeOf(utils.diffObject({ a: 1 }, { a: 1 })).toEqualTypeOf<object>();
expectTypeOf(utils.diffObject({ a: 1 }, { a: 7, b: 2 })).toEqualTypeOf<object>();
expectTypeOf(utils.diffObject({ a: 1 }, { a: 1 }, {})).toEqualTypeOf<object>();
expectTypeOf(
  utils.diffObject(
    { a: 1 },
    { a: 1 },
    {
      deletionKeys: true,
      inner: true,
      _d: 0, // should never really be passed
    },
  ),
).toEqualTypeOf<object>();
expectTypeOf(
  utils.diffObject(
    { a: 1 },
    { a: 1 },
    {
      deletionKeys: undefined,
      inner: undefined,
      _d: undefined,
    },
  ),
).toEqualTypeOf<object>();

// applySpecialKeys

const hasSpecialKeys = {
  foo: 7,
  "-=foo": null,
  type: "character",
  "==type": "npc",
  system: { bar: 21 },
  "==system": { baz: 42 },
  fizz: true,
} as const;
// @ts-expect-error Return type not written yet, currently just a passthrough
expectTypeOf(utils.applySpecialKeys(hasSpecialKeys)).toEqualTypeOf<{
  type: string;
  system: { baz: number };
  fizz: boolean;
}>();

// objectsEqual

expectTypeOf(utils.objectsEqual({ a: 1 }, { a: 1 })).toEqualTypeOf<boolean>();

// duplicate

expectTypeOf(utils.duplicate("")).toEqualTypeOf<string>();

expectTypeOf(utils.duplicate(0)).toEqualTypeOf<number>();

expectTypeOf(utils.duplicate<0 | 1>(0)).toEqualTypeOf<0 | 1>();

expectTypeOf(utils.duplicate<"foo" | "bar">("foo")).toEqualTypeOf<"foo" | "bar">();

expectTypeOf(utils.duplicate<number>(0)).toEqualTypeOf<number>();

/* `NaN` will actually be converted to `null` but for ease of use, this is ignored. */
expectTypeOf(utils.duplicate<number>(NaN)).toEqualTypeOf<number>();

expectTypeOf(utils.duplicate(((): boolean => false)())).toEqualTypeOf<boolean>();

expectTypeOf(utils.duplicate(null)).toEqualTypeOf<null>();

expectTypeOf(utils.duplicate(undefined)).toEqualTypeOf<never>();

expectTypeOf(utils.duplicate(() => 0)).toEqualTypeOf<never>();

expectTypeOf(utils.duplicate(Symbol(""))).toEqualTypeOf<never>();

expectTypeOf(utils.duplicate(false as const)).toEqualTypeOf<false>();

expectTypeOf(utils.duplicate(((): string | boolean => "")())).toEqualTypeOf<string | boolean>();

expectTypeOf(utils.duplicate(((): string | number => "")())).toEqualTypeOf<string | number>();

expectTypeOf(utils.duplicate(((): string | null => "")())).toEqualTypeOf<string | null>();

expectTypeOf(utils.duplicate(((): string | undefined => "")())).toEqualTypeOf<string>();

expectTypeOf(utils.duplicate(((): string | AnyFunction => "")())).toEqualTypeOf<string>();

expectTypeOf(utils.duplicate(((): string | symbol => "")())).toEqualTypeOf<string>();

expectTypeOf(utils.duplicate([""])).toEqualTypeOf<Array<string>>();

expectTypeOf(utils.duplicate([0])).toEqualTypeOf<Array<number>>();

expectTypeOf(utils.duplicate([false, true])).toEqualTypeOf<Array<boolean>>();

expectTypeOf(utils.duplicate([null])).toEqualTypeOf<Array<null>>();

expectTypeOf(utils.duplicate([undefined])).toEqualTypeOf<Array<null>>();

expectTypeOf(utils.duplicate([() => 0])).toEqualTypeOf<Array<null>>();

expectTypeOf(utils.duplicate([Symbol("")])).toEqualTypeOf<Array<null>>();

expectTypeOf(utils.duplicate([false as const])).toEqualTypeOf<Array<false>>();

expectTypeOf(utils.duplicate(["", false, true])).toEqualTypeOf<Array<string | boolean>>();

expectTypeOf(utils.duplicate(["", 0])).toEqualTypeOf<Array<string | number>>();

expectTypeOf(utils.duplicate(["", null])).toEqualTypeOf<Array<string | null>>();

expectTypeOf(utils.duplicate(["", undefined])).toEqualTypeOf<Array<string | null>>();

expectTypeOf(utils.duplicate(["", () => 0])).toEqualTypeOf<Array<string | null>>();

expectTypeOf(utils.duplicate(["", Symbol("")])).toEqualTypeOf<Array<string | null>>();

expectTypeOf(utils.duplicate([((): "a" | "b" => "a")()])).toEqualTypeOf<Array<"a" | "b">>();

expectTypeOf(utils.duplicate([[false, true]])).toEqualTypeOf<Array<Array<boolean>>>();

expectTypeOf(utils.duplicate([{ a: "" }])).toEqualTypeOf<Array<{ a: string }>>();

expectTypeOf(utils.duplicate({ a: "" })).toEqualTypeOf<{ a: string }>();

expectTypeOf(utils.duplicate({ a: 0 })).toEqualTypeOf<{ a: number }>();

expectTypeOf(utils.duplicate({ a: ((): boolean => false)() })).toEqualTypeOf<{ a: boolean }>();

expectTypeOf(utils.duplicate({ a: null })).toEqualTypeOf<{ a: null }>();

expectTypeOf(utils.duplicate({ a: undefined })).toEqualTypeOf<NonNullish>();

expectTypeOf(utils.duplicate({ a: () => 0 })).toEqualTypeOf<NonNullish>();

expectTypeOf(utils.duplicate({ a: Symbol("") })).toEqualTypeOf<NonNullish>();

expectTypeOf(utils.duplicate({ a: ((): string | boolean => "")() })).toEqualTypeOf<{ a: string | boolean }>();

expectTypeOf(utils.duplicate({ a: ((): string | number => "")() })).toEqualTypeOf<{ a: string | number }>();

expectTypeOf(utils.duplicate({ a: ((): string | null => "")() })).toEqualTypeOf<{ a: string | null }>();

expectTypeOf(utils.duplicate({ a: ((): string | undefined => "")() })).toEqualTypeOf<{
  a?: string | undefined;
}>();

expectTypeOf(utils.duplicate({ a: ((): string | AnyFunction => "")() })).toEqualTypeOf<{
  a?: string | undefined;
}>();

expectTypeOf(utils.duplicate({ a: ((): string | symbol => "")() })).toEqualTypeOf<{ a?: string | undefined }>();

expectTypeOf(utils.duplicate({ a: [""] })).toEqualTypeOf<{ a: Array<string> }>();

expectTypeOf(utils.duplicate({ a: { b: "" } })).toEqualTypeOf<{ a: { b: string } }>();

expectTypeOf(utils.duplicate({ a: false as const })).toEqualTypeOf<{ a: false }>();

expectTypeOf(utils.duplicate({ a: ((): "a" | "b" => "a")() })).toEqualTypeOf<{ a: "a" | "b" }>();

expectTypeOf(utils.duplicate({ a: 0, b: "", c: false, toJSON: (): string => "" })).toEqualTypeOf<string>();

expectTypeOf(
  utils.duplicate({ a: 0, b: "", c: false, toJSON: () => ({ foo: "", bar: ((): boolean => false)() }) }),
).toEqualTypeOf<{ foo: string; bar: boolean }>();

expectTypeOf(
  utils.duplicate({
    a: 0,
    b: "",
    c: false,
    toJSON: () => ({ foo: "", bar: ((): boolean => false)(), toJSON: () => "" }),
  }),
).toEqualTypeOf<{ foo: string; bar: boolean }>();

expectTypeOf(
  utils.duplicate({
    a: 0,
    b: "",
    c: false,
    toJSON: () => ({ foo: "", bar: { baz: "", toJSON: () => false } }),
  }),
).toEqualTypeOf<{ foo: string; bar: false }>();

expectTypeOf(utils.duplicate(complexObject)).toEqualTypeOf<
  Array<
    | boolean
    | null
    | {
        d?: boolean | undefined;
        e: Array<boolean>;
        f: { g: number; h?: number | undefined };
      }
  >
>();

// isDeletionKey

const deletionKey = "-=foo";
expectTypeOf(utils.isDeletionKey(deletionKey)).toBeBoolean();

// isSubclass

declare class ClassWithNoConstructorParameters {}

declare class ClassWithConstructorParameters {
  constructor(a: number, b: string);
}

expectTypeOf(
  utils.isSubclass(ClassWithNoConstructorParameters, ClassWithConstructorParameters),
).toEqualTypeOf<boolean>();
expectTypeOf(
  utils.isSubclass(ClassWithConstructorParameters, ClassWithNoConstructorParameters),
).toEqualTypeOf<boolean>();

// getDefiningClass

expectTypeOf(utils.getDefiningClass(foundry.documents.BaseActor, "name")).toEqualTypeOf<AnyConstructor>();

// encodeURL

expectTypeOf(utils.encodeURL("")).toEqualTypeOf<string>();

// expandObject

expectTypeOf(utils.expandObject({})).toEqualTypeOf<object>();

// filterObject

expectTypeOf(utils.filterObject({}, {})).toEqualTypeOf<object>();
expectTypeOf(utils.filterObject({}, {}, {})).toEqualTypeOf<object>();
expectTypeOf(utils.filterObject({}, {}, { deletionKeys: true, templateValues: true })).toEqualTypeOf<object>();
expectTypeOf(
  utils.filterObject({}, {}, { deletionKeys: undefined, templateValues: undefined }),
).toEqualTypeOf<object>();

// flattenObject

expectTypeOf(utils.flattenObject({})).toEqualTypeOf<object>();

// getParentClasses

expectTypeOf(utils.getParentClasses(foundry.documents.BaseActor)).toEqualTypeOf<AnyConstructor[]>();

// getRoute

expectTypeOf(utils.getRoute("")).toEqualTypeOf<string>();
expectTypeOf(utils.getRoute("", {})).toEqualTypeOf<string>();
expectTypeOf(utils.getRoute("", { prefix: "foo/" })).toEqualTypeOf<string>();
expectTypeOf(utils.getRoute("", { prefix: undefined })).toEqualTypeOf<string>();
expectTypeOf(utils.getRoute("", { prefix: null })).toEqualTypeOf<string>();

// getType

expectTypeOf(utils.getType("")).toEqualTypeOf<
  | "Array"
  | "Error"
  | "HTMLElement"
  | "Map"
  | "Object"
  | "Promise"
  | "Set"
  | "bigint"
  | "boolean"
  | "function"
  | "null"
  | "number"
  | "string"
  | "symbol"
  | "undefined"
  | "Unknown"
>();

// hasProperty

expectTypeOf(utils.hasProperty({}, "foo")).toEqualTypeOf<boolean>();

// getProperty

expectTypeOf(utils.getProperty({}, "bar")).toEqualTypeOf<unknown>();

// setProperty

expectTypeOf(utils.setProperty({}, "baz", 4)).toEqualTypeOf<boolean>();

// deleteProperty

expectTypeOf(utils.deleteProperty({}, "fizz")).toBeBoolean();

// invertObject

expectTypeOf(utils.invertObject({ a: 1, b: "foo" } as const)).toEqualTypeOf<{
  1: "a";
  foo: "b";
}>();

// isNewerVersion
expectTypeOf(utils.isNewerVersion(4, "2.3")).toEqualTypeOf<boolean>();

// isEmpty
expectTypeOf(utils.isEmpty(4)).toEqualTypeOf<boolean>();

// mergeObject: assertType is used here because of https://github.com/SamVerschueren/tsd/issues/67

// mergeObject (1): tests from the docs
assertType<{ k1: string }>(utils.mergeObject({ k1: "v1" }, { k2: "v2" }, { insertKeys: false }));
assertType<{ k1: string; k2: string }>(utils.mergeObject({ k1: "v1" }, { k2: "v2" }, { insertKeys: true }));
assertType<{ k1: { i1: string } }>(
  utils.mergeObject({ k1: { i1: "v1" } }, { k1: { i2: "v2" } }, { insertValues: false }),
);
assertType<{ k1: { i1: string; i2: string } }>(
  utils.mergeObject({ k1: { i1: "v1" } }, { k1: { i2: "v2" } }, { insertValues: true }),
);

assertType<{ k1: string }>(utils.mergeObject({ k1: "v1" }, { k1: "v2" }, { overwrite: true }));
assertType<{ k1: string }>(utils.mergeObject({ k1: "v1" }, { k1: "v2" }, { overwrite: false }));

assertType<{ k1: { i2: string } }>(utils.mergeObject({ k1: { i1: "v1" } }, { k1: { i2: "v2" } }, { recursive: false }));
assertType<{ k1: { i1: string; i2: string } }>(
  utils.mergeObject({ k1: { i1: "v1" } }, { k1: { i2: "v2" } }, { recursive: true }),
);

// mergeObject (2): more simple tests

assertType<{ k1: string }>(utils.mergeObject({ k1: "" }, { k1: "" }));
assertType<{ k1: string }>(utils.mergeObject({ k1: "" }, { k1: "" }, {}));
assertType<{ k1: string }>(utils.mergeObject({ k1: "" }, { k1: "" }, { insertKeys: false }));
assertType<{ k1: string }>(utils.mergeObject({ k1: "" }, { k1: "" }, { insertKeys: true }));

assertType<{ k1: string; k2: string }>(utils.mergeObject({ k1: "" }, { k2: "" }));
assertType<{ k1: string; k2: string }>(utils.mergeObject({ k1: "" }, { k2: "" }, {}));
assertType<{ k1: string }>(utils.mergeObject({ k1: "" }, { k2: "" }, { insertKeys: false }));
assertType<{ k1: string; k2: string }>(utils.mergeObject({ k1: "" }, { k2: "" }, { insertKeys: true }));

assertType<{ k1: number; k2: string }>(utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }));
assertType<{ k1: number; k2: string }>(utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, {}));
assertType<{ k1: number }>(utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { insertKeys: false }));
assertType<{ k1: number; k2: string }>(utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { insertKeys: true }));

assertType<never>(utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { enforceTypes: true }));
assertType<{ k1: number; k2: string }>(utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { enforceTypes: false }));
assertType<never>(utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { enforceTypes: true, insertKeys: false }));
assertType<never>(utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { enforceTypes: true, insertKeys: true }));

assertType<{ k1: string; k2: string }>(utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { overwrite: false }));
assertType<{ k1: number; k2: string }>(utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { overwrite: true }));
assertType<{ k1: number; k2: string }>(utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, {}));
assertType<{ k1: string }>(utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { overwrite: false, insertKeys: false }));
assertType<{ k1: string; k2: string }>(
  utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { overwrite: false, insertKeys: true }),
);

// mergeObject (3): more complex examples
assertType<{ k1: { i1: string; i2: string }; k2: number; k3: number }>(
  utils.mergeObject({ k1: { i1: "foo" }, k2: 2 }, { k1: { i2: "bar" }, k3: 3 }),
);
assertType<{ k1: { i1: string; i2: string; i3: number }; k2: number; k3: number }>(
  utils.mergeObject({ k1: { i1: "foo", i3: { j1: 0 } }, k2: 2 }, { k1: { i2: "bar", i3: 2 }, k3: 3 }),
);
assertType<{ k1: { i2: string; i3: number }; k2: number; k3: number }>(
  utils.mergeObject(
    { k1: { i1: "foo", i3: { j1: 0 } }, k2: 2 },
    { k1: { i2: "bar", i3: 2 }, k3: 3 },
    { recursive: false },
  ),
);
expectTypeOf(
  utils.mergeObject(
    { k1: { i1: "foo", i3: { j1: 0 } }, k2: 2 },
    { k1: { i2: "bar", i3: 2 }, k3: 3 },
    { recursive: false },
  ).k1,
).toEqualTypeOf<{ i2: string; i3: number }>();
assertType<{
  k1: { i1: string; i2: string; i3: { j1: string; j2: number; j3: string } };
  k2: number;
  k3: number;
}>(
  utils.mergeObject(
    { k1: { i1: "foo", i3: { j1: 1, j2: 2 } }, k2: 2 },
    { k1: { i2: "bar", i3: { j1: "1", j3: "3" } }, k3: 3 },
  ),
);
assertType<{ k1: { i1: string; i3: { j1: string; j2: number } }; k2: number; k3: number }>(
  utils.mergeObject(
    { k1: { i1: "foo", i3: { j1: 1, j2: 2 } }, k2: 2 },
    { k1: { i2: "bar", i3: { j1: "1", j3: "3" } }, k3: 3 },
    { insertValues: false },
  ),
);
assertType<{ k1: { i2: string; i3: { j1: string; j3: string } }; k2: number; k3: number }>(
  utils.mergeObject(
    { k1: { i1: "foo", i3: { j1: 1, j2: 2 } }, k2: 2 },
    { k1: { i2: "bar", i3: { j1: "1", j3: "3" } }, k3: 3 },
    { recursive: false },
  ),
);

// Array merging

assertType<FormApplication.Options>(
  utils.mergeObject(FormApplication.defaultOptions, {
    classes: ["my", "custom", "css"],
  }),
);
assertType<{ a: number[] }>(utils.mergeObject({ a: ["foo"] }, { a: [0] }));
assertType<{ a: number[] }>(utils.mergeObject({ a: ["foo"] }, { a: [0] }, { insertKeys: true }));
assertType<{ a: number[] }>(utils.mergeObject({ a: ["foo"] }, { a: [0] }, { insertValues: true }));
assertType<{ a: number[] }>(utils.mergeObject({ a: ["foo"] }, { a: [0] }, { insertKeys: false }));
assertType<{ a: number[] }>(utils.mergeObject({ a: ["foo"] }, { a: [0] }, { insertValues: false }));
assertType<{ a: number[] }>(utils.mergeObject({ a: ["foo"] }, { a: [0] }, { enforceTypes: true }));
assertType<never>(utils.mergeObject({ a: ["foo"] }, { a: { b: "foo" } }, { enforceTypes: true }));
assertType<{ a: { b: string } }>(utils.mergeObject({ a: ["foo"] }, { a: { b: "foo" } }, { enforceTypes: false }));
assertType<never>(utils.mergeObject({ a: { b: "foo" } }, { a: ["foo"] }, { enforceTypes: true }));
assertType<{ a: string[] }>(utils.mergeObject({ a: { b: "foo" } }, { a: ["foo"] }, { enforceTypes: false }));

// performDeletions
// v10, `-=` prefixed keys are no longer auto removed
assertType<{ k1: string; k2: string; "-=k1": null }>(utils.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }));
assertType<{ k1: string; k2: string; "-=k1": null }>(
  utils.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }, { performDeletions: false }),
);
assertType<{ k2: string; "-=k1": null }>(utils.mergeObject({ k2: "v2" }, { "-=k1": null }));
assertType<{ k1: string; k2: string; "-=k1": null }>(utils.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }));

assertType<{ k2: string }>(utils.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }, { performDeletions: true }));

assertType<{ k1: string; k2: string; "-=k1": null }>(
  // @ts-expect-error deletions are performed so `-=k1` shouldn't be kept.
  utils.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }, { performDeletions: true }),
);

assertType<{ k2: string; "-=k1": null }>(
  // @ts-expect-error deletions are performed so `-=k1` shouldn't be kept.
  utils.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }, { performDeletions: true }),
);

assertType<{ k1: string; k2: string }>(
  // @ts-expect-error deletions are performed so `k1` should be gone.
  utils.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }, { performDeletions: true }),
);

assertType<{ k2: string }>(utils.mergeObject({ k2: "v2" }, { "-=k1": null }, { insertKeys: false }));

assertType<{ k2: string; "-=k1": null }>(
  // @ts-expect-error new keys won't be inserted
  utils.mergeObject({ k2: "v2" }, { "-=k1": null }, { insertKeys: false }),
);

assertType<{ wrapper: { k2: string } }>(
  utils.mergeObject(
    { wrapper: { k1: "v1", k2: "v2" } },
    { wrapper: { "-=k1": null } },
    { recursive: true, performDeletions: true },
  ),
);
assertType<{ wrapper: { k1: string; k2: string; "-=k1": null } }>(
  utils.mergeObject({ wrapper: { k1: "v1", k2: "v2" } }, { wrapper: { "-=k1": null } }, { recursive: true }),
);

// bonus round
assertType<{ a: number; b: number }>(utils.mergeObject({ a: 1 }, { b: 2 }, { enforceTypes: true }));

// @ts-expect-error these objects should be mergeable and not never
assertType<never>(utils.mergeObject({ a: 1 }, { b: 2 }, { enforceTypes: true }));

assertType<{ a: { a: number; b: number } }>(
  utils.mergeObject({ a: { a: 1 } }, { a: { b: 2 } }, { enforceTypes: true }),
);

// @ts-expect-error these objects should be mergeable and not never
assertType<never>(utils.mergeObject({ a: { a: 1 } }, { b: { a: 2 } }, { enforceTypes: true }));

assertType<{ a: { a: number }; b: { a: number }; c: number }>(
  utils.mergeObject({ a: { a: 1 }, c: 1 }, { b: { a: 2 }, c: 1 }, { enforceTypes: true }),
);

assertType<never>(
  // @ts-expect-error these objects should be mergeable and not never
  utils.mergeObject({ a: { a: 1 }, c: 1 }, { b: { a: 2 }, c: 1 }, { enforceTypes: true }),
);

// @ts-expect-error - A number isn't a valid object to merge.
utils.mergeObject(1, 2);

// @ts-expect-error - A string isn't a valid object to merge.
utils.mergeObject("foo", "bar");

// parseS3URL

expectTypeOf(utils.parseS3URL("s3://someBucket/key")).toEqualTypeOf<{ bucket: string | null; keyPrefix: string }>();

// randomID

expectTypeOf(utils.randomID(16)).toEqualTypeOf<string>();
expectTypeOf(utils.randomID()).toEqualTypeOf<string>();

// timeSince

expectTypeOf(utils.timeSince(new Date())).toEqualTypeOf<string>();
expectTypeOf(utils.timeSince("")).toEqualTypeOf<string>();

// formatFileSize

expectTypeOf(utils.formatFileSize(4)).toEqualTypeOf<string>();
expectTypeOf(utils.formatFileSize(4, {})).toEqualTypeOf<string>();
expectTypeOf(utils.formatFileSize(4, { base: 2, decimalPlaces: 7 })).toEqualTypeOf<string>();
expectTypeOf(utils.formatFileSize(4, { base: undefined, decimalPlaces: undefined }));

// @ts-expect-error: base must be 2 or 10
expectTypeOf(utils.formatFileSize(4, { base: 6 })).toEqualTypeOf<string>();

// parseUuid

declare const someActor: Actor.Implementation;
expectTypeOf(utils.parseUuid("Compendium.Actor.AAAAASomeIDAAAAA")).toEqualTypeOf<utils.ResolvedUUID>();
expectTypeOf(utils.parseUuid("Compendium.Actor.AAAAASomeIDAAAAA", {})).toEqualTypeOf<utils.ResolvedUUID>();
expectTypeOf(
  utils.parseUuid("Compendium.Actor.AAAAASomeIDAAAAA", { relative: undefined }),
).toEqualTypeOf<utils.ResolvedUUID>();
expectTypeOf(utils.parseUuid(".Item.IIIIISomeIDIIIII", { relative: someActor })).toEqualTypeOf<utils.ResolvedUUID>();

// escapeHTML

expectTypeOf(utils.escapeHTML(`foo < some string > some 'other string' & some "third string"`)).toBeString();

// unescapeHTML

expectTypeOf(
  utils.unescapeHTML(`foo &lt; some string &gt; some &#x27;other string&#x27; &amp; some &quot;third string&quot;`),
).toBeString();
