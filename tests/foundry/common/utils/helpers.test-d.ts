import { expectTypeOf, assertType } from "vitest";
import type { AnyConstructor, AnyFunction, NonNullish } from "fvtt-types/utils";
import fu = foundry.utils;

declare function functionWithoutParameters(): void;
declare function functionWithParameters(a: number, b: string, c?: boolean): void;
declare function functionWithReturnTypeOtherThanVoid(): number;

// benchmark

expectTypeOf(fu.benchmark(functionWithoutParameters, 42)).toEqualTypeOf<Promise<void>>();

// @ts-expect-error - the function takes no arguments
fu.benchmark(functionWithoutParameters, 42, "unknown argument");

expectTypeOf(fu.benchmark(functionWithParameters, 42, 1, "", false)).toEqualTypeOf<Promise<void>>();
expectTypeOf(fu.benchmark(functionWithParameters, 42, 1, "")).toEqualTypeOf<Promise<void>>();

// @ts-expect-error - the function takes a number and a string
fu.benchmark(functionWithParameters, 42, 1);

// @ts-expect-error - the function takes doesn't take three arguments
fu.benchmark(functionWithParameters, 42, 1, "", "unknown argument");

expectTypeOf(fu.benchmark(functionWithReturnTypeOtherThanVoid, 42)).toEqualTypeOf<Promise<void>>();

// threadLock
expectTypeOf(fu.threadLock(42)).toEqualTypeOf<Promise<void>>();

// debounce
expectTypeOf(fu.debounce(functionWithoutParameters, 500)).toEqualTypeOf<() => void>();
expectTypeOf(fu.debounce(functionWithParameters, 500)).toEqualTypeOf<(a: number, b: string, c?: boolean) => void>();

// throttle
expectTypeOf(fu.throttle(functionWithoutParameters, 500)).toEqualTypeOf<() => void>();
expectTypeOf(fu.throttle(functionWithParameters, 500)).toEqualTypeOf<(a: number, b: string, c?: boolean) => void>();
expectTypeOf(fu.throttle(() => {}, 1)).toBeFunction();

expectTypeOf(
  fu.throttle((a: number) => {
    console.log(a);
  }, 1),
).toExtend<(a: number) => void>();

expectTypeOf(
  fu.throttle((a: number, b: string) => {
    console.log(a, b);
  }, 1),
).toExtend<(a: number, b: string) => void>();

expectTypeOf(
  fu.throttle((a: number, b: string, c: boolean) => {
    console.log(a, b, c);
  }, 1),
).toExtend<(a: number, b: string, c: boolean) => void>();

expectTypeOf(
  fu.throttle((a: number, b: string, c: boolean, d: symbol) => {
    console.log(a, b, c, d);
  }, 1),
).toExtend<(a: number, b: string, c: boolean, d: symbol) => void>();

expectTypeOf(
  fu.throttle((a: number, b: string, c: boolean, d: symbol, e: bigint) => {
    console.log(a, b, c, d, e);
  }, 1),
).toExtend<(a: number, b: string, c: boolean, d: symbol, e: bigint) => void>();

// debouncedReload
expectTypeOf(fu.debouncedReload).toEqualTypeOf<() => void>();

// deepFreeze
const freezable = {
  foo: true,
  bar: 17,
  baz: "fizz",
};
expectTypeOf(fu.deepFreeze(freezable)).toEqualTypeOf<Readonly<{ foo: boolean; bar: number; baz: string }>>();
expectTypeOf(fu.deepFreeze(freezable, {})).toEqualTypeOf<Readonly<{ foo: boolean; bar: number; baz: string }>>();
expectTypeOf(fu.deepFreeze(freezable, { strict: true })).toEqualTypeOf<
  Readonly<{ foo: boolean; bar: number; baz: string }>
>();
expectTypeOf(fu.deepFreeze(freezable, { strict: undefined })).toEqualTypeOf<
  Readonly<{ foo: boolean; bar: number; baz: string }>
>();

// deepSeal

// TS doesn't have anything to indicate sealedness, this function's return type is a passthrough
expectTypeOf(fu.deepSeal(freezable)).toEqualTypeOf<typeof freezable>();
expectTypeOf(fu.deepSeal(freezable, {})).toEqualTypeOf<typeof freezable>();
expectTypeOf(fu.deepSeal(freezable, { strict: true })).toEqualTypeOf<typeof freezable>();
expectTypeOf(fu.deepSeal(freezable, { strict: undefined })).toEqualTypeOf<typeof freezable>();

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

expectTypeOf(fu.deepClone("abc" as string)).toEqualTypeOf<string>();
expectTypeOf(fu.deepClone("abc" as const)).toEqualTypeOf<"abc">();
expectTypeOf(fu.deepClone(1 as number)).toEqualTypeOf<number>();
expectTypeOf(fu.deepClone(1 as const)).toEqualTypeOf<1>();
expectTypeOf(fu.deepClone(1n as bigint)).toEqualTypeOf<bigint>();
expectTypeOf(fu.deepClone(1n as const)).toEqualTypeOf<1n>();
expectTypeOf(fu.deepClone(true as const)).toEqualTypeOf<true>();
expectTypeOf(fu.deepClone(true as boolean)).toEqualTypeOf<boolean>();
expectTypeOf(fu.deepClone(Symbol("customSymbol"))).toEqualTypeOf<symbol>();
expectTypeOf(fu.deepClone(undefined)).toEqualTypeOf<undefined>();
expectTypeOf(fu.deepClone(null)).toEqualTypeOf<null>();
expectTypeOf(fu.deepClone(["a", "b"])).toEqualTypeOf<Array<string>>();
expectTypeOf(fu.deepClone(["a", "b"])).toEqualTypeOf<Array<string>>();
expectTypeOf(fu.deepClone({ a: "foo", b: 42 })).toEqualTypeOf<{ a: string; b: number }>();
expectTypeOf(fu.deepClone(new Date())).toEqualTypeOf<Date>();
expectTypeOf(fu.deepClone(complexObject)).toEqualTypeOf<typeof complexObject>();

expectTypeOf(fu.deepClone("abc" as string, { strict: false })).toEqualTypeOf<string>();
expectTypeOf(fu.deepClone("abc" as string, { strict: true })).toEqualTypeOf<string>();
expectTypeOf(fu.deepClone("abc" as string, { strict: undefined })).toEqualTypeOf<string>();

// diffObject

expectTypeOf(fu.diffObject({ a: 1 }, { a: 1 })).toEqualTypeOf<object>();
expectTypeOf(fu.diffObject({ a: 1 }, { a: 7, b: 2 })).toEqualTypeOf<object>();
expectTypeOf(fu.diffObject({ a: 1 }, { a: 1 }, {})).toEqualTypeOf<object>();
expectTypeOf(
  fu.diffObject(
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
  fu.diffObject(
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
expectTypeOf(fu.applySpecialKeys(hasSpecialKeys)).toEqualTypeOf<{
  type: string;
  system: { baz: number };
  fizz: boolean;
}>();

// objectsEqual

expectTypeOf(fu.objectsEqual({ a: 1 }, { a: 1 })).toEqualTypeOf<boolean>();

// duplicate

expectTypeOf(fu.duplicate("")).toEqualTypeOf<string>();

expectTypeOf(fu.duplicate(0)).toEqualTypeOf<number>();

expectTypeOf(fu.duplicate<0 | 1>(0)).toEqualTypeOf<0 | 1>();

expectTypeOf(fu.duplicate<"foo" | "bar">("foo")).toEqualTypeOf<"foo" | "bar">();

expectTypeOf(fu.duplicate<number>(0)).toEqualTypeOf<number>();

/* `NaN` will actually be converted to `null` but for ease of use, this is ignored. */
expectTypeOf(fu.duplicate<number>(NaN)).toEqualTypeOf<number>();

expectTypeOf(fu.duplicate(((): boolean => false)())).toEqualTypeOf<boolean>();

expectTypeOf(fu.duplicate(null)).toEqualTypeOf<null>();

expectTypeOf(fu.duplicate(undefined)).toEqualTypeOf<never>();

expectTypeOf(fu.duplicate(() => 0)).toEqualTypeOf<never>();

expectTypeOf(fu.duplicate(Symbol(""))).toEqualTypeOf<never>();

expectTypeOf(fu.duplicate(false as const)).toEqualTypeOf<false>();

expectTypeOf(fu.duplicate(((): string | boolean => "")())).toEqualTypeOf<string | boolean>();

expectTypeOf(fu.duplicate(((): string | number => "")())).toEqualTypeOf<string | number>();

expectTypeOf(fu.duplicate(((): string | null => "")())).toEqualTypeOf<string | null>();

expectTypeOf(fu.duplicate(((): string | undefined => "")())).toEqualTypeOf<string>();

expectTypeOf(fu.duplicate(((): string | AnyFunction => "")())).toEqualTypeOf<string>();

expectTypeOf(fu.duplicate(((): string | symbol => "")())).toEqualTypeOf<string>();

expectTypeOf(fu.duplicate([""])).toEqualTypeOf<Array<string>>();

expectTypeOf(fu.duplicate([0])).toEqualTypeOf<Array<number>>();

expectTypeOf(fu.duplicate([false, true])).toEqualTypeOf<Array<boolean>>();

expectTypeOf(fu.duplicate([null])).toEqualTypeOf<Array<null>>();

expectTypeOf(fu.duplicate([undefined])).toEqualTypeOf<Array<null>>();

expectTypeOf(fu.duplicate([() => 0])).toEqualTypeOf<Array<null>>();

expectTypeOf(fu.duplicate([Symbol("")])).toEqualTypeOf<Array<null>>();

expectTypeOf(fu.duplicate([false as const])).toEqualTypeOf<Array<false>>();

expectTypeOf(fu.duplicate(["", false, true])).toEqualTypeOf<Array<string | boolean>>();

expectTypeOf(fu.duplicate(["", 0])).toEqualTypeOf<Array<string | number>>();

expectTypeOf(fu.duplicate(["", null])).toEqualTypeOf<Array<string | null>>();

expectTypeOf(fu.duplicate(["", undefined])).toEqualTypeOf<Array<string | null>>();

expectTypeOf(fu.duplicate(["", () => 0])).toEqualTypeOf<Array<string | null>>();

expectTypeOf(fu.duplicate(["", Symbol("")])).toEqualTypeOf<Array<string | null>>();

expectTypeOf(fu.duplicate([((): "a" | "b" => "a")()])).toEqualTypeOf<Array<"a" | "b">>();

expectTypeOf(fu.duplicate([[false, true]])).toEqualTypeOf<Array<Array<boolean>>>();

expectTypeOf(fu.duplicate([{ a: "" }])).toEqualTypeOf<Array<{ a: string }>>();

expectTypeOf(fu.duplicate({ a: "" })).toEqualTypeOf<{ a: string }>();

expectTypeOf(fu.duplicate({ a: 0 })).toEqualTypeOf<{ a: number }>();

expectTypeOf(fu.duplicate({ a: ((): boolean => false)() })).toEqualTypeOf<{ a: boolean }>();

expectTypeOf(fu.duplicate({ a: null })).toEqualTypeOf<{ a: null }>();

expectTypeOf(fu.duplicate({ a: undefined })).toEqualTypeOf<NonNullish>();

expectTypeOf(fu.duplicate({ a: () => 0 })).toEqualTypeOf<NonNullish>();

expectTypeOf(fu.duplicate({ a: Symbol("") })).toEqualTypeOf<NonNullish>();

expectTypeOf(fu.duplicate({ a: ((): string | boolean => "")() })).toEqualTypeOf<{ a: string | boolean }>();

expectTypeOf(fu.duplicate({ a: ((): string | number => "")() })).toEqualTypeOf<{ a: string | number }>();

expectTypeOf(fu.duplicate({ a: ((): string | null => "")() })).toEqualTypeOf<{ a: string | null }>();

expectTypeOf(fu.duplicate({ a: ((): string | undefined => "")() })).toEqualTypeOf<{
  a?: string | undefined;
}>();

expectTypeOf(fu.duplicate({ a: ((): string | AnyFunction => "")() })).toEqualTypeOf<{
  a?: string | undefined;
}>();

expectTypeOf(fu.duplicate({ a: ((): string | symbol => "")() })).toEqualTypeOf<{ a?: string | undefined }>();

expectTypeOf(fu.duplicate({ a: [""] })).toEqualTypeOf<{ a: Array<string> }>();

expectTypeOf(fu.duplicate({ a: { b: "" } })).toEqualTypeOf<{ a: { b: string } }>();

expectTypeOf(fu.duplicate({ a: false as const })).toEqualTypeOf<{ a: false }>();

expectTypeOf(fu.duplicate({ a: ((): "a" | "b" => "a")() })).toEqualTypeOf<{ a: "a" | "b" }>();

expectTypeOf(fu.duplicate({ a: 0, b: "", c: false, toJSON: (): string => "" })).toEqualTypeOf<string>();

expectTypeOf(
  fu.duplicate({ a: 0, b: "", c: false, toJSON: () => ({ foo: "", bar: ((): boolean => false)() }) }),
).toEqualTypeOf<{ foo: string; bar: boolean }>();

expectTypeOf(
  fu.duplicate({
    a: 0,
    b: "",
    c: false,
    toJSON: () => ({ foo: "", bar: ((): boolean => false)(), toJSON: () => "" }),
  }),
).toEqualTypeOf<{ foo: string; bar: boolean }>();

expectTypeOf(
  fu.duplicate({
    a: 0,
    b: "",
    c: false,
    toJSON: () => ({ foo: "", bar: { baz: "", toJSON: () => false } }),
  }),
).toEqualTypeOf<{ foo: string; bar: false }>();

expectTypeOf(fu.duplicate(complexObject)).toEqualTypeOf<
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
expectTypeOf(fu.isDeletionKey(deletionKey)).toBeBoolean();

// isSubclass

declare class ClassWithNoConstructorParameters {}

declare class ClassWithConstructorParameters {
  constructor(a: number, b: string);
}

expectTypeOf(fu.isSubclass(ClassWithNoConstructorParameters, ClassWithConstructorParameters)).toEqualTypeOf<boolean>();
expectTypeOf(fu.isSubclass(ClassWithConstructorParameters, ClassWithNoConstructorParameters)).toEqualTypeOf<boolean>();

// getDefiningClass

expectTypeOf(fu.getDefiningClass(foundry.documents.BaseActor, "name")).toEqualTypeOf<AnyConstructor>();

// encodeURL

expectTypeOf(fu.encodeURL("")).toEqualTypeOf<string>();

// expandObject

expectTypeOf(fu.expandObject({})).toEqualTypeOf<object>();

// filterObject

expectTypeOf(fu.filterObject({}, {})).toEqualTypeOf<object>();
expectTypeOf(fu.filterObject({}, {}, {})).toEqualTypeOf<object>();
expectTypeOf(fu.filterObject({}, {}, { deletionKeys: true, templateValues: true })).toEqualTypeOf<object>();
expectTypeOf(fu.filterObject({}, {}, { deletionKeys: undefined, templateValues: undefined })).toEqualTypeOf<object>();

// flattenObject

expectTypeOf(fu.flattenObject({})).toEqualTypeOf<object>();

// getParentClasses

expectTypeOf(fu.getParentClasses(foundry.documents.BaseActor)).toEqualTypeOf<AnyConstructor[]>();

// getRoute

expectTypeOf(fu.getRoute("")).toEqualTypeOf<string>();
expectTypeOf(fu.getRoute("", {})).toEqualTypeOf<string>();
expectTypeOf(fu.getRoute("", { prefix: "foo/" })).toEqualTypeOf<string>();
expectTypeOf(fu.getRoute("", { prefix: undefined })).toEqualTypeOf<string>();
expectTypeOf(fu.getRoute("", { prefix: null })).toEqualTypeOf<string>();

// getType

expectTypeOf(fu.getType("")).toEqualTypeOf<
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

expectTypeOf(fu.hasProperty({}, "foo")).toEqualTypeOf<boolean>();

// getProperty

expectTypeOf(fu.getProperty({}, "bar")).toEqualTypeOf<unknown>();

// setProperty

expectTypeOf(fu.setProperty({}, "baz", 4)).toEqualTypeOf<boolean>();

// deleteProperty

expectTypeOf(fu.deleteProperty({}, "fizz")).toBeBoolean();

// invertObject

expectTypeOf(fu.invertObject({ a: 1, b: "foo" } as const)).toEqualTypeOf<{
  1: "a";
  foo: "b";
}>();

// isNewerVersion
expectTypeOf(fu.isNewerVersion(4, "2.3")).toEqualTypeOf<boolean>();

// isEmpty
expectTypeOf(fu.isEmpty(4)).toEqualTypeOf<boolean>();

// mergeObject: assertType is used here because of https://github.com/SamVerschueren/tsd/issues/67

// mergeObject (1): tests from the docs
assertType<{ k1: string }>(fu.mergeObject({ k1: "v1" }, { k2: "v2" }, { insertKeys: false }));
assertType<{ k1: string; k2: string }>(fu.mergeObject({ k1: "v1" }, { k2: "v2" }, { insertKeys: true }));
assertType<{ k1: { i1: string } }>(fu.mergeObject({ k1: { i1: "v1" } }, { k1: { i2: "v2" } }, { insertValues: false }));
assertType<{ k1: { i1: string; i2: string } }>(
  fu.mergeObject({ k1: { i1: "v1" } }, { k1: { i2: "v2" } }, { insertValues: true }),
);

assertType<{ k1: string }>(fu.mergeObject({ k1: "v1" }, { k1: "v2" }, { overwrite: true }));
assertType<{ k1: string }>(fu.mergeObject({ k1: "v1" }, { k1: "v2" }, { overwrite: false }));

assertType<{ k1: { i2: string } }>(fu.mergeObject({ k1: { i1: "v1" } }, { k1: { i2: "v2" } }, { recursive: false }));
assertType<{ k1: { i1: string; i2: string } }>(
  fu.mergeObject({ k1: { i1: "v1" } }, { k1: { i2: "v2" } }, { recursive: true }),
);

// mergeObject (2): more simple tests

assertType<{ k1: string }>(fu.mergeObject({ k1: "" }, { k1: "" }));
assertType<{ k1: string }>(fu.mergeObject({ k1: "" }, { k1: "" }, {}));
assertType<{ k1: string }>(fu.mergeObject({ k1: "" }, { k1: "" }, { insertKeys: false }));
assertType<{ k1: string }>(fu.mergeObject({ k1: "" }, { k1: "" }, { insertKeys: true }));

assertType<{ k1: string; k2: string }>(fu.mergeObject({ k1: "" }, { k2: "" }));
assertType<{ k1: string; k2: string }>(fu.mergeObject({ k1: "" }, { k2: "" }, {}));
assertType<{ k1: string }>(fu.mergeObject({ k1: "" }, { k2: "" }, { insertKeys: false }));
assertType<{ k1: string; k2: string }>(fu.mergeObject({ k1: "" }, { k2: "" }, { insertKeys: true }));

assertType<{ k1: number; k2: string }>(fu.mergeObject({ k1: "" }, { k1: 2, k2: "" }));
assertType<{ k1: number; k2: string }>(fu.mergeObject({ k1: "" }, { k1: 2, k2: "" }, {}));
assertType<{ k1: number }>(fu.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { insertKeys: false }));
assertType<{ k1: number; k2: string }>(fu.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { insertKeys: true }));

assertType<never>(fu.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { enforceTypes: true }));
assertType<{ k1: number; k2: string }>(fu.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { enforceTypes: false }));
assertType<never>(fu.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { enforceTypes: true, insertKeys: false }));
assertType<never>(fu.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { enforceTypes: true, insertKeys: true }));

assertType<{ k1: string; k2: string }>(fu.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { overwrite: false }));
assertType<{ k1: number; k2: string }>(fu.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { overwrite: true }));
assertType<{ k1: number; k2: string }>(fu.mergeObject({ k1: "" }, { k1: 2, k2: "" }, {}));
assertType<{ k1: string }>(fu.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { overwrite: false, insertKeys: false }));
assertType<{ k1: string; k2: string }>(
  fu.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { overwrite: false, insertKeys: true }),
);

// mergeObject (3): more complex examples
assertType<{ k1: { i1: string; i2: string }; k2: number; k3: number }>(
  fu.mergeObject({ k1: { i1: "foo" }, k2: 2 }, { k1: { i2: "bar" }, k3: 3 }),
);
assertType<{ k1: { i1: string; i2: string; i3: number }; k2: number; k3: number }>(
  fu.mergeObject({ k1: { i1: "foo", i3: { j1: 0 } }, k2: 2 }, { k1: { i2: "bar", i3: 2 }, k3: 3 }),
);
assertType<{ k1: { i2: string; i3: number }; k2: number; k3: number }>(
  fu.mergeObject(
    { k1: { i1: "foo", i3: { j1: 0 } }, k2: 2 },
    { k1: { i2: "bar", i3: 2 }, k3: 3 },
    { recursive: false },
  ),
);
expectTypeOf(
  fu.mergeObject({ k1: { i1: "foo", i3: { j1: 0 } }, k2: 2 }, { k1: { i2: "bar", i3: 2 }, k3: 3 }, { recursive: false })
    .k1,
).toEqualTypeOf<{ i2: string; i3: number }>();
assertType<{
  k1: { i1: string; i2: string; i3: { j1: string; j2: number; j3: string } };
  k2: number;
  k3: number;
}>(
  fu.mergeObject(
    { k1: { i1: "foo", i3: { j1: 1, j2: 2 } }, k2: 2 },
    { k1: { i2: "bar", i3: { j1: "1", j3: "3" } }, k3: 3 },
  ),
);
assertType<{ k1: { i1: string; i3: { j1: string; j2: number } }; k2: number; k3: number }>(
  fu.mergeObject(
    { k1: { i1: "foo", i3: { j1: 1, j2: 2 } }, k2: 2 },
    { k1: { i2: "bar", i3: { j1: "1", j3: "3" } }, k3: 3 },
    { insertValues: false },
  ),
);
assertType<{ k1: { i2: string; i3: { j1: string; j3: string } }; k2: number; k3: number }>(
  fu.mergeObject(
    { k1: { i1: "foo", i3: { j1: 1, j2: 2 } }, k2: 2 },
    { k1: { i2: "bar", i3: { j1: "1", j3: "3" } }, k3: 3 },
    { recursive: false },
  ),
);

// Array merging

assertType<FormApplication.Options>(
  fu.mergeObject(FormApplication.defaultOptions, {
    classes: ["my", "custom", "css"],
  }),
);
assertType<{ a: number[] }>(fu.mergeObject({ a: ["foo"] }, { a: [0] }));
assertType<{ a: number[] }>(fu.mergeObject({ a: ["foo"] }, { a: [0] }, { insertKeys: true }));
assertType<{ a: number[] }>(fu.mergeObject({ a: ["foo"] }, { a: [0] }, { insertValues: true }));
assertType<{ a: number[] }>(fu.mergeObject({ a: ["foo"] }, { a: [0] }, { insertKeys: false }));
assertType<{ a: number[] }>(fu.mergeObject({ a: ["foo"] }, { a: [0] }, { insertValues: false }));
assertType<{ a: number[] }>(fu.mergeObject({ a: ["foo"] }, { a: [0] }, { enforceTypes: true }));
assertType<never>(fu.mergeObject({ a: ["foo"] }, { a: { b: "foo" } }, { enforceTypes: true }));
assertType<{ a: { b: string } }>(fu.mergeObject({ a: ["foo"] }, { a: { b: "foo" } }, { enforceTypes: false }));
assertType<never>(fu.mergeObject({ a: { b: "foo" } }, { a: ["foo"] }, { enforceTypes: true }));
assertType<{ a: string[] }>(fu.mergeObject({ a: { b: "foo" } }, { a: ["foo"] }, { enforceTypes: false }));

// performDeletions
// v10, `-=` prefixed keys are no longer auto removed
assertType<{ k1: string; k2: string; "-=k1": null }>(fu.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }));
assertType<{ k1: string; k2: string; "-=k1": null }>(
  fu.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }, { performDeletions: false }),
);
assertType<{ k2: string; "-=k1": null }>(fu.mergeObject({ k2: "v2" }, { "-=k1": null }));
assertType<{ k1: string; k2: string; "-=k1": null }>(fu.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }));

assertType<{ k2: string }>(fu.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }, { performDeletions: true }));

assertType<{ k1: string; k2: string; "-=k1": null }>(
  // @ts-expect-error deletions are performed so `-=k1` shouldn't be kept.
  fu.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }, { performDeletions: true }),
);

assertType<{ k2: string; "-=k1": null }>(
  // @ts-expect-error deletions are performed so `-=k1` shouldn't be kept.
  fu.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }, { performDeletions: true }),
);

assertType<{ k1: string; k2: string }>(
  // @ts-expect-error deletions are performed so `k1` should be gone.
  fu.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }, { performDeletions: true }),
);

assertType<{ k2: string }>(fu.mergeObject({ k2: "v2" }, { "-=k1": null }, { insertKeys: false }));

assertType<{ k2: string; "-=k1": null }>(
  // @ts-expect-error new keys won't be inserted
  fu.mergeObject({ k2: "v2" }, { "-=k1": null }, { insertKeys: false }),
);

assertType<{ wrapper: { k2: string } }>(
  fu.mergeObject(
    { wrapper: { k1: "v1", k2: "v2" } },
    { wrapper: { "-=k1": null } },
    { recursive: true, performDeletions: true },
  ),
);
assertType<{ wrapper: { k1: string; k2: string; "-=k1": null } }>(
  fu.mergeObject({ wrapper: { k1: "v1", k2: "v2" } }, { wrapper: { "-=k1": null } }, { recursive: true }),
);

// bonus round
assertType<{ a: number; b: number }>(fu.mergeObject({ a: 1 }, { b: 2 }, { enforceTypes: true }));

// @ts-expect-error these objects should be mergeable and not never
assertType<never>(fu.mergeObject({ a: 1 }, { b: 2 }, { enforceTypes: true }));

assertType<{ a: { a: number; b: number } }>(fu.mergeObject({ a: { a: 1 } }, { a: { b: 2 } }, { enforceTypes: true }));

// @ts-expect-error these objects should be mergeable and not never
assertType<never>(fu.mergeObject({ a: { a: 1 } }, { b: { a: 2 } }, { enforceTypes: true }));

assertType<{ a: { a: number }; b: { a: number }; c: number }>(
  fu.mergeObject({ a: { a: 1 }, c: 1 }, { b: { a: 2 }, c: 1 }, { enforceTypes: true }),
);

assertType<never>(
  // @ts-expect-error these objects should be mergeable and not never
  fu.mergeObject({ a: { a: 1 }, c: 1 }, { b: { a: 2 }, c: 1 }, { enforceTypes: true }),
);

// @ts-expect-error - A number isn't a valid object to merge.
fu.mergeObject(1, 2);

// @ts-expect-error - A string isn't a valid object to merge.
fu.mergeObject("foo", "bar");

// parseS3URL

expectTypeOf(fu.parseS3URL("s3://someBucket/key")).toEqualTypeOf<{ bucket: string | null; keyPrefix: string }>();

// randomID

expectTypeOf(fu.randomID(16)).toEqualTypeOf<string>();
expectTypeOf(fu.randomID()).toEqualTypeOf<string>();

// timeSince

expectTypeOf(fu.timeSince(new Date())).toEqualTypeOf<string>();
expectTypeOf(fu.timeSince("")).toEqualTypeOf<string>();

// formatFileSize

expectTypeOf(fu.formatFileSize(4)).toEqualTypeOf<string>();
expectTypeOf(fu.formatFileSize(4, {})).toEqualTypeOf<string>();
expectTypeOf(fu.formatFileSize(4, { base: 2, decimalPlaces: 7 })).toEqualTypeOf<string>();
expectTypeOf(fu.formatFileSize(4, { base: undefined, decimalPlaces: undefined }));

// @ts-expect-error: base must be 2 or 10
expectTypeOf(fu.formatFileSize(4, { base: 6 })).toEqualTypeOf<string>();

// parseUuid

declare const someActor: Actor.Implementation;
expectTypeOf(fu.parseUuid("Compendium.Actor.AAAAASomeIDAAAAA")).toEqualTypeOf<fu.ResolvedUUID>();
expectTypeOf(fu.parseUuid("Compendium.Actor.AAAAASomeIDAAAAA", {})).toEqualTypeOf<fu.ResolvedUUID>();
expectTypeOf(
  fu.parseUuid("Compendium.Actor.AAAAASomeIDAAAAA", { relative: undefined }),
).toEqualTypeOf<fu.ResolvedUUID>();
expectTypeOf(fu.parseUuid(".Item.IIIIISomeIDIIIII", { relative: someActor })).toEqualTypeOf<fu.ResolvedUUID>();

// escapeHTML

expectTypeOf(fu.escapeHTML(`foo < some string > some 'other string' & some "third string"`)).toBeString();

// unescapeHTML

expectTypeOf(
  fu.unescapeHTML(`foo &lt; some string &gt; some &#x27;other string&#x27; &amp; some &quot;third string&quot;`),
).toBeString();
