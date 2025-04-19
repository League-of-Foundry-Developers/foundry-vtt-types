import { expectTypeOf } from "vitest";

// @ts-expect-error data is required
new Macro.implementation();

// @ts-expect-error name is required
new Macro.implementation({});

const myMacro = new Macro.implementation({ name: "my macro", scope: "global", type: "script" });

// properties and functions added by the concrete `Macro` class
expectTypeOf(myMacro.execute()).toEqualTypeOf<void | Promise<unknown>>();
if (myMacro.type === "script") {
  expectTypeOf(myMacro.type).toEqualTypeOf<"script">();
  expectTypeOf(myMacro.isAuthor).toEqualTypeOf<boolean>();
  expectTypeOf(myMacro.canExecute).toEqualTypeOf<boolean>();
  expectTypeOf(myMacro.thumbnail).toEqualTypeOf<string | null>();
  expectTypeOf(await myMacro.execute({ effect: new ActiveEffect.implementation() })).toEqualTypeOf<unknown>();
  expectTypeOf(
    await myMacro.execute({
      effect: new ActiveEffect.implementation(),
      actor: new Actor.implementation({ name: "foo", type: "base" }),
    }),
  ).toEqualTypeOf<unknown>();

  // @ts-expect-error The actor property must be an actual Actor
  expectTypeOf(await myMacro.execute({ actor: new ActiveEffect.implementation() })).toEqualTypeOf<unknown>();
  expectTypeOf(
    // @ts-expect-error The actor property must be an actual Actor
    await myMacro.execute({ actor: new ActiveEffect.implementation(), effect: new ActiveEffect.implementation() }),
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
expectTypeOf(myMacro.collection).toEqualTypeOf<Collection<Macro.Implementation>>();
expectTypeOf(myMacro.folder).toEqualTypeOf<Folder.Implementation | null>();
expectTypeOf(myMacro.isOwner).toEqualTypeOf<boolean>();

// static properties and functions of `ClientDocumentMixin`
expectTypeOf(Macro.createDialog()).toEqualTypeOf<Promise<Macro.Implementation | null | undefined>>();

// properties of `Document`
expectTypeOf(myMacro.parent).toEqualTypeOf<null>();
expectTypeOf(myMacro.pack).toEqualTypeOf<string | null>();

// static properties of `Document`
expectTypeOf(Macro.create({ name: "Some Macro" })).toEqualTypeOf<Promise<Macro.Stored | undefined>>();
expectTypeOf(Macro.createDocuments([])).toEqualTypeOf<Promise<Macro.Stored[] | undefined>>();
expectTypeOf(Macro.updateDocuments([])).toEqualTypeOf<Promise<Macro.Implementation[]>>();
expectTypeOf(Macro.deleteDocuments([])).toEqualTypeOf<Promise<Macro.Implementation[]>>();
