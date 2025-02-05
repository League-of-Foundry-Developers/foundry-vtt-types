import { expectTypeOf } from "vitest";

const DialogV2 = foundry.applications.api.DialogV2;

expectTypeOf(await DialogV2.confirm()).toEqualTypeOf<boolean>();
expectTypeOf(await DialogV2.confirm({ rejectClose: true })).toEqualTypeOf<boolean>();
expectTypeOf(await DialogV2.confirm({ rejectClose: false })).toEqualTypeOf<boolean | null>();
expectTypeOf(await DialogV2.confirm({ rejectClose: 3 > 2 })).toEqualTypeOf<boolean | null>();

const numberCallback = async () => 5;
const okButton = {
  callback: numberCallback,
};

expectTypeOf(
  await DialogV2.prompt({
    ok: okButton,
  }),
).toEqualTypeOf<number>();
expectTypeOf(
  await DialogV2.prompt({
    ok: okButton,
    rejectClose: false,
  }),
).toEqualTypeOf<number | null>();

// note: despite the numeric callback, clicking "ok" returns the string "ok"
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
).toEqualTypeOf<number | boolean | string>();

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
).toEqualTypeOf<number | string>();

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
).toEqualTypeOf<boolean | string | null>();
