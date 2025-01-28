import { expectTypeOf } from "vitest";
import type { AnyObject } from "fvtt-types/utils";

expectTypeOf(saveDataToFile("", "", "")).toEqualTypeOf<void>();

declare const file: File;
expectTypeOf(readTextFromFile(file)).toEqualTypeOf<Promise<string>>();

declare const actor: Actor;
expectTypeOf(_resolveEmbedded(actor, [])).toEqualTypeOf<foundry.abstract.Document.Any>();
expectTypeOf(getDocumentClass("Actor")).toEqualTypeOf<Actor.ConfiguredClass>();
expectTypeOf(getDocumentClass("Item")).toEqualTypeOf<Item.ConfiguredClass>();

expectTypeOf(fromUuid("Actor.uuid1")).toEqualTypeOf<Promise<Actor | null>>;
expectTypeOf(fromUuid("Actor.uuid1.Item.uuid2")).toEqualTypeOf<Promise<Item | null>>;

// This is actually incorrect but can't be easily fixed.
// The issue is that as soon as a generic parameter is provided all other generic parameters use their
// defaults and stop inferring. This means that `Uuid` is `string` and not validateable.
expectTypeOf(fromUuid<Actor>("Actor.uuid1.Item.uuid2")).toEqualTypeOf<Promise<Actor | null>>;

// @ts-expect-error - This is an invalid Uuid.
fromUuid("invalid");

// @ts-expect-error - The error emitted here is subpar. Would benefit from throw types.
// However the usual strategy of returning a union of possible uuids isn't possible here because
// `Item.${string}` would erroneously allow it as a 'valid' uuid.
fromUuid("Item.uuid1.Abc.uuid2");

expectTypeOf(fromUuidSync("Actor.uuid1")).toEqualTypeOf<Actor | AnyObject | null>;
expectTypeOf(fromUuidSync("Actor.uuid1.Item.uuid2")).toEqualTypeOf<Item | AnyObject | null>;

// @ts-expect-error - This is an invalid Uuid.
fromUuidSync("invalid");

// @ts-expect-error - The error emitted here is subpar. Would benefit from throw types.
fromUuidSync("Item.uuid1.Abc.uuid2");
