import { expectTypeOf } from "vitest";
import type { AnyObject } from "fvtt-types/utils";

expectTypeOf(foundry.utils.saveDataToFile("", "", "")).toEqualTypeOf<void>();

declare const file: File;
expectTypeOf(foundry.utils.readTextFromFile(file)).toEqualTypeOf<Promise<string>>();

expectTypeOf(getDocumentClass("Actor")).toEqualTypeOf<Actor.ImplementationClass | undefined>();
expectTypeOf(getDocumentClass("Item")).toEqualTypeOf<Item.ImplementationClass | undefined>();

expectTypeOf(fromUuid("Actor.uuid1")).toEqualTypeOf<Promise<Actor.Implementation | null>>;
expectTypeOf(fromUuid("Actor.uuid1.Item.uuid2")).toEqualTypeOf<Promise<Item.Implementation | null>>;

// This is actually incorrect but can't be easily fixed.
// The issue is that as soon as a generic parameter is provided all other generic parameters use their
// defaults and stop inferring. This means that `Uuid` is `string` and not validateable.
expectTypeOf(fromUuid<Actor.Implementation>("Actor.uuid1.Item.uuid2")).toEqualTypeOf<
  Promise<Actor.Implementation | null>
>;

// @ts-expect-error - This is an invalid Uuid.
fromUuid("invalid");

// @ts-expect-error - The error emitted here is subpar. Would benefit from throw types.
// However the usual strategy of returning a union of possible uuids isn't possible here because
// `Item.${string}` would erroneously allow it as a 'valid' uuid.
fromUuid("Item.uuid1.Abc.uuid2");

expectTypeOf(fromUuidSync("Actor.uuid1")).toEqualTypeOf<Actor.Implementation | AnyObject | null>;
expectTypeOf(fromUuidSync("Actor.uuid1.Item.uuid2")).toEqualTypeOf<Item.Implementation | AnyObject | null>;

// @ts-expect-error - This is an invalid Uuid.
fromUuidSync("invalid");

// @ts-expect-error - The error emitted here is subpar. Would benefit from throw types.
fromUuidSync("Item.uuid1.Abc.uuid2");

interface SortingStructure {
  target: number;
  update: {
    sortKey: number;
  };
}

declare const input: SortingStructure;
expectTypeOf(foundry.utils.performIntegerSort(input, {})).toEqualTypeOf<
  Array<{ target: SortingStructure; update: { sort: number } }>
>();
