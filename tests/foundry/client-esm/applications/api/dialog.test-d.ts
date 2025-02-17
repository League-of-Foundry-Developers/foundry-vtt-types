import { expectTypeOf } from "vitest";

import DialogV2 = foundry.applications.api.DialogV2;

const numberCallback = async () => 5;

expectTypeOf(await DialogV2.confirm()).toEqualTypeOf<boolean | null>();
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

const okButton = {
  callback: numberCallback,
};

expectTypeOf(await DialogV2.prompt()).toEqualTypeOf<string | null>();
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
).toEqualTypeOf<boolean | number | null>();

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
).toEqualTypeOf<number | string | null>();

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
).toEqualTypeOf<boolean | string>();

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
