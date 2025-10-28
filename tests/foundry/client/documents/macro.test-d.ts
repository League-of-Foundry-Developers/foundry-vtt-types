import { expectTypeOf } from "vitest";

import Application = foundry.appv1.api.Application;

// @ts-expect-error data is required
new Macro.implementation();

// @ts-expect-error name is required
new Macro.implementation({});

const testEffect = new ActiveEffect.implementation({ name: "Test Effect" });

const myMacro = new Macro.implementation({ name: "my macro", scope: "global", type: "script" });

// properties and functions added by the concrete `Macro` class
expectTypeOf(myMacro.execute()).toEqualTypeOf<
  Promise<ChatMessage.Implementation | undefined | void> | Promise<unknown> | void
>();
if (myMacro.type === "script") {
  expectTypeOf(myMacro.type).toEqualTypeOf<"script">();
  expectTypeOf(myMacro.isAuthor).toEqualTypeOf<boolean>();
  expectTypeOf(myMacro.canExecute).toEqualTypeOf<boolean>();
  expectTypeOf(myMacro.thumbnail).toEqualTypeOf<string | null>();
  expectTypeOf(await myMacro.execute({ effect: testEffect })).toEqualTypeOf<unknown>();
  expectTypeOf(
    await myMacro.execute({
      effect: testEffect,
      actor: new Actor.implementation({ name: "foo", type: "base" }),
    }),
  ).toEqualTypeOf<unknown>();

  // @ts-expect-error The actor property must be an actual Actor
  expectTypeOf(await myMacro.execute({ actor: testEffect })).toEqualTypeOf<unknown>();
  expectTypeOf(
    // @ts-expect-error The actor property must be an actual Actor
    await myMacro.execute({ actor: testEffect, effect: testEffect }),
  ).toEqualTypeOf<unknown>();
}
if (myMacro.type === "chat") {
  expectTypeOf(myMacro.type).toEqualTypeOf<"chat">();
  // @ts-expect-error Unable to successfully narrow the type here, *should* be `void | Promies<unknown>`
  expectTypeOf(myMacro.execute()).toEqualTypeOf<void | Promise<unknown>>();
}

// properties and functions of `ClientDocumentMixin`
expectTypeOf(myMacro.apps).toEqualTypeOf<
  Record<string, Application.Any | foundry.applications.api.ApplicationV2.Any>
>();
expectTypeOf(myMacro.collection).toEqualTypeOf<Collection<Macro.Implementation> | null>();
expectTypeOf(myMacro.folder).toEqualTypeOf<Folder.Stored | null>();
expectTypeOf(myMacro.isOwner).toEqualTypeOf<boolean>();

// static properties and functions of `ClientDocumentMixin`
expectTypeOf(Macro.createDialog()).toEqualTypeOf<Promise<Macro.Stored | null | "ok">>();

// properties of `Document`
expectTypeOf(myMacro.parent).toEqualTypeOf<null>();
expectTypeOf(myMacro.pack).toEqualTypeOf<string | null>();

// static properties of `Document`
expectTypeOf(Macro.create({ name: "Some Macro" })).toEqualTypeOf<Promise<Macro.Stored | undefined>>();
expectTypeOf(Macro.createDocuments([])).toEqualTypeOf<Promise<Macro.Stored[]>>();
expectTypeOf(Macro.updateDocuments([])).toEqualTypeOf<Promise<Macro.Implementation[]>>();
expectTypeOf(Macro.deleteDocuments([])).toEqualTypeOf<Promise<Macro.Implementation[]>>();

expectTypeOf(await Macro.createDialog()).toEqualTypeOf<Macro.Stored | "ok" | null>();
expectTypeOf(await Macro.createDialog({})).toEqualTypeOf<Macro.Stored | "ok" | null>();
expectTypeOf(await Macro.createDialog({}, {}, { ok: { label: "YEP" } })).toEqualTypeOf<Macro.Stored | "ok" | null>();
expectTypeOf(await Macro.createDialog({}, { temporary: true })).toEqualTypeOf<Macro.Implementation | "ok" | null>();

expectTypeOf(await myMacro.deleteDialog()).toEqualTypeOf<Macro.Stored | null | false | "yes">();
expectTypeOf(await myMacro.deleteDialog({})).toEqualTypeOf<Macro.Stored | null | false | "yes">();

expectTypeOf(await myMacro.deleteDialog({ yes: { label: "KILL" } })).toEqualTypeOf<
  Macro.Stored | null | false | "yes"
>();
