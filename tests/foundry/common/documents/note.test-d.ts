import { expectTypeOf } from "vitest";

expectTypeOf(new foundry.documents.BaseNote()).toEqualTypeOf<foundry.documents.BaseNote>();

expectTypeOf(new foundry.documents.BaseNote({})).toEqualTypeOf<foundry.documents.BaseNote>();

expectTypeOf(
  new foundry.documents.BaseNote({
    _id: undefined,
    entryId: undefined,
    x: undefined,
    y: undefined,
    icon: undefined,
    iconSize: undefined,
    iconTint: undefined,
    text: undefined,
    fontFamily: undefined,
    fontSize: undefined,
    textAnchor: undefined,
    textColor: undefined,
    flags: undefined,
  }),
).toEqualTypeOf<foundry.documents.BaseNote>();

expectTypeOf(
  new foundry.documents.BaseNote({
    _id: null,
    entryId: null,
    x: null,
    y: null,
    icon: null,
    iconSize: null,
    iconTint: null,
    text: null,
    fontFamily: null,
    fontSize: null,
    textAnchor: null,
    textColor: null,
    flags: null,
  }),
).toEqualTypeOf<foundry.documents.BaseNote>();

expectTypeOf(
  new foundry.documents.BaseNote({
    _id: "bfeabfiea",
    entryId: "bebfegibefaei",
    x: 100,
    y: 300,
    icon: "path/to/some/icon.svg",
    iconSize: 100,
    iconTint: "#FFFFFF",
    text: "Some text",
    fontFamily: "Comic Sans",
    fontSize: 50,
    textAnchor: foundry.CONST.TEXT_ANCHOR_POINTS.TOP,
    textColor: "#FF0000",
    flags: {},
  }),
).toEqualTypeOf<foundry.documents.BaseNote>();

// @ts-expect-error - A textAnchor cannot be an arbitrary number.
new foundry.documents.BaseNote({ textAnchor: 999 });
