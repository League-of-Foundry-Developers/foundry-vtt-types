import { expectTypeOf } from "vitest";
import type { StoredDocument } from "../../../../../src/types/utils.d.mts";

const macro = new Macro({ name: "my macro", scope: "global", type: "script" });

// properties and functions added by the concrete `Macro` class
expectTypeOf(macro.isAuthor).toEqualTypeOf<boolean>();
expectTypeOf(await macro.execute({ effect: new ActiveEffect() })).toEqualTypeOf<unknown>();

// @ts-expect-error The actor property must be an actual Actor
expectTypeOf(await macro.execute({ actor: new ActiveEffect() })).toEqualTypeOf<unknown>();

// properties and functions of `ClientDocumentMixin`
expectTypeOf(macro.apps).toEqualTypeOf<Record<string, Application>>();
expectTypeOf(macro.collection).toEqualTypeOf<Collection<Macro>>();
expectTypeOf(macro.folder).toEqualTypeOf<Folder | null>();
expectTypeOf(macro.isOwner).toEqualTypeOf<boolean>();

// static properties and functions of `ClientDocumentMixin`
expectTypeOf(Macro.createDialog()).toEqualTypeOf<Promise<Macro | null | undefined>>();

// properties of `Document`
expectTypeOf(macro.parent).toEqualTypeOf<null>();
expectTypeOf(macro.pack).toEqualTypeOf<string | null>();

// static properties of `Document`
expectTypeOf(Macro.create({ name: "Some Macro" })).toEqualTypeOf<Promise<StoredDocument<Macro> | undefined>>();
expectTypeOf(Macro.createDocuments([])).toEqualTypeOf<Promise<StoredDocument<Macro>[]>>();
expectTypeOf(Macro.updateDocuments([])).toEqualTypeOf<Promise<Macro[]>>();
expectTypeOf(Macro.deleteDocuments([])).toEqualTypeOf<Promise<Macro[]>>();
