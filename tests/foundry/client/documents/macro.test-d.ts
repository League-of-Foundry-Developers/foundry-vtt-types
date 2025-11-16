import { expectTypeOf } from "vitest";

import Application = foundry.appv1.api.Application;

// @ts-expect-error data is required
new Macro.implementation();

// @ts-expect-error name is required
new Macro.implementation({});

const testEffect = new ActiveEffect.implementation({ name: "Test Effect" });

const anyMacro = new Macro.implementation<Macro.SubType>({ name: "my macro", scope: "global", type: "script" });
expectTypeOf(anyMacro.execute()).toEqualTypeOf<
  Promise<ChatMessage.Implementation | undefined | void> | Promise<unknown> | void
>();

const script = new Macro.implementation({ name: "my macro", scope: "global", type: "script" });

const chat = new Macro.implementation({ name: "my macro", scope: "global", type: "chat" });

// properties and functions added by the concrete `Macro` class
expectTypeOf(script.type).toEqualTypeOf<"script">();
expectTypeOf(script.isAuthor).toEqualTypeOf<boolean>();
expectTypeOf(script.canExecute).toEqualTypeOf<boolean>();
expectTypeOf(script.thumbnail).toEqualTypeOf<string | null>();
expectTypeOf(await script.execute({ effect: testEffect })).toEqualTypeOf<unknown>();
expectTypeOf(
  await script.execute({
    effect: testEffect,
    actor: new Actor.implementation({ name: "foo", type: "base" }),
  }),
).toEqualTypeOf<unknown>();

// @ts-expect-error The actor property must be an actual Actor
expectTypeOf(await script.execute({ actor: testEffect })).toEqualTypeOf<unknown>();
expectTypeOf(
  // @ts-expect-error The actor property must be an actual Actor
  await script.execute({ actor: testEffect, effect: testEffect }),
).toEqualTypeOf<unknown>();

expectTypeOf(chat.type).toEqualTypeOf<"chat">();
// @ts-expect-error Unable to successfully narrow the type here, *should* be `void | Promise<unknown>`
expectTypeOf(chat.execute()).toEqualTypeOf<void | Promise<unknown>>();

// properties and functions of `ClientDocumentMixin`
expectTypeOf(script.apps).toEqualTypeOf<Record<string, Application.Any | foundry.applications.api.ApplicationV2.Any>>();
expectTypeOf(script.collection).toEqualTypeOf<Collection<Macro.Stored> | null>();
expectTypeOf(script.folder).toEqualTypeOf<Folder.Stored | null>();
expectTypeOf(script.isOwner).toEqualTypeOf<boolean>();

// static properties and functions of `ClientDocumentMixin`
expectTypeOf(Macro.createDialog()).toEqualTypeOf<Promise<Macro.Stored | null | undefined>>();

// properties of `Document`
expectTypeOf(script.parent).toEqualTypeOf<null>();
expectTypeOf(script.pack).toEqualTypeOf<string | null>();

// static properties of `Document`
expectTypeOf(Macro.create({ name: "Some Macro" })).toEqualTypeOf<Promise<Macro.Stored | undefined>>();
expectTypeOf(Macro.createDocuments([])).toEqualTypeOf<Promise<Macro.Stored[]>>();
expectTypeOf(Macro.updateDocuments([])).toEqualTypeOf<Promise<Macro.Implementation[]>>();
expectTypeOf(Macro.deleteDocuments([])).toEqualTypeOf<Promise<Macro.Implementation[]>>();
