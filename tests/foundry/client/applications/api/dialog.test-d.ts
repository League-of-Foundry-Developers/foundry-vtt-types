import { expectTypeOf } from "vitest";

// TODO(LukeAbby): This file is full of tests with unsightly type display. Cleaning this up would be nice.
// There's also a lot of `Config extends ...` going on here which means that excess property checks aren't being done.

import DialogV2 = foundry.applications.api.DialogV2;
import type { AnyObject, EmptyObject } from "fvtt-types/utils";

const numberCallback = async () => 5;

expectTypeOf(await DialogV2.confirm()).toEqualTypeOf<boolean | null>();
expectTypeOf(await DialogV2.confirm({})).toEqualTypeOf<boolean | null>();
expectTypeOf(await DialogV2.confirm({ yes: {} })).toEqualTypeOf<boolean | null>();
expectTypeOf(await DialogV2.confirm({ rejectClose: true })).toEqualTypeOf<boolean>();
expectTypeOf(await DialogV2.confirm({ rejectClose: false })).toEqualTypeOf<boolean | null>();
expectTypeOf(await DialogV2.confirm({ rejectClose: 3 > 2, window: {} })).toEqualTypeOf<boolean | null>();
expectTypeOf(
  await DialogV2.confirm({
    yes: {
      callback: numberCallback,
    },
  }),
).toEqualTypeOf<false | number | null>();

const distributivityTest = await DialogV2.confirm(
  Math.random() > 0.5 ? { yes: { callback: numberCallback } } : { window: {} },
);
expectTypeOf(distributivityTest).toEqualTypeOf<boolean | number | null>();

const okButton = {
  callback: numberCallback,
};

expectTypeOf(await DialogV2.prompt()).toEqualTypeOf<"ok" | null>();
expectTypeOf(
  await DialogV2.prompt({
    ok: okButton,
  }),
).toEqualTypeOf<number | null>();
expectTypeOf(
  await DialogV2.prompt({
    ok: okButton,
    rejectClose: true,
  }),
).toEqualTypeOf<number>();
expectTypeOf(
  await DialogV2.prompt({
    ok: okButton,
    rejectClose: false,
  }),
).toEqualTypeOf<number | null>();

// Testing close handling
declare const closeCallback: () => string;
expectTypeOf(
  await DialogV2.prompt({
    ok: okButton,
    rejectClose: false,
    close: closeCallback,
  }),
).toEqualTypeOf<number | string>();
expectTypeOf(
  await DialogV2.prompt({
    ok: okButton,
    rejectClose: true,
    close: closeCallback,
  }),
).toEqualTypeOf<number>();

expectTypeOf(
  await DialogV2.prompt({
    ok: okButton,
    buttons: [
      {
        label: "Foo",
        action: "foo",
        callback: async () => 3 > 2,
      },
      {
        label: "Bar",
        action: "bar",
        callback: async () => 3,
      },
    ],
  }),
).toEqualTypeOf<number | boolean | null>();

expectTypeOf(
  await DialogV2.prompt({
    ok: okButton,
    buttons: [
      {
        label: "Foo",
        action: "foo",
        callback: async () => 3,
      },
      {
        label: "Bar",
        action: "bar",
      },
    ],
  }),
).toEqualTypeOf<number | "bar" | null>();

// Without any content there is no form and therefore the default `new FormDataExtended(button.form).object` results in `EmptyObject`.
// Technically depends on the `_renderHTML` implementation but that's probably unrealistic to worry about.
expectTypeOf(
  await DialogV2.input({
    rejectClose: true,
  }),
).toEqualTypeOf<EmptyObject>();

type ChoiceFormData = { choice: "one" | "two" | "three" };

// There's no way beyond parsing HTML at the type level to infer the type.
// Therefore the caller is forced to provide the form data.
const choiceForm = `
  <label><input type="radio" name="choice" value="one" checked> Option 1</label>
  <label><input type="radio" name="choice" value="two"> Option 2</label>
  <label><input type="radio" name="choice" value="three"> Options 3</label>
` as DialogV2.Content<ChoiceFormData>;

expectTypeOf(
  await DialogV2.input({
    rejectClose: true,
    content: choiceForm,
  }),
).toEqualTypeOf<ChoiceFormData>();

expectTypeOf(
  await DialogV2.input({
    rejectClose: true,
    // If no additional hint for the type is provided then the best we can do is return `AnyObject`.
    content: "",
  }),
).toEqualTypeOf<AnyObject>();

expectTypeOf(
  await DialogV2.input({
    content: choiceForm,
    buttons: [
      {
        label: "Foo",
        action: "foo",
        callback: async () => 3 > 2,
      },
      {
        label: "Bar",
        action: "bar",
        callback: async () => 3,
      },
    ],
  }),
).toEqualTypeOf<ChoiceFormData | number | boolean | null>();

expectTypeOf(
  await DialogV2.input({
    content: choiceForm,
    buttons: [
      {
        label: "Foo",
        action: "foo",
      },
      {
        label: "Bar",
        action: "bar",
      },
    ],
  }),
).toEqualTypeOf<ChoiceFormData | "foo" | "bar" | null>();

expectTypeOf(
  await DialogV2.wait({
    buttons: [
      {
        label: "Foo",
        action: "foo",
      },
      {
        label: "Bar",
        action: "bar",
      },
    ],
    rejectClose: true,
  }),
).toEqualTypeOf<"foo" | "bar">();

expectTypeOf(
  await DialogV2.wait({
    buttons: [
      {
        label: "Foo",
        action: "foo",
        callback: async () => 3 > 2,
      },
      {
        label: "Bar",
        action: "bar",
      },
    ],
    rejectClose: true,
  }),
).toEqualTypeOf<boolean | "bar">();

expectTypeOf(
  await DialogV2.wait({
    buttons: [
      {
        label: "Foo",
        action: "foo",
        callback: async () => 3 > 2,
      },
      {
        label: "Bar",
        action: "bar",
      },
    ],
    rejectClose: false,
  }),
).toEqualTypeOf<boolean | "bar" | null>();

const userUUID = foundry.utils.randomID();

const queryReturnConfirm = await DialogV2.query(userUUID, "confirm", {
  yes: {
    label: "foo",
  },
});

expectTypeOf(queryReturnConfirm).toEqualTypeOf<boolean | null>();

const queryReturnWait = await DialogV2.query(userUUID, "wait", {
  buttons: [
    {
      action: "foo",
      label: "bar",
    },
  ],
});

expectTypeOf(queryReturnWait).toEqualTypeOf<"foo" | null>();

const queryReturnInput = await DialogV2.query(userUUID, "input", {
  content: choiceForm,
});

expectTypeOf(queryReturnInput).toEqualTypeOf<ChoiceFormData | null>();

declare const unhandledOptionalYes: { yes?: { callback: typeof numberCallback } };

expectTypeOf(await DialogV2.confirm(unhandledOptionalYes)).toEqualTypeOf<number | boolean | null>();

/*
 * Pathological inputs
 */

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
const unsoundTest: {} = { yes: { callback: numberCallback } };

// At runtime this will be `number`, however the provided type is `{}` which has no indication about the type.
expectTypeOf(await DialogV2.confirm(unsoundTest)).toEqualTypeOf<boolean | null>();

// Edge case: `config.ok.callback` is overriden, this makes it useless to use over `DialogV2.submit`
// but is a valid call.
expectTypeOf(
  await DialogV2.input({
    rejectClose: true,
    content: choiceForm,
    ok: {
      callback: () => 123,
    },
  }),
).toEqualTypeOf<number>();

// Overrides ok (pathological) and sets buttons
expectTypeOf(
  await DialogV2.input({
    content: choiceForm,
    ok: okButton,
    buttons: [
      {
        label: "Foo",
        action: "foo",
        callback: async () => 3 > 2,
      },
      {
        label: "Bar",
        action: "bar",
        callback: async () => 3,
      },
    ],
  }),
).toEqualTypeOf<number | boolean | null>();

// This input is pathological because for `"wait"` the options `{}` should not be allowed. So
// ideally this should error. However this would be pretty annoying to enforce and it's unlikely
// to actually be encountered by a real user.
await DialogV2.query(userUUID, Math.random() > 0.5 ? "wait" : "input", {});

/**
 * Internal tests
 */
expectTypeOf<
  DialogV2.Internal.ButtonReturnType<{
    buttons: readonly [
      {
        label: "Read";
        action: "read";
        callback: () => number;
      },
    ];
  }>
>().toEqualTypeOf<number>();

expectTypeOf<
  DialogV2.Internal.ButtonReturnType<{
    buttons: readonly [
      {
        label: "Read";
        action: "read";
      },
    ];
  }>
>().toEqualTypeOf<"read">();

expectTypeOf<
  DialogV2.Internal.ButtonReturnType<{
    buttons: readonly [
      {
        label: "Read";
        readonly action: "read";
        readonly callback?: () => number;
      },
    ];
  }>
>().toEqualTypeOf<number | "read">();

// Both of these would be runtime errors, therefore `never` makes sense.
// This could be prevented by writing `buttons: [Button<unknown>, ...Button<unknown>[]]` but this
// can make ordinary code annoying to write.
expectTypeOf<DialogV2.Internal.ButtonReturnType<{ buttons: [] }>>().toEqualTypeOf<never>();
expectTypeOf<DialogV2.Internal.ButtonReturnType<{ buttons: readonly [] }>>().toEqualTypeOf<never>();

expectTypeOf<
  DialogV2.Internal.ContentFormData<{ content: DialogV2.Content<ChoiceFormData> }>
>().toEqualTypeOf<ChoiceFormData>();
