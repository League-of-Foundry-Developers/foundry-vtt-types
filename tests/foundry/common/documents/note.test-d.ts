import { expectTypeOf } from "vitest";

class TestBaseNote extends foundry.documents.BaseNote {};

expectTypeOf(new TestBaseNote()).toEqualTypeOf<foundry.documents.BaseNote>();

expectTypeOf(new TestBaseNote({})).toEqualTypeOf<foundry.documents.BaseNote>();

expectTypeOf(
  new TestBaseNote({
    _id: undefined,
    entryId: undefined,
    x: undefined,
    y: undefined,
    texture: undefined,
    iconSize: undefined,
    text: undefined,
    fontFamily: undefined,
    fontSize: undefined,
    textAnchor: undefined,
    textColor: undefined,
    flags: undefined,
  }),
).toEqualTypeOf<foundry.documents.BaseNote>();

expectTypeOf(
  new TestBaseNote({
    _id: null,
    entryId: null,
    x: null,
    y: null,
    texture: null,
    iconSize: null,
    text: null,
    fontFamily: null,
    fontSize: null,
    textAnchor: null,
    textColor: null,
    flags: null,
  }),
).toEqualTypeOf<foundry.documents.BaseNote>();

expectTypeOf(
  new TestBaseNote({
    _id: "bfeabfiea",
    entryId: "bebfegibefaei",
    x: 100,
    y: 300,
    texture: {
      src: "path/to/some/icon.svg",
      tint: "#FFFFFF",
    },
    iconSize: 100,
    text: "Some text",
    fontFamily: "Comic Sans",
    fontSize: 50,
    textAnchor: foundry.CONST.TEXT_ANCHOR_POINTS.TOP,
    textColor: "#FF0000",
    flags: {},
  }),
).toEqualTypeOf<foundry.documents.BaseNote>();

// @ts-expect-error - A textAnchor cannot be an arbitrary number.
new TestBaseNote({ textAnchor: 999 });
