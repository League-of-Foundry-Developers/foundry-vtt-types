import { expectTypeOf, assertType } from "vitest";
import type { AnyConstructor, AnyFunction, NonNullish } from "fvtt-types/utils";

declare function functionWithoutParameters(): void;
declare function functionWithParameters(a: number, b: string, c?: boolean): void;
declare function functionWithReturnTypeOtherThanVoid(): number;

// benchmark

expectTypeOf(foundry.utils.benchmark(functionWithoutParameters, 42)).toEqualTypeOf<Promise<void>>();

// @ts-expect-error - the function takes no arguments
foundry.utils.benchmark(functionWithoutParameters, 42, "unknown argument");

expectTypeOf(foundry.utils.benchmark(functionWithParameters, 42, 1, "", false)).toEqualTypeOf<Promise<void>>();
expectTypeOf(foundry.utils.benchmark(functionWithParameters, 42, 1, "")).toEqualTypeOf<Promise<void>>();

// @ts-expect-error - the function takes a number and a string
foundry.utils.benchmark(functionWithParameters, 42, 1);

// @ts-expect-error - the function takes doesn't take three arguments
foundry.utils.benchmark(functionWithParameters, 42, 1, "", "unknown argument");

expectTypeOf(foundry.utils.benchmark(functionWithReturnTypeOtherThanVoid, 42)).toEqualTypeOf<Promise<void>>();

// threadLock
expectTypeOf(foundry.utils.threadLock(42)).toEqualTypeOf<Promise<void>>();

// debounce
expectTypeOf(foundry.utils.debounce(functionWithoutParameters, 500)).toEqualTypeOf<() => void>();
expectTypeOf(foundry.utils.debounce(functionWithParameters, 500)).toEqualTypeOf<
  (a: number, b: string, c?: boolean) => void
>();

// throttle
expectTypeOf(foundry.utils.throttle(functionWithoutParameters, 500)).toEqualTypeOf<() => void>();
expectTypeOf(foundry.utils.throttle(functionWithParameters, 500)).toEqualTypeOf<
  (a: number, b: string, c?: boolean) => void
>();
expectTypeOf(foundry.utils.throttle(() => {}, 1)).toBeFunction();

expectTypeOf(
  foundry.utils.throttle((a: number) => {
    console.log(a);
  }, 1),
).toMatchTypeOf<(a: number) => void>();

expectTypeOf(
  foundry.utils.throttle((a: number, b: string) => {
    console.log(a, b);
  }, 1),
).toMatchTypeOf<(a: number, b: string) => void>();

expectTypeOf(
  foundry.utils.throttle((a: number, b: string, c: boolean) => {
    console.log(a, b, c);
  }, 1),
).toMatchTypeOf<(a: number, b: string, c: boolean) => void>();

expectTypeOf(
  foundry.utils.throttle((a: number, b: string, c: boolean, d: symbol) => {
    console.log(a, b, c, d);
  }, 1),
).toMatchTypeOf<(a: number, b: string, c: boolean, d: symbol) => void>();

expectTypeOf(
  foundry.utils.throttle((a: number, b: string, c: boolean, d: symbol, e: bigint) => {
    console.log(a, b, c, d, e);
  }, 1),
).toMatchTypeOf<(a: number, b: string, c: boolean, d: symbol, e: bigint) => void>();

// debouncedReoload
expectTypeOf(foundry.utils.debouncedReload).toEqualTypeOf<() => void>();

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

expectTypeOf(foundry.utils.deepClone("abc" as string)).toEqualTypeOf<string>();
expectTypeOf(foundry.utils.deepClone("abc" as const)).toEqualTypeOf<"abc">();
expectTypeOf(foundry.utils.deepClone(1 as number)).toEqualTypeOf<number>();
expectTypeOf(foundry.utils.deepClone(1 as const)).toEqualTypeOf<1>();
expectTypeOf(foundry.utils.deepClone(1n as bigint)).toEqualTypeOf<bigint>();
expectTypeOf(foundry.utils.deepClone(1n as const)).toEqualTypeOf<1n>();
expectTypeOf(foundry.utils.deepClone(true as const)).toEqualTypeOf<true>();
expectTypeOf(foundry.utils.deepClone(true as boolean)).toEqualTypeOf<boolean>();
expectTypeOf(foundry.utils.deepClone(Symbol("customSymbol"))).toEqualTypeOf<symbol>();
expectTypeOf(foundry.utils.deepClone(undefined)).toEqualTypeOf<undefined>();
expectTypeOf(foundry.utils.deepClone(null)).toEqualTypeOf<null>();
expectTypeOf(foundry.utils.deepClone(["a", "b"])).toEqualTypeOf<Array<string>>();
expectTypeOf(foundry.utils.deepClone(["a", "b"])).toEqualTypeOf<Array<string>>();
expectTypeOf(foundry.utils.deepClone({ a: "foo", b: 42 })).toEqualTypeOf<{ a: string; b: number }>();
expectTypeOf(foundry.utils.deepClone(new Date())).toEqualTypeOf<Date>();
expectTypeOf(foundry.utils.deepClone(complexObject)).toEqualTypeOf<typeof complexObject>();

expectTypeOf(foundry.utils.deepClone("abc" as string, { strict: false })).toEqualTypeOf<string>();
expectTypeOf(foundry.utils.deepClone("abc" as string, { strict: true })).toEqualTypeOf<string>();
expectTypeOf(foundry.utils.deepClone("abc" as string, { strict: true as boolean })).toEqualTypeOf<string>();

// diffObject

expectTypeOf(foundry.utils.diffObject({ a: 1 }, { a: 1 })).toEqualTypeOf<object>();
expectTypeOf(foundry.utils.diffObject({ a: 1 }, { a: 7, b: 2 })).toEqualTypeOf<object>();

// objectsEqual

expectTypeOf(foundry.utils.objectsEqual({ a: 1 }, { a: 1 })).toEqualTypeOf<boolean>();

// duplicate

expectTypeOf(foundry.utils.duplicate("")).toEqualTypeOf<string>();

expectTypeOf(foundry.utils.duplicate(0)).toEqualTypeOf<number>();

expectTypeOf(foundry.utils.duplicate<0 | 1>(0)).toEqualTypeOf<0 | 1>();

expectTypeOf(foundry.utils.duplicate<"foo" | "bar">("foo")).toEqualTypeOf<"foo" | "bar">();

expectTypeOf(foundry.utils.duplicate<number>(0)).toEqualTypeOf<number>();

/* `NaN` will actually be converted to `null` but for ease of use, this is ignored. */
expectTypeOf(foundry.utils.duplicate<number>(NaN)).toEqualTypeOf<number>();

expectTypeOf(foundry.utils.duplicate(((): boolean => false)())).toEqualTypeOf<boolean>();

expectTypeOf(foundry.utils.duplicate(null)).toEqualTypeOf<null>();

expectTypeOf(foundry.utils.duplicate(undefined)).toEqualTypeOf<never>();

expectTypeOf(foundry.utils.duplicate(() => 0)).toEqualTypeOf<never>();

expectTypeOf(foundry.utils.duplicate(Symbol(""))).toEqualTypeOf<never>();

expectTypeOf(foundry.utils.duplicate(false as const)).toEqualTypeOf<false>();

expectTypeOf(foundry.utils.duplicate(((): string | boolean => "")())).toEqualTypeOf<string | boolean>();

expectTypeOf(foundry.utils.duplicate(((): string | number => "")())).toEqualTypeOf<string | number>();

expectTypeOf(foundry.utils.duplicate(((): string | null => "")())).toEqualTypeOf<string | null>();

expectTypeOf(foundry.utils.duplicate(((): string | undefined => "")())).toEqualTypeOf<string>();

expectTypeOf(foundry.utils.duplicate(((): string | AnyFunction => "")())).toEqualTypeOf<string>();

expectTypeOf(foundry.utils.duplicate(((): string | symbol => "")())).toEqualTypeOf<string>();

expectTypeOf(foundry.utils.duplicate([""])).toEqualTypeOf<Array<string>>();

expectTypeOf(foundry.utils.duplicate([0])).toEqualTypeOf<Array<number>>();

expectTypeOf(foundry.utils.duplicate([false, true])).toEqualTypeOf<Array<boolean>>();

expectTypeOf(foundry.utils.duplicate([null])).toEqualTypeOf<Array<null>>();

expectTypeOf(foundry.utils.duplicate([undefined])).toEqualTypeOf<Array<null>>();

expectTypeOf(foundry.utils.duplicate([() => 0])).toEqualTypeOf<Array<null>>();

expectTypeOf(foundry.utils.duplicate([Symbol("")])).toEqualTypeOf<Array<null>>();

expectTypeOf(foundry.utils.duplicate([false as const])).toEqualTypeOf<Array<false>>();

expectTypeOf(foundry.utils.duplicate(["", false, true])).toEqualTypeOf<Array<string | boolean>>();

expectTypeOf(foundry.utils.duplicate(["", 0])).toEqualTypeOf<Array<string | number>>();

expectTypeOf(foundry.utils.duplicate(["", null])).toEqualTypeOf<Array<string | null>>();

expectTypeOf(foundry.utils.duplicate(["", undefined])).toEqualTypeOf<Array<string | null>>();

expectTypeOf(foundry.utils.duplicate(["", () => 0])).toEqualTypeOf<Array<string | null>>();

expectTypeOf(foundry.utils.duplicate(["", Symbol("")])).toEqualTypeOf<Array<string | null>>();

expectTypeOf(foundry.utils.duplicate([((): "a" | "b" => "a")()])).toEqualTypeOf<Array<"a" | "b">>();

expectTypeOf(foundry.utils.duplicate([[false, true]])).toEqualTypeOf<Array<Array<boolean>>>();

expectTypeOf(foundry.utils.duplicate([{ a: "" }])).toEqualTypeOf<Array<{ a: string }>>();

expectTypeOf(foundry.utils.duplicate({ a: "" })).toEqualTypeOf<{ a: string }>();

expectTypeOf(foundry.utils.duplicate({ a: 0 })).toEqualTypeOf<{ a: number }>();

expectTypeOf(foundry.utils.duplicate({ a: ((): boolean => false)() })).toEqualTypeOf<{ a: boolean }>();

expectTypeOf(foundry.utils.duplicate({ a: null })).toEqualTypeOf<{ a: null }>();

expectTypeOf(foundry.utils.duplicate({ a: undefined })).toEqualTypeOf<NonNullish>();

expectTypeOf(foundry.utils.duplicate({ a: () => 0 })).toEqualTypeOf<NonNullish>();

expectTypeOf(foundry.utils.duplicate({ a: Symbol("") })).toEqualTypeOf<NonNullish>();

expectTypeOf(foundry.utils.duplicate({ a: ((): string | boolean => "")() })).toEqualTypeOf<{ a: string | boolean }>();

expectTypeOf(foundry.utils.duplicate({ a: ((): string | number => "")() })).toEqualTypeOf<{ a: string | number }>();

expectTypeOf(foundry.utils.duplicate({ a: ((): string | null => "")() })).toEqualTypeOf<{ a: string | null }>();

expectTypeOf(foundry.utils.duplicate({ a: ((): string | undefined => "")() })).toEqualTypeOf<{
  a?: string | undefined;
}>();

expectTypeOf(foundry.utils.duplicate({ a: ((): string | AnyFunction => "")() })).toEqualTypeOf<{
  a?: string | undefined;
}>();

expectTypeOf(foundry.utils.duplicate({ a: ((): string | symbol => "")() })).toEqualTypeOf<{ a?: string | undefined }>();

expectTypeOf(foundry.utils.duplicate({ a: [""] })).toEqualTypeOf<{ a: Array<string> }>();

expectTypeOf(foundry.utils.duplicate({ a: { b: "" } })).toEqualTypeOf<{ a: { b: string } }>();

expectTypeOf(foundry.utils.duplicate({ a: false as const })).toEqualTypeOf<{ a: false }>();

expectTypeOf(foundry.utils.duplicate({ a: ((): "a" | "b" => "a")() })).toEqualTypeOf<{ a: "a" | "b" }>();

expectTypeOf(foundry.utils.duplicate({ a: 0, b: "", c: false, toJSON: (): string => "" })).toEqualTypeOf<string>();

expectTypeOf(
  foundry.utils.duplicate({ a: 0, b: "", c: false, toJSON: () => ({ foo: "", bar: ((): boolean => false)() }) }),
).toEqualTypeOf<{ foo: string; bar: boolean }>();

expectTypeOf(
  foundry.utils.duplicate({
    a: 0,
    b: "",
    c: false,
    toJSON: () => ({ foo: "", bar: ((): boolean => false)(), toJSON: () => "" }),
  }),
).toEqualTypeOf<{ foo: string; bar: boolean }>();

expectTypeOf(
  foundry.utils.duplicate({
    a: 0,
    b: "",
    c: false,
    toJSON: () => ({ foo: "", bar: { baz: "", toJSON: () => false } }),
  }),
).toEqualTypeOf<{ foo: string; bar: false }>();

expectTypeOf(foundry.utils.duplicate(complexObject)).toEqualTypeOf<
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

// isSubclass

declare class ClassWithNoConstructorParameters {}

declare class ClassWithConstructorParameters {
  constructor(a: number, b: string);
}

expectTypeOf(
  foundry.utils.isSubclass(ClassWithNoConstructorParameters, ClassWithConstructorParameters),
).toEqualTypeOf<boolean>();
expectTypeOf(
  foundry.utils.isSubclass(ClassWithConstructorParameters, ClassWithNoConstructorParameters),
).toEqualTypeOf<boolean>();

// getDefiningClass
expectTypeOf(foundry.utils.getDefiningClass(foundry.documents.BaseActor, "name")).toEqualTypeOf<AnyConstructor>();

// encodeURL
expectTypeOf(foundry.utils.encodeURL("")).toEqualTypeOf<string>();

// expandObject
expectTypeOf(foundry.utils.expandObject({})).toEqualTypeOf<object>();

// filterObject
expectTypeOf(foundry.utils.filterObject({}, {})).toEqualTypeOf<object>();

// flattenObject
expectTypeOf(foundry.utils.flattenObject({})).toEqualTypeOf<object>();

// getParentClasses
expectTypeOf(foundry.utils.getParentClasses(foundry.documents.BaseActor)).toEqualTypeOf<AnyConstructor[]>();

// getRoute
expectTypeOf(foundry.utils.getRoute("")).toEqualTypeOf<string>();

// getType
expectTypeOf(foundry.utils.getType("")).toEqualTypeOf<
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
>();

// hasProperty
expectTypeOf(foundry.utils.hasProperty({}, "")).toEqualTypeOf<boolean>();

// getProperty
expectTypeOf(foundry.utils.getProperty({}, "")).toEqualTypeOf<any>();

// setProperty
expectTypeOf(foundry.utils.setProperty({}, "", 4)).toEqualTypeOf<boolean>();

// invertObject
expectTypeOf(foundry.utils.invertObject({ a: 1, b: "foo" } as const)).toEqualTypeOf<{
  readonly 1: "a";
  readonly foo: "b";
}>();

// isNewerVersion
expectTypeOf(foundry.utils.isNewerVersion(4, "2.3")).toEqualTypeOf<boolean>();

// isEmpty
expectTypeOf(foundry.utils.isEmpty(4)).toEqualTypeOf<boolean>();

// mergeObject: assertType is used here because of https://github.com/SamVerschueren/tsd/issues/67
// mergeObject (1): tests from the docs
assertType<{ k1: string }>(foundry.utils.mergeObject({ k1: "v1" }, { k2: "v2" }, { insertKeys: false }));
assertType<{ k1: string; k2: string }>(foundry.utils.mergeObject({ k1: "v1" }, { k2: "v2" }, { insertKeys: true }));
assertType<{ k1: { i1: string } }>(
  foundry.utils.mergeObject({ k1: { i1: "v1" } }, { k1: { i2: "v2" } }, { insertValues: false }),
);
assertType<{ k1: { i1: string; i2: string } }>(
  foundry.utils.mergeObject({ k1: { i1: "v1" } }, { k1: { i2: "v2" } }, { insertValues: true }),
);

assertType<{ k1: string }>(foundry.utils.mergeObject({ k1: "v1" }, { k1: "v2" }, { overwrite: true }));
assertType<{ k1: string }>(foundry.utils.mergeObject({ k1: "v1" }, { k1: "v2" }, { overwrite: false }));

assertType<{ k1: { i2: string } }>(
  foundry.utils.mergeObject({ k1: { i1: "v1" } }, { k1: { i2: "v2" } }, { recursive: false }),
);
assertType<{ k1: { i1: string; i2: string } }>(
  foundry.utils.mergeObject({ k1: { i1: "v1" } }, { k1: { i2: "v2" } }, { recursive: true }),
);

// mergeObject (2): more simple tests

assertType<{ k1: string }>(foundry.utils.mergeObject({ k1: "" }, { k1: "" }));
assertType<{ k1: string }>(foundry.utils.mergeObject({ k1: "" }, { k1: "" }, {}));
assertType<{ k1: string }>(foundry.utils.mergeObject({ k1: "" }, { k1: "" }, { insertKeys: false }));
assertType<{ k1: string }>(foundry.utils.mergeObject({ k1: "" }, { k1: "" }, { insertKeys: true }));

assertType<{ k1: string; k2: string }>(foundry.utils.mergeObject({ k1: "" }, { k2: "" }));
assertType<{ k1: string; k2: string }>(foundry.utils.mergeObject({ k1: "" }, { k2: "" }, {}));
assertType<{ k1: string }>(foundry.utils.mergeObject({ k1: "" }, { k2: "" }, { insertKeys: false }));
assertType<{ k1: string; k2: string }>(foundry.utils.mergeObject({ k1: "" }, { k2: "" }, { insertKeys: true }));

assertType<{ k1: number; k2: string }>(foundry.utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }));
assertType<{ k1: number; k2: string }>(foundry.utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, {}));
assertType<{ k1: number }>(foundry.utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { insertKeys: false }));
assertType<{ k1: number; k2: string }>(foundry.utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { insertKeys: true }));

assertType<never>(foundry.utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { enforceTypes: true }));
assertType<{ k1: number; k2: string }>(
  foundry.utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { enforceTypes: false }),
);
assertType<never>(foundry.utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { enforceTypes: true, insertKeys: false }));
assertType<never>(foundry.utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { enforceTypes: true, insertKeys: true }));

assertType<{ k1: string; k2: string }>(foundry.utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { overwrite: false }));
assertType<{ k1: number; k2: string }>(foundry.utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { overwrite: true }));
assertType<{ k1: number; k2: string }>(foundry.utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, {}));
assertType<{ k1: string }>(
  foundry.utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { overwrite: false, insertKeys: false }),
);
assertType<{ k1: string; k2: string }>(
  foundry.utils.mergeObject({ k1: "" }, { k1: 2, k2: "" }, { overwrite: false, insertKeys: true }),
);

// mergeObject (3): more complex examples
assertType<{ k1: { i1: string; i2: string }; k2: number; k3: number }>(
  foundry.utils.mergeObject({ k1: { i1: "foo" }, k2: 2 }, { k1: { i2: "bar" }, k3: 3 }),
);
assertType<{ k1: { i1: string; i2: string; i3: number }; k2: number; k3: number }>(
  foundry.utils.mergeObject({ k1: { i1: "foo", i3: { j1: 0 } }, k2: 2 }, { k1: { i2: "bar", i3: 2 }, k3: 3 }),
);
assertType<{ k1: { i2: string; i3: number }; k2: number; k3: number }>(
  foundry.utils.mergeObject(
    { k1: { i1: "foo", i3: { j1: 0 } }, k2: 2 },
    { k1: { i2: "bar", i3: 2 }, k3: 3 },
    { recursive: false },
  ),
);
expectTypeOf(
  foundry.utils.mergeObject(
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
  foundry.utils.mergeObject(
    { k1: { i1: "foo", i3: { j1: 1, j2: 2 } }, k2: 2 },
    { k1: { i2: "bar", i3: { j1: "1", j3: "3" } }, k3: 3 },
  ),
);
assertType<{ k1: { i1: string; i3: { j1: string; j2: number } }; k2: number; k3: number }>(
  foundry.utils.mergeObject(
    { k1: { i1: "foo", i3: { j1: 1, j2: 2 } }, k2: 2 },
    { k1: { i2: "bar", i3: { j1: "1", j3: "3" } }, k3: 3 },
    { insertValues: false },
  ),
);
assertType<{ k1: { i2: string; i3: { j1: string; j3: string } }; k2: number; k3: number }>(
  foundry.utils.mergeObject(
    { k1: { i1: "foo", i3: { j1: 1, j2: 2 } }, k2: 2 },
    { k1: { i2: "bar", i3: { j1: "1", j3: "3" } }, k3: 3 },
    { recursive: false },
  ),
);

// Array merging

assertType<FormApplicationOptions>(
  foundry.utils.mergeObject(FormApplication.defaultOptions, {
    classes: ["my", "custom", "css"],
  }),
);
assertType<{ a: number[] }>(foundry.utils.mergeObject({ a: ["foo"] }, { a: [0] }));
assertType<{ a: number[] }>(foundry.utils.mergeObject({ a: ["foo"] }, { a: [0] }, { insertKeys: true }));
assertType<{ a: number[] }>(foundry.utils.mergeObject({ a: ["foo"] }, { a: [0] }, { insertValues: true }));
assertType<{ a: number[] }>(foundry.utils.mergeObject({ a: ["foo"] }, { a: [0] }, { insertKeys: false }));
assertType<{ a: number[] }>(foundry.utils.mergeObject({ a: ["foo"] }, { a: [0] }, { insertValues: false }));
assertType<{ a: number[] }>(foundry.utils.mergeObject({ a: ["foo"] }, { a: [0] }, { enforceTypes: true }));
assertType<never>(foundry.utils.mergeObject({ a: ["foo"] }, { a: { b: "foo" } }, { enforceTypes: true }));
assertType<{ a: { b: string } }>(
  foundry.utils.mergeObject({ a: ["foo"] }, { a: { b: "foo" } }, { enforceTypes: false }),
);
assertType<never>(foundry.utils.mergeObject({ a: { b: "foo" } }, { a: ["foo"] }, { enforceTypes: true }));
assertType<{ a: string[] }>(foundry.utils.mergeObject({ a: { b: "foo" } }, { a: ["foo"] }, { enforceTypes: false }));

// performDeletions
// v10, `-=` prefixed keys are no longer auto removed
assertType<{ k1: string; k2: string; "-=k1": null }>(
  foundry.utils.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }),
);
assertType<{ k1: string; k2: string; "-=k1": null }>(
  foundry.utils.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }, { performDeletions: false }),
);
assertType<{ k2: string; "-=k1": null }>(foundry.utils.mergeObject({ k2: "v2" }, { "-=k1": null }));
assertType<{ k1: string; k2: string; "-=k1": null }>(
  foundry.utils.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }),
);

assertType<{ k2: string }>(
  foundry.utils.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }, { performDeletions: true }),
);

assertType<{ k1: string; k2: string; "-=k1": null }>(
  // @ts-expect-error deletions are performed so `-=k1` shouldn't be kept.
  foundry.utils.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }, { performDeletions: true }),
);

assertType<{ k2: string; "-=k1": null }>(
  // @ts-expect-error deletions are performed so `-=k1` shouldn't be kept.
  foundry.utils.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }, { performDeletions: true }),
);

assertType<{ k1: string; k2: string }>(
  // @ts-expect-error deletions are performed so `k1` should be gone.
  foundry.utils.mergeObject({ k1: "v1", k2: "v2" }, { "-=k1": null }, { performDeletions: true }),
);

assertType<{ k2: string }>(foundry.utils.mergeObject({ k2: "v2" }, { "-=k1": null }, { insertKeys: false }));

assertType<{ k2: string; "-=k1": null }>(
  // @ts-expect-error new keys won't be inserted
  foundry.utils.mergeObject({ k2: "v2" }, { "-=k1": null }, { insertKeys: false }),
);

assertType<{ wrapper: { k2: string } }>(
  foundry.utils.mergeObject(
    { wrapper: { k1: "v1", k2: "v2" } },
    { wrapper: { "-=k1": null } },
    { recursive: true, performDeletions: true },
  ),
);
assertType<{ wrapper: { k1: string; k2: string; "-=k1": null } }>(
  foundry.utils.mergeObject({ wrapper: { k1: "v1", k2: "v2" } }, { wrapper: { "-=k1": null } }, { recursive: true }),
);

// bonus round
assertType<{ a: number; b: number }>(foundry.utils.mergeObject({ a: 1 }, { b: 2 }, { enforceTypes: true }));

// @ts-expect-error these objects should be mergeable and not never
assertType<never>(foundry.utils.mergeObject({ a: 1 }, { b: 2 }, { enforceTypes: true }));

assertType<{ a: { a: number; b: number } }>(
  foundry.utils.mergeObject({ a: { a: 1 } }, { a: { b: 2 } }, { enforceTypes: true }),
);

// @ts-expect-error these objects should be mergeable and not never
assertType<never>(foundry.utils.mergeObject({ a: { a: 1 } }, { b: { a: 2 } }, { enforceTypes: true }));

assertType<{ a: { a: number }; b: { a: number }; c: number }>(
  foundry.utils.mergeObject({ a: { a: 1 }, c: 1 }, { b: { a: 2 }, c: 1 }, { enforceTypes: true }),
);

assertType<never>(
  // @ts-expect-error these objects should be mergeable and not never
  foundry.utils.mergeObject({ a: { a: 1 }, c: 1 }, { b: { a: 2 }, c: 1 }, { enforceTypes: true }),
);

// @ts-expect-error - A number isn't a valid object to merge.
foundry.utils.mergeObject(1, 2);

// @ts-expect-error - A string isn't a valid object to merge.
foundry.utils.mergeObject("foo", "bar");

// parseS3URL
expectTypeOf(foundry.utils.parseS3URL("")).toEqualTypeOf<{ bucket: string | null; keyPrefix: string }>();

// randomID
expectTypeOf(foundry.utils.randomID(16)).toEqualTypeOf<string>();
expectTypeOf(foundry.utils.randomID()).toEqualTypeOf<string>();

// timeSince
expectTypeOf(foundry.utils.timeSince(new Date())).toEqualTypeOf<string>();
expectTypeOf(foundry.utils.timeSince("")).toEqualTypeOf<string>();

// formatFileSize
expectTypeOf(foundry.utils.formatFileSize(4, { base: 2 })).toEqualTypeOf<string>();
expectTypeOf(foundry.utils.formatFileSize(4)).toEqualTypeOf<string>();

// @ts-expect-error: base must be 2 or 10
expectTypeOf(foundry.utils.formatFileSize(4, { base: 6 })).toEqualTypeOf<string>();

// parseUuid
expectTypeOf(foundry.utils.parseUuid("", {})).toEqualTypeOf<foundry.utils.ResolvedUUID>();
expectTypeOf(foundry.utils.parseUuid("")).toEqualTypeOf<foundry.utils.ResolvedUUID>();
