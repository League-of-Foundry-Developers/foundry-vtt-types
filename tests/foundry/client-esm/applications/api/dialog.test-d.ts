import { expectTypeOf } from "vitest";

expectTypeOf(await foundry.applications.api.DialogV2.confirm()).toEqualTypeOf<boolean>();
expectTypeOf(await foundry.applications.api.DialogV2.confirm({ rejectClose: true })).toEqualTypeOf<boolean>();
expectTypeOf(await foundry.applications.api.DialogV2.confirm({ rejectClose: false })).toEqualTypeOf<boolean | null>();
expectTypeOf(await foundry.applications.api.DialogV2.confirm({ rejectClose: 3 > 2 })).toEqualTypeOf<boolean | null>();

const numberCallback = async () => 5;
const okButton = {
  callback: numberCallback,
};

expectTypeOf(
  await foundry.applications.api.DialogV2.prompt({
    ok: okButton,
  }),
).toEqualTypeOf<number>();
expectTypeOf(
  await foundry.applications.api.DialogV2.prompt({
    ok: okButton,
    rejectClose: false,
  }),
).toEqualTypeOf<number | null>();
expectTypeOf(
  await foundry.applications.api.DialogV2.prompt({
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
      },
    ],
  }),
).toEqualTypeOf<number | boolean | string>();

expectTypeOf(
  await foundry.applications.api.DialogV2.wait({
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
  }),
).toEqualTypeOf<boolean | string>();
expectTypeOf(
  await foundry.applications.api.DialogV2.wait({
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
