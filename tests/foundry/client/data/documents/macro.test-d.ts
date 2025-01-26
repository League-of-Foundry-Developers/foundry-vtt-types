import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

// @ts-expect-error data is required
new Macro();
// @ts-expect-error name is required
new Macro({});

const myMacro = new Macro({ name: "my macro", scope: "global", type: "script" });

// properties and functions added by the concrete `Macro` class
expectTypeOf(myMacro.execute()).toEqualTypeOf<void | Promise<unknown>>();
if (myMacro.type === "script") {
  expectTypeOf(myMacro.type).toEqualTypeOf<"script">();
  expectTypeOf(myMacro.isAuthor).toEqualTypeOf<boolean>();
  expectTypeOf(myMacro.canExecute).toEqualTypeOf<boolean>();
  expectTypeOf(myMacro.thumbnail).toEqualTypeOf<string | null>();
  expectTypeOf(await myMacro.execute({ effect: new ActiveEffect() })).toEqualTypeOf<unknown>();
  expectTypeOf(
    await myMacro.execute({ effect: new ActiveEffect(), actor: new Actor({ name: "foo", type: "base" }) }),
  ).toEqualTypeOf<unknown>();

  // @ts-expect-error The actor property must be an actual Actor
  expectTypeOf(await myMacro.execute({ actor: new ActiveEffect() })).toEqualTypeOf<unknown>();
  expectTypeOf(
    // @ts-expect-error The actor property must be an actual Actor
    await myMacro.execute({ actor: new ActiveEffect(), effect: new ActiveEffect() }),
  ).toEqualTypeOf<unknown>();
}
if (myMacro.type === "chat") {
  expectTypeOf(myMacro.type).toEqualTypeOf<"chat">();
  // Unable to successfully narrow the type here, *should* be void
  expectTypeOf(myMacro.execute()).toEqualTypeOf<void | Promise<unknown>>();
}

// properties and functions of `ClientDocumentMixin`
expectTypeOf(myMacro.apps).toEqualTypeOf<
  Record<string, Application.Any | foundry.applications.api.ApplicationV2.Any>
>();
expectTypeOf(myMacro.collection).toEqualTypeOf<Collection<Macro>>();
expectTypeOf(myMacro.folder).toEqualTypeOf<Folder | null>();
expectTypeOf(myMacro.isOwner).toEqualTypeOf<boolean>();

// static properties and functions of `ClientDocumentMixin`
expectTypeOf(Macro.createDialog()).toEqualTypeOf<Promise<Macro | null | undefined>>();

// properties of `Document`
expectTypeOf(myMacro.parent).toEqualTypeOf<null>();
expectTypeOf(myMacro.pack).toEqualTypeOf<string | null>();

// static properties of `Document`
expectTypeOf(Macro.create({ name: "Some Macro" })).toEqualTypeOf<Promise<Macro.Stored | undefined>>();
expectTypeOf(Macro.createDocuments([])).toEqualTypeOf<Promise<Macro.Stored[] | undefined>>();
expectTypeOf(Macro.updateDocuments([])).toEqualTypeOf<Promise<Macro[]>>();
expectTypeOf(Macro.deleteDocuments([])).toEqualTypeOf<Promise<Macro[]>>();
