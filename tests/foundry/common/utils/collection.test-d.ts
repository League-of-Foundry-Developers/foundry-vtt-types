import { describe, expectTypeOf, test } from "vitest";

// Collection is a blessed global and doesn't need to be imported

describe("Collection Tests", () => {
  type CollectionValue = string | true | 5 | null | { foo: number };

  function isString(e: CollectionValue): e is string {
    return typeof e === "string";
  }
  const falseOrUndefined: false | undefined = Math.random() > 0.5 ? false : undefined;
  const trueOrUndefined: true | undefined = Math.random() > 0.5 ? true : undefined;
  const boolOrUndefined: boolean | undefined = Math.random() > 0.66 ? true : Math.random() > 0.5 ? false : undefined;

  test("Construction", () => {
    expectTypeOf(new Collection()).toEqualTypeOf<Collection<unknown>>();
    expectTypeOf(new Collection([["foo", 7]])).toEqualTypeOf<Collection<number>>();

    // @ts-expect-error Collection won't infer a union value type (prettier-ignore because of tsc/tsgo incompatibilities if formatted multiline)
    // prettier-ignore
    new Collection([["foo", 7], ["bar", "fizz"]]);

    expectTypeOf(
      new Collection<string | number>([
        ["foo", 7],
        ["bar", "fizz"],
      ]),
    ).toEqualTypeOf<Collection<string | number>>();
  });

  const c = new Collection<CollectionValue>();

  test("Getting/Contents", () => {
    expectTypeOf(c.contents).toEqualTypeOf<CollectionValue[]>();

    expectTypeOf(c.get("key")).toEqualTypeOf<CollectionValue | undefined>();
    expectTypeOf(c.get("key", {})).toEqualTypeOf<CollectionValue | undefined>();
    expectTypeOf(c.get("key", { strict: false })).toEqualTypeOf<CollectionValue | undefined>();
    expectTypeOf(c.get("key", { strict: true })).toEqualTypeOf<CollectionValue>();
    expectTypeOf(c.get("key", { strict: boolOrUndefined })).toEqualTypeOf<CollectionValue | undefined>();
    expectTypeOf(c.get("key", { strict: trueOrUndefined })).toEqualTypeOf<CollectionValue | undefined>();
    expectTypeOf(c.get("key", { strict: falseOrUndefined })).toEqualTypeOf<CollectionValue | undefined>();

    // These would all be `undefined` at runtime because `CollectionValue` is never an object with a `name` property
    expectTypeOf(c.getName("name")).toEqualTypeOf<CollectionValue | undefined>();
    expectTypeOf(c.getName("name", {})).toEqualTypeOf<CollectionValue | undefined>();
    expectTypeOf(c.getName("name", { strict: false })).toEqualTypeOf<CollectionValue | undefined>();
    expectTypeOf(c.getName("name", { strict: true })).toEqualTypeOf<CollectionValue>();
  });

  test("Setting and Deleting", () => {
    // @ts-expect-error 4 is not in the CollectionValue union
    c.set("key", 4);
    expectTypeOf(c.set("key1", 5)).toEqualTypeOf<typeof c>();
    expectTypeOf(c.set("key2", { foo: 7 })).toEqualTypeOf<Collection<CollectionValue>>();
    expectTypeOf(c.set("key3", true)).toEqualTypeOf<Collection<CollectionValue>>();
    expectTypeOf(c.set("key4", null)).toEqualTypeOf<Collection<CollectionValue>>();

    expectTypeOf(c.delete("key")).toBeBoolean();
  });

  test("Searching", () => {
    expectTypeOf(c.filter(isString)).toEqualTypeOf<string[]>();
    expectTypeOf(
      c.filter((each, i, collection) => {
        expectTypeOf(i).toBeNumber();
        expectTypeOf(collection).toEqualTypeOf<typeof c>();
        return typeof each === "string";
      }),
    ).toEqualTypeOf<Array<string>>();

    expectTypeOf(c.find(isString)).toEqualTypeOf<string | undefined>();
    expectTypeOf(
      c.find((each, i, collection) => {
        expectTypeOf(i).toBeNumber();
        expectTypeOf(collection).toEqualTypeOf<typeof c>();
        return typeof each === "string";
      }),
    ).toEqualTypeOf<string | undefined>();

    const cn = new Collection<string | null>();
    expectTypeOf(cn.filter((each) => typeof each === "string")).toEqualTypeOf<Array<string>>();
    expectTypeOf(cn.find((each) => typeof each === "string")).toEqualTypeOf<string | undefined>();

    expectTypeOf(cn.filter(isString)).toEqualTypeOf<string[]>();
    expectTypeOf(cn.find(isString)).toEqualTypeOf<string | undefined>();
  });

  test("Iteration", () => {
    for (const el of c) {
      expectTypeOf(el).toEqualTypeOf<CollectionValue>();
    }

    expectTypeOf(
      c.forEach((e) => {
        expectTypeOf(e).toEqualTypeOf<CollectionValue>();
      }),
    ).toBeVoid();

    expectTypeOf(c.some((e) => !!e)).toBeBoolean();
  });

  test("Transforms", () => {
    expectTypeOf(
      c.map((e) => {
        if (!e) return "null";
        switch (typeof e) {
          case "number":
            return "5";
            break;
          case "object":
            return `${e.foo}`;
            break;
          case "boolean":
            return "true";
          case "string":
            return e;
        }
      }),
    ).toEqualTypeOf<string[]>();

    interface Reduced {
      fives?: number;
      strings?: number;
      objs?: number;
      bools?: number;
    }
    const initial: Reduced = {};

    expectTypeOf(
      c.reduce((acc, curr) => {
        if (!curr) return acc;
        switch (typeof curr) {
          case "number":
            acc.fives ??= 0;
            acc.fives++;
            break;
          case "object":
            acc.objs ??= 0;
            acc.objs++;
            break;
          case "boolean":
            acc.bools ??= 0;
            acc.bools++;
            break;
          case "string":
            acc.strings ??= 0;
            acc.strings++;
        }
        return acc;
      }, initial),
    ).toEqualTypeOf<Reduced>();
  });

  test("toJSON", () => {
    expectTypeOf(c.toJSON()).toEqualTypeOf<CollectionValue[]>();

    const itemCol = new Collection<Item.Implementation>();

    expectTypeOf(itemCol.toJSON()).toEqualTypeOf<ReturnType<Item.Implementation["toJSON"]>[]>();
    expectTypeOf(itemCol.toJSON()).toEqualTypeOf<Item.Implementation["_source"][]>();
    // @ts-expect-error This should pass but currently doesn't
    // TODO: part of document source type investigation
    expectTypeOf(itemCol.toJSON()).toEqualTypeOf<Item.Source[]>();

    const c2 = new Collection<{
      toJSON(): boolean;
    }>();

    expectTypeOf(c2.toJSON()).toEqualTypeOf<boolean[]>();
  });

  // This is a regression test for the error:
  //    Class '...' defines instance member property '...', but extended class '...' defines it as instance member function.
  // This occurred because of how `Map` was patched to allow the unsound subclassing of `Collection`.
  test("custom Collection Map overrides regression test", () => {
    class CustomCollection extends Collection<string> {
      override clear(): void {}
    }

    const customCollection = new CustomCollection();

    if (customCollection instanceof Map) {
      expectTypeOf(customCollection).toEqualTypeOf<CustomCollection>();
    }
  });

  test("Inherited from Map", () => {
    expectTypeOf(c.entries()).toEqualTypeOf<MapIterator<[string, CollectionValue]>>();
    expectTypeOf(c.keys()).toEqualTypeOf<MapIterator<string>>();
    expectTypeOf(c.values()).toEqualTypeOf<MapIterator<CollectionValue>>();
    expectTypeOf(c.has("key")).toBeBoolean();
    expectTypeOf(c.clear()).toBeVoid();
  });
});
